import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { sendUpgradeConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Payments not configured' }, { status: 503 })
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-02-24.acacia' })

  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook] signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        if (!userId) break

        await supabase
          .from('users')
          .update({
            subscription_status: 'pro',
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
          })
          .eq('id', userId)

        // Send upgrade confirmation email — fire and forget
        const { data: userData } = await supabase
          .from('users')
          .select('email, full_name')
          .eq('id', userId)
          .single()

        if (userData?.email) {
          sendUpgradeConfirmationEmail(userData.email, userData.full_name || '').catch((err) =>
            console.error('[webhook] upgrade email error:', err)
          )
        }

        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id

        if (!userId) break

        const isActive = sub.status === 'active' || sub.status === 'trialing'

        await supabase
          .from('users')
          .update({
            subscription_status: isActive ? 'pro' : 'free',
            stripe_subscription_id: sub.id,
          })
          .eq('id', userId)

        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.user_id

        if (!userId) break

        await supabase
          .from('users')
          .update({
            subscription_status: 'free',
            stripe_subscription_id: null,
            credits_remaining: 3,
          })
          .eq('id', userId)

        break
      }

      default:
        // Unhandled event — not an error
        break
    }
  } catch (err) {
    console.error(`[webhook] failed to process ${event.type}`, err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
