'use client'

import { useState, useCallback } from 'react'
import type { OnboardingState, ParseResumeResponse } from '@/lib/types'

// ─── PHASE COMPONENTS ────────────────────────────────────────────────────────

function PhaseUpload({
  state,
  setState,
  onNext,
}: {
  state: OnboardingState
  setState: (s: Partial<OnboardingState>) => void
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [files, setFiles] = useState<{ name: string; status: 'processing' | 'done' | 'error' }[]>([])

  async function extractText(file: File): Promise<string> {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext === 'txt' || ext === 'md') {
      return await file.text()
    }
    // For PDF/DOCX, send to server-side extraction
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/extract-file', { method: 'POST', body: fd })
    const data = await res.json()
    return data.text || ''
  }

  async function handleFiles(fileList: FileList) {
    setError('')
    const newFiles = Array.from(fileList)
    setFiles(newFiles.map((f) => ({ name: f.name, status: 'processing' as const })))

    const texts: string[] = []
    for (let i = 0; i < newFiles.length; i++) {
      try {
        const text = await extractText(newFiles[i])
        texts.push(text)
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'done' as const } : f))
        )
      } catch {
        setFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: 'error' as const } : f))
        )
      }
    }

    const combined = texts.join('\n\n---\n\n')
    setState({
      resumeText: state.resumeText
        ? state.resumeText + '\n\n---\n\n' + combined
        : combined,
    })
  }

  async function handleParse() {
    if (!state.resumeText.trim()) {
      setError('Please upload a resume or paste your resume text.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: state.resumeText }),
      })

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Failed to parse resume')
      }

      const data: ParseResumeResponse = await res.json()

      setState({
        profile: {
          ...data.profile,
          name: state.name || (data.profile.name ?? ''),
          email: state.email || (data.profile.email ?? ''),
          linkedin: state.linkedin || (data.profile.linkedin ?? ''),
          location: state.location || (data.profile.location ?? ''),
        },
        achievements: data.achievements,
        skills: data.skills,
        differentiators: data.differentiators || [],
      })

      onNext()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="phase-in">
      <div className="mb-12">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-4 flex items-center gap-3">
          Phase 01 — Resume Upload
          <span className="flex-1 max-w-[60px] h-px bg-[#d4922a]/30" />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-normal leading-tight mb-3">
          Upload your resume.<br /><em className="italic text-[#d4922a]">AI does the rest.</em>
        </h1>
        <p className="text-[15px] text-[#a09080] max-w-lg leading-relaxed">
          Upload all resume versions you have — the more the better. AI synthesizes them into one Career DNA database richer than any single resume.
        </p>
      </div>

      {/* Drop Zone */}
      <label
        className="block border border-dashed border-[#333] hover:border-[#a36e1a] hover:bg-[rgba(212,146,42,0.04)] transition-all p-12 text-center cursor-pointer mb-3"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFiles(e.dataTransfer.files)
        }}
      >
        <div className="text-3xl mb-4 opacity-30">⬆</div>
        <div className="font-mono text-xs tracking-[0.1em] uppercase text-[#a09080] mb-2">
          Drop resume files here
        </div>
        <div className="text-xs text-[#a09080] opacity-50">PDF · DOCX · TXT — multiple files supported</div>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.md"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </label>

      {/* File List */}
      {files.length > 0 && (
        <div className="flex flex-col gap-1.5 mb-4">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-[#111] border border-[#252525] px-3 py-2.5">
              <span className="text-sm">📄</span>
              <span className="flex-1 font-mono text-[11px] text-[#a09080] truncate">{f.name}</span>
              {f.status === 'processing' && (
                <span className="w-3 h-3 border border-[#252525] border-t-[#d4922a] rounded-full spinner" />
              )}
              {f.status === 'done' && <span className="font-mono text-[10px] text-[#27ae60]">Extracted</span>}
              {f.status === 'error' && <span className="font-mono text-[10px] text-[#c0392b]">Failed</span>}
            </div>
          ))}
        </div>
      )}

      {/* Or divider */}
      <div className="flex items-center gap-4 my-5 font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080]">
        <span className="flex-1 h-px bg-[#252525]" />
        or paste directly
        <span className="flex-1 h-px bg-[#252525]" />
      </div>

      {/* Resume Text */}
      <div className="mb-5">
        <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
          Resume Text
        </label>
        <textarea
          value={state.resumeText}
          onChange={(e) => setState({ resumeText: e.target.value })}
          rows={10}
          className="w-full bg-[#111] border border-[#252525] text-[#f0ebe0] font-mono text-xs leading-relaxed p-4 outline-none focus:border-[#a36e1a] transition-colors resize-y"
          placeholder="Paste all resume versions here, separated by ---&#10;The AI will synthesize across all of them."
        />
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[
          { label: 'Full Name', key: 'name', placeholder: 'James Knight' },
          { label: 'Email', key: 'email', placeholder: 'you@email.com' },
          { label: 'LinkedIn', key: 'linkedin', placeholder: 'linkedin.com/in/yourname' },
          { label: 'Location', key: 'location', placeholder: 'Salt Lake City, UT' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-1.5">
              {field.label}
            </label>
            <input
              type="text"
              value={state[field.key as keyof OnboardingState] as string}
              onChange={(e) => setState({ [field.key]: e.target.value })}
              placeholder={field.placeholder}
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

      <div className="flex justify-end pt-6 border-t border-[#252525] mt-10">
        <button
          onClick={handleParse}
          disabled={loading}
          className="bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-[#e8a030] transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-3 h-3 border border-[#080808]/30 border-t-[#080808] rounded-full spinner" />
              Building Career DNA...
            </>
          ) : (
            'Parse My Resume →'
          )}
        </button>
      </div>
    </div>
  )
}

function PhaseConfirm({
  state,
  setState,
  onBack,
  onNext,
}: {
  state: OnboardingState
  setState: (s: Partial<OnboardingState>) => void
  onBack: () => void
  onNext: () => void
}) {
  const p = state.profile
  const [editing, setEditing] = useState<string | null>(null)

  const fields = [
    { id: 'current_title', label: 'Current Title', value: p?.current_title },
    { id: 'years_experience', label: 'Years Experience', value: p?.years_experience },
    { id: 'summary', label: 'Professional Summary', value: p?.summary, multiline: true },
    { id: 'superpower', label: 'Your Superpower', value: p?.superpower, multiline: true },
    { id: 'min_ote', label: 'Minimum OTE Target', value: p?.min_ote },
    { id: 'location', label: 'Location', value: p?.location },
  ]

  function updateField(id: string, value: string) {
    setState({ profile: { ...state.profile, [id]: value } })
  }

  return (
    <div className="phase-in">
      <div className="mb-12">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-4 flex items-center gap-3">
          Phase 02 — Profile Confirmation
          <span className="flex-1 max-w-[60px] h-px bg-[#d4922a]/30" />
        </div>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          AI extracted your profile.<br /><em className="italic text-[#d4922a]">Confirm it.</em>
        </h1>
        <p className="text-[15px] text-[#a09080] max-w-lg leading-relaxed">
          Review what was extracted. Click any field to edit. This becomes the foundation for every application.
        </p>
      </div>

      <div className="flex flex-col gap-3 mb-10">
        {fields.map((field) => (
          <div
            key={field.id}
            className={`border bg-[#111] overflow-hidden transition-colors ${
              editing === field.id ? 'border-[#d4922a]' : 'border-[#252525]'
            }`}
          >
            <div className="px-5 py-3 flex items-center justify-between bg-[#1a1a1a] border-b border-[#252525]">
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#a09080]">
                {field.label}
              </span>
              <button
                onClick={() => setEditing(editing === field.id ? null : field.id)}
                className="font-mono text-[10px] tracking-[0.08em] uppercase text-[#a09080] hover:text-[#d4922a] transition-colors"
              >
                {editing === field.id ? 'Done' : 'Edit'}
              </button>
            </div>
            <div className="px-5 py-4">
              {editing === field.id ? (
                field.multiline ? (
                  <textarea
                    value={(p?.[field.id as keyof typeof p] as string) || ''}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    rows={3}
                    className="w-full bg-transparent text-sm text-[#f0ebe0] outline-none resize-none leading-relaxed"
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={(p?.[field.id as keyof typeof p] as string) || ''}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    className="w-full bg-transparent text-sm text-[#f0ebe0] outline-none"
                    autoFocus
                  />
                )
              ) : (
                <p className="text-sm text-[#f0ebe0] leading-relaxed">
                  {(p?.[field.id as keyof typeof p] as string) || (
                    <span className="text-[#a09080] italic">Not extracted — click Edit to add</span>
                  )}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-[#252525]">
        <button
          onClick={onBack}
          className="font-mono text-xs tracking-[0.08em] uppercase text-[#a09080] hover:text-[#f0ebe0] transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-[#e8a030] transition-colors"
        >
          Continue to Achievements →
        </button>
      </div>
    </div>
  )
}

function PhaseAchievements({
  state,
  setState,
  onBack,
  onNext,
}: {
  state: OnboardingState
  setState: (s: Partial<OnboardingState>) => void
  onBack: () => void
  onNext: () => void
}) {
  const [editingId, setEditingId] = useState<string | null>(null)

  function toggle(tempId: string) {
    setState({
      achievements: state.achievements.map((a) =>
        a.tempId === tempId ? { ...a, included: !a.included } : a
      ),
    })
  }

  function update(tempId: string, formatted: string, metric: string) {
    setState({
      achievements: state.achievements.map((a) =>
        a.tempId === tempId ? { ...a, formatted, metric } : a
      ),
    })
    setEditingId(null)
  }

  const included = state.achievements.filter((a) => a.included).length

  return (
    <div className="phase-in">
      <div className="mb-8">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-4 flex items-center gap-3">
          Phase 03 — Proof Points
          <span className="flex-1 max-w-[60px] h-px bg-[#d4922a]/30" />
        </div>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          Your achievements,<br /><em className="italic text-[#d4922a]">extracted and ranked.</em>
        </h1>
        <p className="text-[15px] text-[#a09080] max-w-lg leading-relaxed">
          AI found {state.achievements.length} achievements across your career history, formatted in Google XYZ.
          Toggle off any that are weak or irrelevant.
        </p>
      </div>

      <div className="font-mono text-[10px] text-[#27ae60] tracking-[0.08em] mb-5">
        {included} of {state.achievements.length} included in Career DNA
      </div>

      <div className="flex flex-col gap-2 mb-10">
        {state.achievements.map((ach) => (
          <div
            key={ach.tempId}
            className={`border transition-all overflow-hidden ${
              ach.included ? 'border-[#252525] bg-[#111]' : 'border-[#1a1a1a] bg-[#0d0d0d] opacity-40'
            }`}
          >
            <div className="flex items-start gap-3 p-4">
              <button
                onClick={() => toggle(ach.tempId)}
                className={`w-5 h-5 border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                  ach.included
                    ? 'bg-[#27ae60] border-[#27ae60]'
                    : 'border-[#333]'
                }`}
              >
                {ach.included && (
                  <svg className="w-2.5 h-2.5" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#080808" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-[#d4922a] mb-1">
                  {ach.company} · {ach.title}
                </div>
                {editingId === ach.tempId ? (
                  <EditAchievement
                    ach={ach}
                    onSave={(f, m) => update(ach.tempId, f, m)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <>
                    <p className="text-sm text-[#f0ebe0] leading-relaxed">{ach.formatted}</p>
                    {ach.metric && (
                      <p className="font-mono text-[11px] text-[#27ae60] mt-1">↑ {ach.metric}</p>
                    )}
                  </>
                )}
              </div>
              {editingId !== ach.tempId && (
                <button
                  onClick={() => setEditingId(ach.tempId)}
                  className="font-mono text-[10px] uppercase text-[#a09080] hover:text-[#d4922a] transition-colors flex-shrink-0"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-[#252525]">
        <button onClick={onBack} className="font-mono text-xs tracking-[0.08em] uppercase text-[#a09080] hover:text-[#f0ebe0] transition-colors">
          ← Back
        </button>
        <button onClick={onNext} className="bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-[#e8a030] transition-colors">
          Continue to Skills →
        </button>
      </div>
    </div>
  )
}

function EditAchievement({
  ach,
  onSave,
  onCancel,
}: {
  ach: { formatted: string; metric: string }
  onSave: (formatted: string, metric: string) => void
  onCancel: () => void
}) {
  const [formatted, setFormatted] = useState(ach.formatted)
  const [metric, setMetric] = useState(ach.metric)

  return (
    <div className="mt-2">
      <textarea
        value={formatted}
        onChange={(e) => setFormatted(e.target.value)}
        rows={3}
        className="w-full bg-[#1a1a1a] border border-[#333] text-[#f0ebe0] text-sm p-3 outline-none focus:border-[#d4922a] transition-colors resize-none mb-2 font-mono text-xs"
      />
      <input
        type="text"
        value={metric}
        onChange={(e) => setMetric(e.target.value)}
        placeholder="Key metric"
        className="w-full bg-[#1a1a1a] border border-[#333] text-[#27ae60] font-mono text-xs p-2.5 outline-none focus:border-[#d4922a] transition-colors mb-3"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSave(formatted, metric)}
          className="font-mono text-[10px] tracking-[0.08em] uppercase border border-[#27ae60] text-[#27ae60] px-4 py-1.5 hover:bg-[rgba(39,174,96,0.08)] transition-colors"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="font-mono text-[10px] tracking-[0.08em] uppercase border border-[#252525] text-[#a09080] px-4 py-1.5 hover:border-[#a09080] transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function PhaseSkills({
  state,
  setState,
  onBack,
  onNext,
}: {
  state: OnboardingState
  setState: (s: Partial<OnboardingState>) => void
  onBack: () => void
  onNext: () => void
}) {
  // Track which skills the user has toggled OFF — keeps all skills visible so
  // they can be re-enabled if toggled off by mistake.
  const [excluded, setExcluded] = useState<Set<string>>(new Set())

  const skillSections = [
    { key: 'crm', label: 'CRM & Sales Tools' },
    { key: 'ai', label: 'AI & Technical Tools' },
    { key: 'domain', label: 'Domain Expertise' },
    { key: 'partnerTypes', label: 'Partnership Types' },
    { key: 'tools', label: 'Analytics & Operations' },
    { key: 'certifications', label: 'Certifications & Awards' },
  ] as const

  function toggleSkill(skill: string) {
    setExcluded((prev) => {
      const next = new Set(prev)
      if (next.has(skill)) next.delete(skill)
      else next.add(skill)
      return next
    })
  }

  const differentiators = state.differentiators

  function handleNext() {
    // Commit excluded skills by filtering them out of the state before saving
    const filtered: OnboardingState['skills'] = {
      crm: (state.skills.crm as string[]).filter((s) => !excluded.has(s)),
      ai: (state.skills.ai as string[]).filter((s) => !excluded.has(s)),
      domain: (state.skills.domain as string[]).filter((s) => !excluded.has(s)),
      partnerTypes: (state.skills.partnerTypes as string[]).filter((s) => !excluded.has(s)),
      tools: (state.skills.tools as string[]).filter((s) => !excluded.has(s)),
      certifications: (state.skills.certifications as string[]).filter((s) => !excluded.has(s)),
      awards: (state.skills.awards as string[]).filter((s) => !excluded.has(s)),
    }
    setState({ skills: filtered })
    onNext()
  }

  return (
    <div className="phase-in">
      <div className="mb-10">
        <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#d4922a] mb-4 flex items-center gap-3">
          Phase 04 — Skills & Differentiators
          <span className="flex-1 max-w-[60px] h-px bg-[#d4922a]/30" />
        </div>
        <h1 className="font-serif text-4xl font-normal leading-tight mb-3">
          Confirm your skills.<br /><em className="italic text-[#d4922a]">Choose your edge.</em>
        </h1>
        <p className="text-[15px] text-[#a09080] max-w-lg leading-relaxed">
          Toggle off skills that are outdated. Then choose the differentiator that opens every cover letter.
        </p>
      </div>

      {skillSections.map(({ key, label }) => {
        const skills = state.skills[key] as string[]
        if (!skills?.length) return null
        return (
          <div key={key} className="mb-8">
            <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-3 pb-2 border-b border-[#252525]">
              {label}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const isExcluded = excluded.has(skill)
                return (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`font-mono text-[11px] px-3.5 py-2 border transition-colors ${
                      isExcluded
                        ? 'border-[#252525] text-[#555] bg-transparent line-through'
                        : 'border-[#d4922a] text-[#d4922a] bg-[rgba(212,146,42,0.08)] hover:bg-[rgba(212,146,42,0.14)]'
                    }`}
                  >
                    {skill}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      {differentiators && differentiators.length > 0 && (
        <div className="mb-10">
          <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#a09080] mb-3 pb-2 border-b border-[#252525]">
            Your Core Differentiator
          </div>
          <p className="text-xs text-[#a09080] mb-4 leading-relaxed">
            This opens every cover letter. Choose the one that&apos;s most true and most compelling.
          </p>
          <div className="flex flex-col gap-2">
            {differentiators.map((d: string, i: number) => (
              <button
                key={i}
                onClick={() => setState({ differentiator: d })}
                className={`flex items-start gap-3 text-left p-4 border transition-all ${
                  state.differentiator === d
                    ? 'border-[#d4922a] bg-[rgba(212,146,42,0.06)]'
                    : 'border-[#252525] bg-[#111] hover:border-[#a36e1a]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    state.differentiator === d ? 'border-[#d4922a] bg-[#d4922a]' : 'border-[#333]'
                  }`}
                >
                  {state.differentiator === d && (
                    <div className="w-1.5 h-1.5 bg-[#080808] rounded-full" />
                  )}
                </div>
                <p className="text-sm text-[#a09080] leading-relaxed">{d}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 border-t border-[#252525]">
        <button onClick={onBack} className="font-mono text-xs tracking-[0.08em] uppercase text-[#a09080] hover:text-[#f0ebe0] transition-colors">
          ← Back
        </button>
        <button onClick={handleNext} className="bg-[#d4922a] text-[#080808] font-mono text-xs tracking-[0.1em] uppercase px-8 py-3.5 hover:bg-[#e8a030] transition-colors">
          Save Career DNA →
        </button>
      </div>
    </div>
  )
}

// ─── MAIN ONBOARDING PAGE ─────────────────────────────────────────────────────

const INITIAL_STATE: OnboardingState = {
  resumeText: '',
  name: '',
  email: '',
  linkedin: '',
  location: '',
  profile: null,
  achievements: [],
  differentiators: [],
  skills: {
    crm: [],
    ai: [],
    domain: [],
    partnerTypes: [],
    tools: [],
    certifications: [],
    awards: [],
  },
  differentiator: '',
  scoredOpportunities: [],
}

const STEPS = ['Upload', 'Confirm', 'Achievements', 'Skills']

export default function OnboardingPage() {
  const [phase, setPhase] = useState(0)
  const [saving, setSaving] = useState(false)
  const [state, setStateRaw] = useState<OnboardingState>(INITIAL_STATE)

  const setState = useCallback((updates: Partial<OnboardingState>) => {
    setStateRaw((prev) => ({ ...prev, ...updates }))
  }, [])

  async function saveDNA() {
    setSaving(true)
    try {
      const res = await fetch('/api/save-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: {
            ...state.profile,
            name: state.name,
            email: state.email,
            linkedin: state.linkedin,
            location: state.location,
          },
          achievements: state.achievements,
          skills: state.skills,
          differentiator: state.differentiator,
          resumeText: state.resumeText,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')
      window.location.href = '/dashboard'
    } catch (err) {
      console.error(err)
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[rgba(8,8,8,0.95)] backdrop-blur border-b border-[#252525] px-10 flex items-center justify-between h-14">
        <div className="font-mono text-xs tracking-[0.12em] uppercase text-[#d4922a]">CareerSwarm</div>
        <div className="flex items-center">
          {STEPS.map((step, i) => (
            <div
              key={step}
              className={`font-mono text-[10px] tracking-[0.1em] uppercase px-5 h-14 flex items-center border-r border-[#252525] relative transition-colors ${
                i === 0 ? 'border-l border-[#252525]' : ''
              } ${
                i === phase
                  ? 'text-[#d4922a]'
                  : i < phase
                  ? 'text-[#27ae60] cursor-pointer'
                  : 'text-[#a09080]'
              }`}
            >
              {i < phase && <span className="mr-1.5">✓</span>}
              {String(i + 1).padStart(2, '0')} {step}
              {i === phase && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4922a]" />
              )}
            </div>
          ))}
          <button
            onClick={async () => {
              await fetch('/api/auth/signout', { method: 'POST' })
              window.location.href = '/auth/login'
            }}
            className="font-mono text-[10px] tracking-[0.1em] uppercase px-5 h-14 flex items-center text-[#a09080] hover:text-[#f0ebe0] transition-colors border-l border-[#252525]"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-10 py-16">
        {phase === 0 && (
          <PhaseUpload state={state} setState={setState} onNext={() => setPhase(1)} />
        )}
        {phase === 1 && (
          <PhaseConfirm state={state} setState={setState} onBack={() => setPhase(0)} onNext={() => setPhase(2)} />
        )}
        {phase === 2 && (
          <PhaseAchievements state={state} setState={setState} onBack={() => setPhase(1)} onNext={() => setPhase(3)} />
        )}
        {phase === 3 && (
          <div>
            <PhaseSkills state={state} setState={setState} onBack={() => setPhase(2)} onNext={saveDNA} />
            {saving && (
              <div className="fixed inset-0 bg-[rgba(8,8,8,0.9)] flex items-center justify-center z-50">
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-[#252525] border-t-[#d4922a] rounded-full spinner mx-auto mb-4" />
                  <p className="font-serif text-2xl font-normal mb-2">Saving Career DNA...</p>
                  <p className="font-mono text-xs text-[#a09080]">Building your permanent achievement database</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
