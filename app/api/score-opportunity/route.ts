import { NextRequest, NextResponse } from 'next/server'
import { callClaude, parseJSON, MODELS } from '@/lib/claude'

export const maxDuration = 60
import { SCORE_OPPORTUNITY_SYSTEM, SCORE_OPPORTUNITY_PROMPT } from '@/lib/prompts/score-opportunity'
import { createClient } from '@/lib/supabase/server'
import type { OpportunityScore } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { jobDescription } = await req.json()

    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: 'Job description required' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Load Career DNA and top achievements
    const [{ data: dna }, { data: achievements }] = await Promise.all([
      supabase.from('career_dna').select('*').eq('user_id', user.id).single(),
      supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .eq('included', true)
        .order('impact', { ascending: false })
        .limit(10),
    ])

    if (!dna) {
      return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 })
    }

    const careerDNASummary = `
Name: ${dna.name}
Title: ${dna.current_title}
Experience: ${dna.years_experience}
Location: ${dna.location}
Industries: ${dna.industries?.join(', ')}
Location Preferences: ${dna.location_preferences?.join(', ')}
Hard Exclusions: ${dna.hard_exclusions?.join(', ')}
Min Base: ${dna.min_base}
Min OTE: ${dna.min_ote}
Superpower: ${dna.superpower}
Domain Skills: ${dna.skills_domain?.join(', ')}
Partner Types: ${dna.skills_partner_types?.join(', ')}
    `.trim()

    const achievementsSummary = (achievements || [])
      .slice(0, 7)
      .map((a) => `• ${a.company} (${a.title}): ${a.metric} — ${a.formatted}`)
      .join('\n')

    const raw = await callClaude({
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
    })

    const score = parseJSON<OpportunityScore>(raw)
    return NextResponse.json(score)
  } catch (err) {
    console.error('[score-opportunity]', err)
    return NextResponse.json({ error: 'Scoring failed. Please try again.' }, { status: 500 })
  }
}
