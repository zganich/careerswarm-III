import { NextRequest, NextResponse } from 'next/server'
import { callClaude, parseJSON, MODELS } from '@/lib/claude'
import { COMP_ANALYST_SYSTEM, COMP_ANALYST_PROMPT } from '@/lib/prompts/comp-analyst'
import { createClient } from '@/lib/supabase/server'
import type { CompCheckResponse } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const { companyName, roleTitle, jobDescription } = await req.json()

    if (!companyName || !roleTitle || !jobDescription?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: dna } = await supabase
      .from('career_dna')
      .select('min_base, min_ote')
      .eq('user_id', user.id)
      .single()

    if (!dna) {
      return NextResponse.json({ error: 'Complete onboarding first' }, { status: 400 })
    }

    const raw = await callClaude({
      model: MODELS.fast,
      system: COMP_ANALYST_SYSTEM,
      messages: [
        {
          role: 'user',
          content: COMP_ANALYST_PROMPT({
            companyName,
            roleTitle,
            jobDescription,
            minBase: (dna.min_base as string) || 'Not specified',
            minOte: (dna.min_ote as string) || 'Not specified',
          }),
        },
      ],
      maxTokens: 512,
    })

    const result = parseJSON<CompCheckResponse>(raw)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[comp-check]', err)
    return NextResponse.json({ error: 'Comp check failed. Please try again.' }, { status: 500 })
  }
}
