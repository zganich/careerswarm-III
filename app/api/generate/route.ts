import { NextRequest, NextResponse } from 'next/server'
import { callClaude, parseJSON, MODELS } from '@/lib/claude'
import { TAILOR_RESUME_SYSTEM, TAILOR_RESUME_PROMPT } from '@/lib/prompts/tailor-resume'
import { COVER_LETTER_SYSTEM, COVER_LETTER_PROMPT } from '@/lib/prompts/cover-letter'
import { OUTREACH_SYSTEM, OUTREACH_PROMPT } from '@/lib/prompts/outreach'
import { SCORE_OPPORTUNITY_SYSTEM, SCORE_OPPORTUNITY_PROMPT } from '@/lib/prompts/score-opportunity'
import { createClient } from '@/lib/supabase/server'
import type { GenerateApplicationResponse, OpportunityScore } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const {
      jobDescription,
      companyName,
      roleTitle,
      jobUrl,
      hiringManagerName,
      hiringManagerTitle,
      companyResearch,
    } = await req.json()

    if (!jobDescription?.trim() || !companyName || !roleTitle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check credits for free users
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, credits_remaining, is_beta')
      .eq('id', user.id)
      .single()

    const hasUnlimitedAccess = userData?.is_beta || userData?.subscription_status !== 'free'

    if (!hasUnlimitedAccess && (userData?.credits_remaining ?? 0) <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Upgrade to Pro for unlimited generations.' },
        { status: 402 }
      )
    }

    // Load Career DNA
    const [{ data: dna }, { data: achievements }] = await Promise.all([
      supabase.from('career_dna').select('*').eq('user_id', user.id).single(),
      supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('included', true)
        .order('impact', { ascending: false })
        .limit(15),
    ])

    if (!dna) {
      return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 })
    }

    const careerDNASummary = formatCareerDNA(dna)
    const achievementsSummary = formatAchievements(achievements || [])
    const topAchievement = achievements?.[0]?.formatted || ''

    // Generate resume, cover letter, outreach, and score all in parallel
    const [resumeText, coverLetterText, outreachMessage, scoreRaw] = await Promise.all([
      callClaude({
        model: MODELS.generation,
        system: TAILOR_RESUME_SYSTEM,
        messages: [
          {
            role: 'user',
            content: TAILOR_RESUME_PROMPT({
              careerDNA: careerDNASummary,
              achievements: achievementsSummary,
              jobDescription,
              companyName,
              roleTitle,
              companyResearch,
            }),
          },
        ],
        maxTokens: 3000,
      }),
      callClaude({
        model: MODELS.generation,
        system: COVER_LETTER_SYSTEM,
        messages: [
          {
            role: 'user',
            content: COVER_LETTER_PROMPT({
              careerDNA: careerDNASummary,
              topAchievements: achievementsSummary.split('\n').slice(0, 3).join('\n'),
              jobDescription,
              companyName,
              roleTitle,
              hiringManagerName,
              companyResearch,
            }),
          },
        ],
        maxTokens: 800,
      }),
      callClaude({
        model: MODELS.generation,
        system: OUTREACH_SYSTEM,
        messages: [
          {
            role: 'user',
            content: OUTREACH_PROMPT({
              careerDNA: careerDNASummary,
              topAchievement,
              companyName,
              roleTitle,
              hiringManagerName,
              hiringManagerTitle,
              companyResearch,
            }),
          },
        ],
        maxTokens: 400,
      }),
      // Score in parallel — Career DNA vs JD (no extra wall-clock time)
      callClaude({
        model: MODELS.generation,
        system: SCORE_OPPORTUNITY_SYSTEM,
        messages: [
          {
            role: 'user',
            content: SCORE_OPPORTUNITY_PROMPT({
              jobDescription,
              careerDNA: careerDNASummary,
              achievements: achievementsSummary,
            }),
          },
        ],
        maxTokens: 1024,
      }),
    ])

    // fitScore: career-DNA-vs-JD fit from the Qualifier Agent
    const scoreData = parseJSON<OpportunityScore>(scoreRaw)
    const fitScore = scoreData?.score ?? 70
    const applyRecommendation = scoreData?.apply_recommendation ?? 'Apply Now'

    // atsScore: keyword overlap between generated resume and the JD
    const jdWords = jobDescription.toLowerCase().split(/\W+/).filter((w: string) => w.length > 5)
    const jdKeywords = Array.from(new Set<string>(jdWords))
    const resumeLower = resumeText.toLowerCase()
    const matchedKeywords = jdKeywords.filter((w: string) => resumeLower.includes(w)).length
    const atsScore = jdKeywords.length > 0
      ? Math.min(98, Math.max(55, Math.round((matchedKeywords / jdKeywords.length) * 100)))
      : 75

    const achievementsUsed = (achievements || [])
      .filter((a) => resumeText.includes(a.company))
      .map((a) => a.id)

    // Save to database
    const { data: saved } = await supabase
      .from('generated_applications')
      .insert({
        user_id: user.id,
        job_url: jobUrl || null,
        company_name: companyName,
        role_title: roleTitle,
        job_description: jobDescription,
        resume_text: resumeText,
        cover_letter_text: coverLetterText,
        outreach_message: outreachMessage,
        fit_score: fitScore,
        ats_score: atsScore,
        keywords_matched: countKeywordMatches(jobDescription, resumeText),
        apply_recommendation: applyRecommendation,
        achievements_used: achievementsUsed,
      })
      .select()
      .single()

    // Decrement credits for free non-beta users
    if (!hasUnlimitedAccess) {
      await supabase
        .from('users')
        .update({ credits_remaining: (userData.credits_remaining ?? 1) - 1 })
        .eq('id', user.id)
    }

    const response: GenerateApplicationResponse = {
      resume: resumeText,
      coverLetter: coverLetterText,
      outreachMessage,
      fitScore,
      atsScore,
      keywordsMatched: countKeywordMatches(jobDescription, resumeText),
      achievementsUsed,
    }

    return NextResponse.json({ ...response, applicationId: saved?.id })
  } catch (err) {
    console.error('[generate]', err)
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    )
  }
}

function formatCareerDNA(dna: Record<string, unknown>): string {
  return `
Name: ${dna.name}
Title: ${dna.current_title}
Experience: ${dna.years_experience}
Location: ${dna.location}
Industries: ${(dna.industries as string[])?.join(', ')}
Summary: ${dna.summary}
Superpower: ${dna.superpower}
Differentiator: ${dna.differentiator}
Target Roles: ${(dna.target_titles as string[])?.join(', ')}
CRM: ${(dna.skills_crm as string[])?.join(', ')}
AI Tools: ${(dna.skills_ai as string[])?.join(', ')}
Domain: ${(dna.skills_domain as string[])?.join(', ')}
Partner Types: ${(dna.skills_partner_types as string[])?.join(', ')}
Awards: ${(dna.awards as string[])?.join(', ')}
Certifications: ${(dna.certifications as string[])?.join(', ')}
Work History: ${JSON.stringify(dna.companies, null, 2)}
  `.trim()
}

function formatAchievements(achievements: Record<string, unknown>[]): string {
  return achievements
    .map(
      (a) =>
        `• ${a.company} (${a.title}): ${a.formatted}\n  Metric: ${a.metric}`
    )
    .join('\n')
}

function countKeywordMatches(jd: string, resume: string): number {
  const words = jd
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 5)
  const resumeLower = resume.toLowerCase()
  return words.filter((w) => resumeLower.includes(w)).length
}
