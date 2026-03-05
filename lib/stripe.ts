import Stripe from 'stripe'

// Server-side Stripe singleton — never import this in client components
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

// Price IDs — set in Vercel env vars
export const PRICES = {
  pro: process.env.STRIPE_PRICE_PRO!,
} as const
