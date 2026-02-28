'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-6">CareerSwarm</div>
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
          <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a] mb-6">CareerSwarm</div>
          <h1 className="font-serif text-4xl font-normal mb-3">New password</h1>
          <p className="text-sm text-[#a09080]">Choose a strong password for your account.</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] text-sm px-4 py-3 outline-none focus:border-[#d4922a] transition-colors"
              placeholder="Min 8 characters"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] text-sm px-4 py-3 outline-none focus:border-[#d4922a] transition-colors"
              placeholder="Repeat password"
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
            {loading ? 'Updating...' : 'Set New Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
