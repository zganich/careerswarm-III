import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { profile, achievements, skills, differentiator, resumeText } = body

    // Upsert Career DNA
    const { data: dna, error: dnaError } = await supabase
      .from('career_dna')
      .upsert({
        user_id: user.id,
        name: profile.name || profile.current_title,
        email: profile.email || user.email,
        phone: profile.phone || null,
        linkedin: profile.linkedin || null,
        location: profile.location || '',
        current_title: profile.current_title || '',
        years_experience: profile.years_experience || '',
        industries: profile.industries || [],
        target_titles: profile.target_titles || [],
        summary: profile.summary || '',
        superpower: profile.superpower || '',
        min_base: profile.min_base || '',
        min_ote: profile.min_ote || '',
        location_preferences: profile.location_preferences || [],
        hard_exclusions: profile.hard_exclusions || [],
        skills_crm: skills.crm || [],
        skills_ai: skills.ai || [],
        skills_domain: skills.domain || [],
        skills_partner_types: skills.partnerTypes || [],
        skills_tools: skills.tools || [],
        certifications: skills.certifications || [],
        awards: skills.awards || [],
        differentiator: differentiator || '',
        companies: profile.companies || [],
        raw_resume_text: resumeText || null,
      })
      .select()
      .single()

    if (dnaError) throw dnaError

    // Delete existing achievements and re-insert (clean slate on re-onboard)
    await supabase.from('achievements').delete().eq('user_id', user.id)

    const achievementRows = achievements
      .filter((a: Record<string, unknown>) => a.included)
      .map((a: Record<string, unknown>) => ({
        user_id: user.id,
        company: a.company,
        title: a.title,
        dates: a.dates || null,
        what: a.what,
        metric: a.metric,
        how: a.how || '',
        timeframe: a.timeframe || null,
        impact: a.impact || 'medium',
        formatted: a.formatted,
        included: true,
      }))

    if (achievementRows.length > 0) {
      const { error: achError } = await supabase
        .from('achievements')
        .insert(achievementRows)
      if (achError) throw achError
    }

    // Mark onboarding complete
    await supabase
      .from('users')
      .update({ onboarding_complete: true })
      .eq('id', user.id)

    return NextResponse.json({ success: true, dnaId: dna.id })
  } catch (err) {
    console.error('[save-dna]', err)
    return NextResponse.json({ error: 'Failed to save Career DNA' }, { status: 500 })
  }
}
