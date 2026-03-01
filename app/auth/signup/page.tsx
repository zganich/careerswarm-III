'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  async function handleResend() {
    setResending(true)
    setResent(false)
    await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    setResent(true)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <Link href="/" className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-6 inline-block no-underline">
            CareerSwarm
          </Link>
          <h1 className="font-serif text-4xl font-normal mb-4">Check your email</h1>
          <p className="text-sm text-[#a09080] leading-relaxed mb-2">
            We sent a confirmation link to <strong className="text-[#f0ebe0]">{email}</strong>.
            Click it to verify your account and start building your Career DNA.
          </p>
          <p className="text-xs text-[#6b6055] font-mono mb-8">
            Can&apos;t find it? Check your spam or junk folder.
          </p>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full border border-[#252525] text-[#a09080] font-mono text-[10px] tracking-[0.08em] uppercase py-3 hover:border-[#d4922a] hover:text-[#d4922a] transition-colors disabled:opacity-40 mb-3"
          >
            {resending ? 'Sending...' : resent ? 'Sent! Check your inbox' : 'Resend confirmation email'}
          </button>

          <Link
            href="/auth/login"
            className="block w-full font-mono text-[10px] tracking-[0.08em] uppercase text-[#6b6055] hover:text-[#a09080] transition-colors py-2"
          >
            Already verified? Sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Link href="/" className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a] mb-6 inline-block no-underline">
            CareerSwarm
          </Link>
          <h1 className="font-serif text-4xl font-normal mb-3">
            Create account
          </h1>
          <p className="text-sm text-[#a09080]">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-[#d4922a] hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] text-sm px-4 py-3 outline-none focus:border-[#d4922a] transition-colors"
              placeholder="Full Name"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] text-sm px-4 py-3 outline-none focus:border-[#d4922a] transition-colors"
              placeholder="you@email.com"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] text-sm px-4 py-3 pr-16 outline-none focus:border-[#d4922a] transition-colors"
                placeholder="Min 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.06em] uppercase text-[#a09080] hover:text-[#f0ebe0] transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-xs text-[#c0392b] border border-[#c0392b] bg-[rgba(192,57,43,0.08)] px-3 py-2 font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase py-3.5 hover:bg-[#e8a030] transition-colors disabled:opacity-40"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-[10px] text-[#6b6055] text-center font-mono leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="hover:text-[#a09080] transition-colors underline">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="hover:text-[#a09080] transition-colors underline">Privacy Policy</Link>.
            {' '}Free plan · No credit card required.
          </p>
        </form>
      </div>
    </div>
  )
}
