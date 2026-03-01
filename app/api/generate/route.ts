import { NextRequest, NextResponse } from 'next/server'
import { callClaude, parseJSON, MODELS } from '@/lib/claude'
import { TAILOR_RESUME_SYSTEM, TAILOR_RESUME_PROMPT } from '@/lib/prompts/tailor-resume'
import { COVER_LETTER_SYSTEM, COVER_LETTER_PROMPT } from '@/lib/prompts/cover-letter'
import { OUTREACH_SYSTEM, OUTREACH_PROMPT } from '@/lib/prompts/outreach'
import { scoreResume } from '@/lib/ats-scorer'
import { createClient } from '@/lib/supabase/server'
import type { GenerateApplicationResponse } from '@/lib/types'

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

    // Check subscription and credits
    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, credits_remaining')
      .eq('id', user.id)
      .single()

    const isPaid = userData?.subscription_status === 'pro' || userData?.subscription_status === 'premium'

    if (!isPaid && (userData?.credits_remaining ?? 0) <= 0) {
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

    // Generate resume, cover letter, and outreach in parallel — Sonnet handles all three
    const GENERATION_TIMEOUT = 90_000 // 90 seconds

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Generation timed out. Please try again.')), GENERATION_TIMEOUT)
    )

    const [resumeText, coverLetterText, outreachMessage] = await Promise.race([
      Promise.all([
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
      ]),
      timeoutPromise,
    ])

    // Score the generated resume with the real ATS scoring engine
    const scoring = scoreResume(jobDescription, resumeText, dna as Record<string, unknown>)
    const { atsScore, fitScore, keywordsMatched } = scoring

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
        keywords_matched: keywordsMatched,
        apply_recommendation: 'Apply Now',
        achievements_used: achievementsUsed,
      })
      .select()
      .single()

    // Decrement credits for free users only
    if (!isPaid && userData) {
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
      keywordsMatched,
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

