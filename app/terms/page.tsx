import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#080808] px-10 py-16 max-w-2xl mx-auto">
      <Link href="/" className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a] mb-12 inline-block no-underline hover:text-[#e8a030] transition-colors">
        ← CareerSwarm
      </Link>

      <h1 className="font-serif text-4xl font-normal mb-3">Terms of Service</h1>
      <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#a09080] mb-12">Last updated: March 2026</p>

      <div className="space-y-8 text-[#a09080] text-sm leading-relaxed">
        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">1. Acceptance</h2>
          <p>By creating an account and using CareerSwarm, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">2. Service Description</h2>
          <p>CareerSwarm is an AI-powered career application tool. We use your uploaded resume content to extract career data and generate tailored job application materials. The service is provided as-is and generation quality may vary.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">3. Your Content</h2>
          <p>You retain ownership of all resume content and career data you upload. By uploading content, you grant CareerSwarm a limited license to process it for the purpose of providing the service. We do not sell or share your resume content with third parties.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">4. Subscriptions & Billing</h2>
          <p>Free plans include 3 lifetime generation credits. Pro plans are billed monthly at the stated price. Founding Member pricing is locked for life as long as the subscription remains active. Cancellations take effect at the end of the billing period.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">5. Prohibited Use</h2>
          <p>You may not use CareerSwarm to generate fraudulent content, misrepresent credentials, or violate any applicable laws. We reserve the right to terminate accounts engaged in misuse.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">6. Limitation of Liability</h2>
          <p>CareerSwarm is provided without warranty. We are not liable for employment outcomes, application results, or any indirect damages arising from use of the service.</p>
        </section>

        <section>
          <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#f0ebe0] mb-3">7. Contact</h2>
          <p>
            Questions? Email{' '}
            <a href="mailto:support@careerswarm.com" className="text-[#d4922a] hover:underline">
              support@careerswarm.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
