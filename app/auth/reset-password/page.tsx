'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => { window.location.href = '/dashboard' }, 2000)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <Link href="/" className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-6 inline-block no-underline">
            CareerSwarm
          </Link>
          <h1 className="font-serif text-4xl font-normal mb-4">Password updated</h1>
          <p className="text-sm text-[#a09080]">Redirecting you to your dashboard...</p>
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
          <h1 className="font-serif text-4xl font-normal mb-3">New password</h1>
          <p className="text-sm text-[#a09080]">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              New Password
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

          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] text-sm px-4 py-3 pr-16 outline-none focus:border-[#d4922a] transition-colors"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-[0.06em] uppercase text-[#a09080] hover:text-[#f0ebe0] transition-colors"
              >
                {showConfirm ? 'Hide' : 'Show'}
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
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
