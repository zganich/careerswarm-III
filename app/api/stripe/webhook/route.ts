import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import type Stripe from 'stripe'

// Next.js App Router: disable body parsing so we can verify Stripe's signature
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripe/webhook] signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient()

  try {
    switch (event.type) {
      // Payment succeeded — activate Pro
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id
        if (!userId) break

        await supabase
          .from('users')
          .update({
            subscription_status: 'pro',
            stripe_subscription_id: session.subscription as string,
            credits_remaining: 999, // unlimited sentinel for Pro
          })
          .eq('id', userId)
        break
      }

      // Subscription renewed — keep pro active
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id
        if (!subId) break

        await supabase
          .from('users')
          .update({ subscription_status: 'pro', credits_remaining: 999 })
          .eq('stripe_subscription_id', subId)
        break
      }

      // Subscription cancelled or payment failed — downgrade to free
      case 'customer.subscription.deleted':
      case 'invoice.payment_failed': {
        const obj = event.data.object as Stripe.Subscription | Stripe.Invoice
        const subId = 'id' in obj && obj.object === 'subscription'
          ? (obj as Stripe.Subscription).id
          : typeof (obj as Stripe.Invoice).subscription === 'string'
            ? (obj as Stripe.Invoice).subscription as string
            : ((obj as Stripe.Invoice).subscription as Stripe.Subscription | null)?.id

        if (!subId) break

        await supabase
          .from('users')
          .update({ subscription_status: 'free', credits_remaining: 0 })
          .eq('stripe_subscription_id', subId)
        break
      }

      default:
        // Unhandled event type — fine, just ack
        break
    }
  } catch (err) {
    console.error('[stripe/webhook] handler error:', err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
