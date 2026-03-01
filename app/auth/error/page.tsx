import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a] mb-6">
            CareerSwarm
          </div>
          <h1 className="font-serif text-4xl font-normal mb-3">
            Link expired
          </h1>
          <p className="text-sm text-[#a09080] leading-relaxed">
            This link is no longer valid. It may have expired or already been used.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="block w-full bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase py-3.5 text-center hover:bg-[#e8a030] transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/forgot-password"
            className="block w-full border border-[#252525] text-[#a09080] font-mono text-xs tracking-[0.1em] uppercase py-3.5 text-center hover:border-[#d4922a] hover:text-[#d4922a] transition-colors"
          >
            Reset Password
          </Link>
        </div>
      </div>
    </div>
  )
}
