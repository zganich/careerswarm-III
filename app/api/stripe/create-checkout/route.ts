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

    if (!process.env.STRIPE_PRICE_PRO) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('subscription_status, stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (userData?.subscription_status === 'pro') {
      return NextResponse.json({ error: 'Already on Pro' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://careerswarm.com'

    // Reuse existing customer or create new one
    let customerId = userData?.stripe_customer_id as string | undefined

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { user_id: user.id },
      })
      customerId = customer.id

      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      client_reference_id: user.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PRICE_PRO, quantity: 1 }],
      success_url: `${appUrl}/dashboard?upgraded=1`,
      cancel_url: `${appUrl}/dashboard`,
      subscription_data: {
        metadata: { user_id: user.id },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('[create-checkout]', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
