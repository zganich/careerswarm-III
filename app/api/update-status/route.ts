import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ApplicationStatus } from '@/lib/types'

const VALID_STATUSES: ApplicationStatus[] = [
  'generated', 'submitted', 'interviewing', 'offer', 'rejected', 'withdrawn',
]

export async function PATCH(req: NextRequest) {
  try {
    const { applicationId, status } = await req.json()

    if (!applicationId || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const updates: Record<string, unknown> = { status }
    if (status === 'submitted') updates.submitted_at = new Date().toISOString()
    if (status === 'offer') updates.got_offer = true
    if (status === 'interviewing') updates.got_interview = true

    const { error } = await supabase
      .from('generated_applications')
      .update(updates)
      .eq('id', applicationId)
      .eq('user_id', user.id) // RLS double-check

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[update-status]', err)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
