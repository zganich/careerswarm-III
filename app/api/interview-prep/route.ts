import { NextRequest, NextResponse } from 'next/server'
import { callClaude, MODELS } from '@/lib/claude'
import { INTERVIEW_PREP_SYSTEM, INTERVIEW_PREP_PROMPT } from '@/lib/prompts/interview-prep'
import { createClient } from '@/lib/supabase/server'
import type { Achievement } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { companyName, roleTitle, jobDescription } = await req.json()

    if (!companyName || !roleTitle || !jobDescription?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [{ data: dna }, { data: achievements }] = await Promise.all([
      supabase
        .from('career_dna')
        .select('name, current_title, years_experience, industries, target_titles, superpower, differentiator, skills_domain, skills_partner_types, companies')
        .eq('user_id', user.id)
        .single(),
      supabase
        .from('achievements')
        .select('company, title, metric, formatted, impact')
        .eq('user_id', user.id)
        .eq('included', true)
        .order('impact', { ascending: false })
        .limit(5),
    ])

    if (!dna) {
      return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 })
    }

    const careerDNA = `
Name: ${dna.name}
Title: ${dna.current_title}
Experience: ${dna.years_experience}
Industries: ${(dna.industries as string[])?.join(', ') || 'Not specified'}
Target Roles: ${(dna.target_titles as string[])?.join(', ') || 'Not specified'}
Superpower: ${dna.superpower}
Differentiator: ${dna.differentiator}
Domain Skills: ${(dna.skills_domain as string[])?.join(', ') || 'Not specified'}
Partner Types: ${(dna.skills_partner_types as string[])?.join(', ') || 'Not specified'}
    `.trim()

    const achievementsSummary = (achievements as Achievement[] || [])
      .map((a) => `- ${a.company} (${a.title}): ${a.metric} - ${a.formatted}`)
      .join('\n')

    const brief = await callClaude({
      model: MODELS.generation,
      system: INTERVIEW_PREP_SYSTEM,
      messages: [
        {
          role: 'user',
          content: INTERVIEW_PREP_PROMPT({
            companyName,
            roleTitle,
            jobDescription,
            careerDNA,
            achievements: achievementsSummary,
          }),
        },
      ],
      maxTokens: 1500,
    })

    return NextResponse.json({ brief })
  } catch (err) {
    console.error('[interview-prep]', err)
    return NextResponse.json({ error: 'Interview prep failed. Please try again.' }, { status: 500 })
  }
}
