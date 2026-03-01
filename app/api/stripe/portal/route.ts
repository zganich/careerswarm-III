import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(_req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: userData } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!userData?.stripe_customer_id) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerswarm.com'

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id as string,
      return_url: `${appUrl}/dashboard`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (err) {
    console.error('[portal]', err)
    return NextResponse.json({ error: 'Failed to open billing portal' }, { status: 500 })
  }
}
