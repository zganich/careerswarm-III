import { NextRequest, NextResponse } from 'next/server'
import { callClaude, parseJSON, MODELS } from '@/lib/claude'
import { PARSE_RESUME_SYSTEM, PARSE_RESUME_PROMPT } from '@/lib/prompts/parse-resume'
import { EXTRACT_ACHIEVEMENTS_SYSTEM, EXTRACT_ACHIEVEMENTS_PROMPT } from '@/lib/prompts/extract-achievements'
import { EXTRACT_SKILLS_SYSTEM, EXTRACT_SKILLS_PROMPT } from '@/lib/prompts/extract-skills'
import { createClient } from '@/lib/supabase/server'
import type { ParseResumeResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText || resumeText.trim().length < 100) {
      return NextResponse.json({ error: 'Resume text too short' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Run extractions sequentially to stay within Vercel Hobby's 10s limit.
    // Input is capped at 8000 chars per call to keep latency predictable.
    const text = resumeText.slice(0, 8000)

    // Use MODELS.fast (Haiku) for all three extraction calls — structured JSON
    // extraction does not need Sonnet, and three sequential Sonnet calls exceed
    // the 10s Hobby function timeout. Haiku handles this well within budget.
    const profileRaw = await callClaude({
      model: MODELS.fast,
      system: PARSE_RESUME_SYSTEM,
      messages: [{ role: 'user', content: PARSE_RESUME_PROMPT(text) }],
      maxTokens: 2048,
    }).catch((e) => { throw new Error(`profile extraction failed: ${e.message}`) })

    const achievementsRaw = await callClaude({
      model: MODELS.fast,
      system: EXTRACT_ACHIEVEMENTS_SYSTEM,
      messages: [{ role: 'user', content: EXTRACT_ACHIEVEMENTS_PROMPT(text) }],
      maxTokens: 4096,
    }).catch((e) => { throw new Error(`achievements extraction failed: ${e.message}`) })

    const skillsRaw = await callClaude({
      model: MODELS.fast,
      system: EXTRACT_SKILLS_SYSTEM,
      messages: [{ role: 'user', content: EXTRACT_SKILLS_PROMPT(text) }],
      maxTokens: 2048,
    }).catch((e) => { throw new Error(`skills extraction failed: ${e.message}`) })

    const profile = parseJSON<Record<string, unknown>>(profileRaw)
    const achievementsParsed = parseJSON<{ achievements?: Record<string, unknown>[] }>(achievementsRaw)
    const achievements = achievementsParsed?.achievements ?? []
    const skills = parseJSON<Record<string, unknown>>(skillsRaw)

    // Tag each achievement with a tempId for client-side toggling
    const taggedAchievements = achievements.map((a, i) => ({
      ...a,
      tempId: `ach-${i}`,
      included: true,
    }))

    const response: ParseResumeResponse = {
      profile: profile as ParseResumeResponse['profile'],
      achievements: taggedAchievements as ParseResumeResponse['achievements'],
      skills: {
        crm: (skills.crm as string[]) || [],
        ai: (skills.ai as string[]) || [],
        domain: (skills.domain as string[]) || [],
        partnerTypes: (skills.partner_types as string[]) || [],
        tools: (skills.tools as string[]) || [],
        certifications: (skills.certifications as string[]) || [],
        awards: (skills.awards as string[]) || [],
      },
      differentiators: (skills.differentiators as string[]) || [],
    }

    return NextResponse.json(response)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const stack = err instanceof Error ? err.stack : undefined
    console.error('[parse-resume] error:', msg)
    console.error('[parse-resume] stack:', stack)
    console.error('[parse-resume] full:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
    return NextResponse.json(
      { error: 'Failed to parse resume. Please try again.' },
      { status: 500 }
    )
  }
}
