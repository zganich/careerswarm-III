import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#080808] px-10 py-16 max-w-2xl mx-auto">
      <Link href="/" className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a] mb-12 inline-block no-underline hover:text-[#e8a030] transition-colors">
        ← CareerSwarm
      </Link>

      <h1 className="font-serif text-4xl font-normal mb-3">Privacy Policy</h1>
      <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#a09080] mb-12">Last updated: March 2026</p>

      <div className="space-y-8 text-[#a09080] text-sm leading-relaxed">
        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">What We Collect</h2>
          <p>We collect your email address, name, and the resume content you upload or paste. We also collect usage data (which features you use) to improve the service. Payment information is handled by Stripe and never stored on our servers.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">How We Use It</h2>
          <p>Your resume content is used solely to generate Career DNA and application materials for you. We process it through Anthropic&apos;s Claude API. Your data is not used to train AI models. We do not sell, share, or rent your personal data.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">Data Storage</h2>
          <p>Your data is stored in Supabase (PostgreSQL) hosted in the United States. Data is encrypted at rest and in transit. We retain your data for as long as your account is active. You can request deletion at any time.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">Third-Party Services</h2>
          <p>We use Supabase (authentication and database), Anthropic (AI generation), Stripe (payments), and Vercel (hosting). Each has their own privacy policy governing their use of data.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">Your Rights</h2>
          <p>You may request a copy of your data, correction of inaccuracies, or deletion of your account and all associated data by emailing us. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">Cookies</h2>
          <p>We use only essential cookies for authentication (managed by Supabase). We do not use advertising or tracking cookies.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">Contact</h2>
          <p>
            Privacy questions?{' '}
            <a href="mailto:support@careerswarm.com" className="text-[#d4922a] hover:underline">
              support@careerswarm.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
