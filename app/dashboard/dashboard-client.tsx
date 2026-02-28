'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import type { GenerateApplicationResponse, OpportunityScore, ApplicationStatus } from '@/lib/types'

type Tab = 'generate' | 'pipeline' | 'dna'

interface Props {
  user: User
  userData: Record<string, unknown>
  dna: Record<string, unknown>
  achievements: Record<string, unknown>[]
  applications: Record<string, unknown>[]
}

export default function DashboardClient({ user, userData, dna, achievements, applications }: Props) {
  const [tab, setTab] = useState<Tab>('generate')

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(8,8,8,0.95)] backdrop-blur border-b border-[#252525] px-10 flex items-center justify-between h-14">
        <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a]">CareerSwarm</div>
        <div className="flex items-center gap-6">
          {/* Credits badge */}
          {userData.subscription_status === 'free' && (
            <div className="font-mono text-[10px] tracking-[0.08em] text-[#a09080]">
              <span className="text-[#f0ebe0]">{userData.credits_remaining as number}</span> resumes remaining
            </div>
          )}
          {userData.subscription_status === 'pro' && (
            <div className="font-mono text-[10px] tracking-[0.08em] text-[#27ae60]">Pro · Unlimited</div>
          )}
          <a href="/auth/login" className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#a09080] hover:text-[#f0ebe0] transition-colors">
            Sign Out
          </a>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-10 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-3">
            Career DNA Active
          </div>
          <h1 className="font-serif text-4xl font-normal">
            {dna.name as string}
          </h1>
          <p className="text-sm text-[#a09080] mt-1">
            {dna.current_title as string} · {achievements.length} achievements in database
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#252525] mb-10">
          {([
            { key: 'generate', label: 'Generate Application' },
            { key: 'pipeline', label: 'Pipeline' },
            { key: 'dna', label: 'Career DNA' },
          ] as { key: Tab; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`font-mono text-[10px] tracking-[0.1em] uppercase px-5 pb-4 relative transition-colors ${
                tab === key ? 'text-[#d4922a]' : 'text-[#a09080] hover:text-[#f0ebe0]'
              }`}
            >
              {label}
              {tab === key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4922a]" />
              )}
            </button>
          ))}
        </div>

        {tab === 'generate' && (
          <GenerateTab dna={dna} achievements={achievements} userData={userData} />
        )}
        {tab === 'pipeline' && (
          <PipelineTab applications={applications} />
        )}
        {tab === 'dna' && (
          <DNATab dna={dna} achievements={achievements} />
        )}
      </div>
    </div>
  )
}

// ─── GENERATE TAB ─────────────────────────────────────────────────────────────

function GenerateTab({
  dna,
  achievements,
  userData,
}: {
  dna: Record<string, unknown>
  achievements: Record<string, unknown>[]
  userData: Record<string, unknown>
}) {
  const [jd, setJd] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [step, setStep] = useState<'input' | 'scoring' | 'scored' | 'generating' | 'done'>('input')
  const [score, setScore] = useState<OpportunityScore | null>(null)
  const [result, setResult] = useState<GenerateApplicationResponse | null>(null)
  const [activeDoc, setActiveDoc] = useState<'resume' | 'cover' | 'outreach'>('resume')
  const [error, setError] = useState('')

  async function handleScore() {
    if (!jd.trim()) { setError('Paste a job description to score.'); return }
    setError('')
    setStep('scoring')

    try {
      const res = await fetch('/api/score-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setScore(data)
      if (!company && data.company) setCompany(data.company)
      if (!role && data.role) setRole(data.role)
      setStep('scored')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scoring failed')
      setStep('input')
    }
  }

  async function handleGenerate() {
    if (userData.subscription_status === 'free' && (userData.credits_remaining as number) <= 0) {
      setError('No credits remaining. Upgrade to Pro.')
      return
    }
    setStep('generating')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jd, companyName: company, roleTitle: role, jobUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
      setStep('scored')
    }
  }

  function reset() {
    setJd(''); setCompany(''); setRole(''); setJobUrl('')
    setStep('input'); setScore(null); setResult(null); setError('')
  }

  const scoreClass =
    score && score.score >= 75 ? 'text-[#27ae60]' :
    score && score.score >= 50 ? 'text-[#f39c12]' : 'text-[#c0392b]'

  return (
    <div className="phase-in">
      {(step === 'input' || step === 'scoring') && (
        <div>
          <div className="mb-6">
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-2">
              Job Description
            </label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={12}
              className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] font-mono text-xs leading-relaxed p-4 outline-none focus:border-[#a36e1a] transition-colors resize-y"
              placeholder="Paste the complete job posting here. The Qualifier Agent reads every line before any generation begins."
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Company Name', value: company, set: setCompany, placeholder: 'RunPod' },
              { label: 'Role Title', value: role, set: setRole, placeholder: 'Head of Partnerships' },
              { label: 'Job URL (optional)', value: jobUrl, set: setJobUrl, placeholder: 'https://...' },
            ].map((f) => (
              <div key={f.label} className={f.label.includes('URL') ? 'col-span-2' : ''}>
                <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
                  {f.label}
                </label>
                <input
                  type="text"
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] text-sm px-3 py-2.5 outline-none focus:border-[#a36e1a] transition-colors"
                />
              </div>
            ))}
          </div>
          {error && (
            <div className="font-mono text-xs text-[#c0392b] border border-[#c0392b] bg-[rgba(192,57,43,0.08)] px-3 py-2 mb-4">
              {error}
            </div>
          )}
          <button
            onClick={handleScore}
            disabled={step === 'scoring'}
            className="bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-[#e8a030] transition-colors disabled:opacity-40 flex items-center gap-2"
          >
            {step === 'scoring' ? (
              <>
                <span className="w-3 h-3 border border-[#080808]/30 border-t-[#080808] rounded-full spinner" />
                Qualifying...
              </>
            ) : 'Score This Role →'}
          </button>
        </div>
      )}

      {step === 'scored' && score && (
        <div className="phase-in">
          {/* Score Card */}
          <div className="border border-[#252525] bg-[#111] mb-6 overflow-hidden">
            <div className="flex items-center justify-between p-6 bg-[#1a1a1a] border-b border-[#252525]">
              <div>
                <div className="font-serif text-2xl font-normal">{score.company}</div>
                <div className="text-sm text-[#a09080] mt-1">{score.role}</div>
              </div>
              <div className={`text-center ${scoreClass}`}>
                <div className="font-serif text-5xl font-normal">{score.score}</div>
                <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#a09080] mt-1">Match Score</div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Location', value: `${score.location_status}`, ok: score.location_ok },
                  { label: 'Compensation', value: score.comp_estimate, ok: score.comp_ok },
                  { label: 'Role Fit', value: score.role_fit, ok: score.role_fit === 'Strong' || score.role_fit === 'Good' },
                  { label: 'Recommendation', value: score.apply_recommendation, ok: score.apply_recommendation === 'Apply Now' },
                ].map((chip) => (
                  <div key={chip.label} className="border border-[#252525] p-3">
                    <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#a09080] mb-1">{chip.label}</div>
                    <div className={`text-xs font-mono ${chip.ok ? 'text-[#27ae60]' : 'text-[#f39c12]'}`}>
                      {chip.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                {score.reasons.map((r, i) => (
                  <div key={i} className="flex gap-3 py-2.5 border-b border-[#1a1a1a] text-sm">
                    <span className="flex-shrink-0">{r.icon}</span>
                    <span className="text-[#a09080]">{r.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#1a1a1a] border border-[#252525] p-4 text-sm text-[#a09080] leading-relaxed">
                <strong className="text-[#f0ebe0] font-normal">Verdict: </strong>
                {score.verdict}
              </div>
            </div>
          </div>

          {error && (
            <div className="font-mono text-xs text-[#c0392b] border border-[#c0392b] bg-[rgba(192,57,43,0.08)] px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              className="bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-[#e8a030] transition-colors"
            >
              Generate Full Package →
            </button>
            <button
              onClick={reset}
              className="border border-[#252525] text-[#a09080] font-mono text-xs tracking-[0.1em] uppercase px-6 py-3.5 hover:border-[#a09080] hover:text-[#f0ebe0] transition-colors"
            >
              Score Different Role
            </button>
          </div>
        </div>
      )}

      {step === 'generating' && (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-2 border-[#252525] border-t-[#d4922a] rounded-full spinner mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-normal mb-3">Generating your package...</h2>
          <p className="font-mono text-xs text-[#a09080]">Resume · Cover Letter · Outreach Message</p>
          <p className="font-mono text-xs text-[#a09080] mt-1 opacity-50">Usually under 2 minutes</p>
        </div>
      )}

      {step === 'done' && result && (
        <div className="phase-in">
          {/* Score summary */}
          <div className="flex items-center gap-4 mb-8 p-4 border border-[#252525] bg-[#111]">
            <div className="font-mono text-[10px] tracking-[0.08em] text-[#27ae60]">
              ATS Score: {result.atsScore}/100
            </div>
            <div className="w-px h-4 bg-[#252525]" />
            <div className="font-mono text-[10px] tracking-[0.08em] text-[#27ae60]">
              Fit Score: {result.fitScore}/100
            </div>
            <div className="w-px h-4 bg-[#252525]" />
            <div className="font-mono text-[10px] tracking-[0.08em] text-[#a09080]">
              {result.keywordsMatched} keywords matched
            </div>
            <div className="ml-auto">
              <button onClick={reset} className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#a09080] hover:text-[#d4922a] transition-colors">
                New Application →
              </button>
            </div>
          </div>

          {/* Doc tabs */}
          <div className="flex border-b border-[#252525] mb-5">
            {([
              { key: 'resume', label: 'Resume' },
              { key: 'cover', label: 'Cover Letter' },
              { key: 'outreach', label: 'LinkedIn Outreach' },
            ] as { key: 'resume' | 'cover' | 'outreach'; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveDoc(key)}
                className={`font-mono text-[10px] tracking-[0.1em] uppercase px-5 pb-3 relative transition-colors ${
                  activeDoc === key ? 'text-[#d4922a]' : 'text-[#a09080] hover:text-[#f0ebe0]'
                }`}
              >
                {label}
                {activeDoc === key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4922a]" />}
              </button>
            ))}
          </div>

          <div className="relative">
            <pre className="bg-[#111] border border-[#252525] p-6 font-mono text-xs text-[#f0ebe0] leading-relaxed whitespace-pre-wrap overflow-auto max-h-[600px]">
              {activeDoc === 'resume' && result.resume}
              {activeDoc === 'cover' && result.coverLetter}
              {activeDoc === 'outreach' && result.outreachMessage}
            </pre>
            <button
              onClick={() => {
                const text = activeDoc === 'resume' ? result.resume : activeDoc === 'cover' ? result.coverLetter : result.outreachMessage
                navigator.clipboard.writeText(text)
              }}
              className="absolute top-3 right-3 font-mono text-[10px] tracking-[0.08em] uppercase bg-[#1a1a1a] border border-[#252525] text-[#a09080] px-3 py-1.5 hover:border-[#a09080] hover:text-[#f0ebe0] transition-colors"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PIPELINE TAB ─────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  generated: 'text-[#a09080]',
  submitted: 'text-[#3498db]',
  interviewing: 'text-[#f39c12]',
  offer: 'text-[#27ae60]',
  rejected: 'text-[#c0392b]',
  withdrawn: 'text-[#a09080]',
}

function PipelineTab({ applications }: { applications: Record<string, unknown>[] }) {
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all')

  const filtered =
    filter === 'all' ? applications : applications.filter((a) => a.status === filter)

  const counts = applications.reduce((acc: Record<string, number>, a) => {
    const s = a.status as string
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  return (
    <div className="phase-in">
      {/* Status filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {(['all', 'generated', 'submitted', 'interviewing', 'offer', 'rejected'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-mono text-[10px] tracking-[0.08em] uppercase px-4 py-2 border transition-colors ${
              filter === s
                ? 'border-[#d4922a] text-[#d4922a] bg-[rgba(212,146,42,0.08)]'
                : 'border-[#252525] text-[#a09080] hover:border-[#a09080]'
            }`}
          >
            {s === 'all' ? `All (${applications.length})` : `${s} (${counts[s] || 0})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 border border-[#252525] bg-[#111]">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-3">No applications yet</div>
          <p className="text-sm text-[#a09080]">Generate your first application package to start tracking your pipeline.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((app) => (
            <div key={app.id as string} className="border border-[#252525] bg-[#111] p-5 flex items-center gap-5">
              <div className="flex-1 min-w-0">
                <div className="font-serif text-lg font-normal mb-0.5">{app.company_name as string}</div>
                <div className="text-sm text-[#a09080]">{app.role_title as string}</div>
              </div>
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-center">
                  <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#a09080] mb-0.5">Fit</div>
                  <div className="font-serif text-xl text-[#d4922a]">{app.fit_score as number}</div>
                </div>
                <div className="text-center">
                  <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#a09080] mb-0.5">ATS</div>
                  <div className="font-serif text-xl text-[#27ae60]">{app.ats_score as number}</div>
                </div>
                <div className={`font-mono text-[10px] tracking-[0.08em] uppercase ${STATUS_COLORS[app.status as ApplicationStatus]}`}>
                  {app.status as string}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── DNA TAB ──────────────────────────────────────────────────────────────────

function DNATab({
  dna,
  achievements,
}: {
  dna: Record<string, unknown>
  achievements: Record<string, unknown>[]
}) {
  const sections = [
    { label: 'Professional Summary', value: dna.summary as string },
    { label: 'Superpower', value: dna.superpower as string },
    { label: 'Differentiator', value: dna.differentiator as string },
    { label: 'Target Roles', value: (dna.target_titles as string[])?.join(' · ') },
    { label: 'Industries', value: (dna.industries as string[])?.join(' · ') },
    { label: 'Compensation Floor', value: `Base: ${dna.min_base} · OTE: ${dna.min_ote}` },
  ]

  const skillSections = [
    { label: 'CRM', skills: dna.skills_crm as string[] },
    { label: 'AI Tools', skills: dna.skills_ai as string[] },
    { label: 'Domain', skills: dna.skills_domain as string[] },
    { label: 'Partner Types', skills: dna.skills_partner_types as string[] },
  ]

  return (
    <div className="phase-in">
      <div className="grid grid-cols-2 gap-3 mb-8">
        {sections.map((s) => (
          <div key={s.label} className={`border border-[#252525] bg-[#111] p-5 ${s.label.includes('Summary') || s.label.includes('Differentiator') ? 'col-span-2' : ''}`}>
            <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#a09080] mb-2">{s.label}</div>
            <p className="text-sm text-[#f0ebe0] leading-relaxed">{s.value || '—'}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-4 pb-2 border-b border-[#252525]">
          Skills Profile
        </div>
        <div className="grid grid-cols-2 gap-6">
          {skillSections.map(({ label, skills }) => (
            <div key={label}>
              <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#a09080] mb-2">{label}</div>
              <div className="flex flex-wrap gap-1.5">
                {skills?.map((s) => (
                  <span key={s} className="font-mono text-[10px] px-2.5 py-1 border border-[#252525] text-[#a09080]">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-4 pb-2 border-b border-[#252525]">
          Achievement Library ({achievements.length} proof points)
        </div>
        <div className="flex flex-col gap-2">
          {achievements.map((a) => (
            <div key={a.id as string} className="border border-[#252525] bg-[#111] p-4">
              <div className="font-mono text-[9px] tracking-[0.1em] uppercase text-[#d4922a] mb-1.5">
                {a.company as string} · {a.title as string}
              </div>
              <p className="text-sm text-[#f0ebe0] leading-relaxed">{a.formatted as string}</p>
              {!!a.metric && (
                <p className="font-mono text-[11px] text-[#27ae60] mt-1.5">↑ {String(a.metric)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
