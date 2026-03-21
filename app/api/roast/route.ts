import { NextRequest, NextResponse } from 'next/server'
import { callClaude, parseJSON } from '@/lib/claude'
import { ROAST_SYSTEM, ROAST_PROMPT } from '@/lib/prompts/roast'

// No auth required — this is the top-of-funnel acquisition route.
// Uses Haiku for speed and cost. No Career DNA needed.

const HAIKU_MODEL = 'claude-haiku-4-5-20251001'

export interface RoastResult {
  total_score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  headline: string
  dimensions: {
    name: string
    score: number
    verdict: string
    fix: string
  }[]
  biggest_win: string
  top_priority: string
  cta_hook: string
}

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText?.trim()) {
      return NextResponse.json({ error: 'Resume text required' }, { status: 400 })
    }

    if (resumeText.trim().length < 100) {
      return NextResponse.json({ error: 'Resume too short — paste the full text' }, { status: 400 })
    }

    const raw = await callClaude({
      model: HAIKU_MODEL,
      system: ROAST_SYSTEM,
      messages: [
        {
          role: 'user',
          content: ROAST_PROMPT(resumeText),
        },
      ],
      maxTokens: 1024,
    })

    const result = parseJSON<RoastResult>(raw)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[roast]', err)
    return NextResponse.json({ error: 'Roast failed. Please try again.' }, { status: 500 })
  }
}
