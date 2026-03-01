'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AuthErrorContent() {
  const params = useSearchParams()
  const errorCode = params.get('error') ?? ''
  const errorDesc = params.get('error_description') ?? ''

  // Determine if this looks like a signup/verification error vs a password reset error
  const isPasswordReset = errorDesc.toLowerCase().includes('reset') || errorCode === 'otp_expired'
  const isSignup = errorDesc.toLowerCase().includes('signup') || errorDesc.toLowerCase().includes('confirm')

  let title = 'Link expired'
  let message = 'This link is no longer valid. It may have expired or already been used.'

  if (errorDesc) {
    // Humanize common Supabase error descriptions
    if (errorDesc.toLowerCase().includes('expired')) {
      title = 'Link expired'
      message = 'This link has expired (links are valid for 24 hours). Request a new one below.'
    } else if (errorDesc.toLowerCase().includes('already') || errorDesc.toLowerCase().includes('used')) {
      title = 'Already used'
      message = 'This link has already been used. Sign in to access your account.'
    } else if (errorDesc.toLowerCase().includes('invalid')) {
      title = 'Invalid link'
      message = 'This link is invalid. It may have been copied incorrectly. Try again below.'
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Link href="/" className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a] mb-6 inline-block no-underline">
            CareerSwarm
          </Link>
          <h1 className="font-serif text-4xl font-normal mb-3">
            {title}
          </h1>
          <p className="text-sm text-[#a09080] leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase py-3.5 text-center hover:bg-[#e8a030] transition-colors"
          >
            Sign In
          </Link>
          {!isSignup && (
            <Link
              href="/auth/forgot-password"
              className="block w-full border border-[#252525] text-[#a09080] font-mono text-xs tracking-[0.1em] uppercase py-3.5 text-center hover:border-[#d4922a] hover:text-[#d4922a] transition-colors"
            >
              {isPasswordReset ? 'Request New Reset Link' : 'Reset Password'}
            </Link>
          )}
          {isSignup && (
            <Link
              href="/auth/signup"
              className="block w-full border border-[#252525] text-[#a09080] font-mono text-xs tracking-[0.1em] uppercase py-3.5 text-center hover:border-[#d4922a] hover:text-[#d4922a] transition-colors"
            >
              Back to Sign Up
            </Link>
          )}
          <a
            href="mailto:support@careerswarm.com"
            className="block w-full text-center font-mono text-[10px] tracking-[0.08em] uppercase text-[#6b6055] hover:text-[#a09080] transition-colors py-2"
          >
            Contact support →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a] mb-6">CareerSwarm</div>
          <h1 className="font-serif text-4xl font-normal mb-3">Link expired</h1>
          <p className="text-sm text-[#a09080] leading-relaxed">This link is no longer valid.</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}
