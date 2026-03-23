import { NextRequest, NextResponse } from 'next/server'
import { callClaude, MODELS } from '@/lib/claude'
import { COMPANY_RESEARCH_SYSTEM, COMPANY_RESEARCH_PROMPT } from '@/lib/prompts/company-research'
import { createClient } from '@/lib/supabase/server'

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
      .select('name, current_title, years_experience, industries, target_titles, superpower, differentiator, skills_domain, skills_partner_types, location_preferences')
      .eq('user_id', user.id)
      .single()

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
Location Preferences: ${(dna.location_preferences as string[])?.join(', ') || 'Not specified'}
    `.trim()

    const report = await callClaude({
      model: MODELS.fast,
      system: COMPANY_RESEARCH_SYSTEM,
      messages: [
        {
          role: 'user',
          content: COMPANY_RESEARCH_PROMPT({ companyName, roleTitle, jobDescription, careerDNA }),
        },
      ],
      maxTokens: 1024,
    })

    return NextResponse.json({ report })
  } catch (err) {
    console.error('[company-research]', err)
    return NextResponse.json({ error: 'Research failed. Please try again.' }, { status: 500 })
  }
}
