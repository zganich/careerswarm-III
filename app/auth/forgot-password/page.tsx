'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const supabase = createClient()

  async function sendReset(addr: string) {
    return supabase.auth.resetPasswordForEmail(addr, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await sendReset(email)

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
    await sendReset(email)
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
            We sent a password reset link to <strong className="text-[#f0ebe0]">{email}</strong>.
            Click it to set a new password.
          </p>
          <p className="text-xs text-[#6b6055] font-mono mb-8">
            Can&apos;t find it? Check your spam or junk folder.
          </p>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full border border-[#252525] text-[#a09080] font-mono text-[10px] tracking-[0.08em] uppercase py-3 hover:border-[#d4922a] hover:text-[#d4922a] transition-colors disabled:opacity-40 mb-3"
          >
            {resending ? 'Sending...' : resent ? 'Sent! Check your inbox' : 'Resend reset link'}
          </button>

          <Link
            href="/auth/login"
            className="block w-full font-mono text-[10px] tracking-[0.08em] uppercase text-[#6b6055] hover:text-[#a09080] transition-colors py-2"
          >
            ← Back to sign in
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
          <h1 className="font-serif text-4xl font-normal mb-3">Reset password</h1>
          <p className="text-sm text-[#a09080]">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
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
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <div className="text-center">
            <Link href="/auth/login" className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#a09080] hover:text-[#f0ebe0] transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
