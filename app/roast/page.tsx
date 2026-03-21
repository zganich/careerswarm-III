'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { RoastResult } from '@/app/api/roast/route'

type Phase = 'input' | 'loading' | 'results'

const GRADE_COLOR: Record<string, string> = {
  A: '#4ade80',
  B: '#86efac',
  C: '#fbbf24',
  D: '#f97316',
  F: '#ef4444',
}

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return '#4ade80'
  if (score >= 60) return '#fbbf24'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

export default function RoastPage() {
  const [phase, setPhase] = useState<Phase>('input')
  const [resumeText, setResumeText] = useState('')
  const [result, setResult] = useState<RoastResult | null>(null)
  const [error, setError] = useState('')

  async function handleRoast() {
    if (!resumeText.trim()) return
    setError('')
    setPhase('loading')

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
        setPhase('input')
        return
      }
      setResult(data)
      setPhase('results')
    } catch {
      setError('Network error. Please try again.')
      setPhase('input')
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; color: #e8dcc8; font-family: 'DM Mono', monospace; }
        ::placeholder { color: #4a4035; }
        textarea:focus { outline: 1px solid #d4922a; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .fade-in { animation: fadeUp .5s ease forwards; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .pulse { animation: pulse 1.5s ease-in-out infinite; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, width: '100%', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(4px)', borderBottom: '1px solid #1a1a1a' }}>
        <Link href="/" style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: '0.12em', color: '#d4922a', textTransform: 'uppercase', textDecoration: 'none' }}>CareerSwarm</Link>
        <Link href="/auth/signup" style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#080808', background: '#d4922a', padding: '10px 22px', textDecoration: 'none' }}>
          Fix My Resume Free
        </Link>
      </nav>

      <main style={{ minHeight: '100vh', padding: '100px 24px 80px', maxWidth: 760, margin: '0 auto' }}>

        {/* INPUT PHASE */}
        {phase === 'input' && (
          <div className="fade-in">
            <div style={{ marginBottom: 12, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d4922a' }}>
              Resume Roast
            </div>
            <h1 style={{ fontSize: 'clamp(28px,5vw,48px)', fontWeight: 400, lineHeight: 1.15, marginBottom: 16, color: '#e8dcc8' }}>
              Find out why you&apos;re not<br />getting callbacks.
            </h1>
            <p style={{ fontSize: 14, color: '#a09080', marginBottom: 40, lineHeight: 1.7 }}>
              Paste your resume. Get a brutally honest score in 10 seconds.<br />No account needed.
            </p>

            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              style={{ width: '100%', height: 320, background: '#0f0f0f', border: '1px solid #2a2018', color: '#e8dcc8', fontFamily: "'DM Mono',monospace", fontSize: 13, padding: 20, resize: 'vertical', lineHeight: 1.7 }}
            />

            {error && (
              <div style={{ marginTop: 12, fontSize: 12, color: '#ef4444' }}>{error}</div>
            )}

            <button
              onClick={handleRoast}
              disabled={resumeText.trim().length < 100}
              style={{ marginTop: 16, width: '100%', padding: '18px 0', background: resumeText.trim().length >= 100 ? '#d4922a' : '#2a2018', color: resumeText.trim().length >= 100 ? '#080808' : '#4a4035', fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: resumeText.trim().length >= 100 ? 'pointer' : 'not-allowed' }}
            >
              Roast My Resume
            </button>

            <p style={{ marginTop: 16, fontSize: 11, color: '#4a4035', textAlign: 'center', letterSpacing: '0.08em' }}>
              Free. No signup. Powered by AI.
            </p>
          </div>
        )}

        {/* LOADING PHASE */}
        {phase === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 24 }}>
            <div className="spinner" style={{ width: 32, height: 32, border: '2px solid #2a2018', borderTopColor: '#d4922a', borderRadius: '50%' }} />
            <div className="pulse" style={{ fontSize: 13, color: '#a09080', letterSpacing: '0.1em' }}>Reading your resume...</div>
          </div>
        )}

        {/* RESULTS PHASE */}
        {phase === 'results' && result && (
          <div className="fade-in">
            {/* Score header */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#d4922a', marginBottom: 12 }}>
                Resume Roast Results
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 20 }}>
                <span style={{ fontSize: 72, fontWeight: 300, color: SCORE_COLOR(result.total_score), lineHeight: 1 }}>
                  {result.total_score}
                </span>
                <span style={{ fontSize: 16, color: '#4a4035' }}>/100</span>
                <span style={{ fontSize: 48, fontWeight: 300, color: GRADE_COLOR[result.grade] || '#e8dcc8', lineHeight: 1 }}>
                  {result.grade}
                </span>
              </div>
              <div style={{ fontSize: 16, color: '#e8dcc8', lineHeight: 1.5, maxWidth: 560 }}>
                {result.headline}
              </div>
            </div>

            {/* Dimensions */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4a4035', marginBottom: 20 }}>
                Breakdown
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {result.dimensions.map((dim) => (
                  <div key={dim.name} style={{ background: '#0f0f0f', padding: '20px 24px', borderLeft: `3px solid ${SCORE_COLOR(dim.score * 5)}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#a09080' }}>{dim.name}</span>
                      <span style={{ fontSize: 18, fontWeight: 300, color: SCORE_COLOR(dim.score * 5) }}>{dim.score}<span style={{ fontSize: 11, color: '#4a4035' }}>/20</span></span>
                    </div>
                    <div style={{ fontSize: 13, color: '#c8b89a', lineHeight: 1.6, marginBottom: 6 }}>{dim.verdict}</div>
                    <div style={{ fontSize: 12, color: '#7a6a58', lineHeight: 1.5 }}>
                      <span style={{ color: '#d4922a' }}>Fix: </span>{dim.fix}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What worked + top priority */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, marginBottom: 48 }}>
              <div style={{ background: '#0a120a', padding: '20px 24px', borderLeft: '3px solid #4ade80' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4ade80', marginBottom: 10 }}>What&apos;s Working</div>
                <div style={{ fontSize: 13, color: '#c8b89a', lineHeight: 1.6 }}>{result.biggest_win}</div>
              </div>
              <div style={{ background: '#120a0a', padding: '20px 24px', borderLeft: '3px solid #f97316' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f97316', marginBottom: 10 }}>Fix This First</div>
                <div style={{ fontSize: 13, color: '#c8b89a', lineHeight: 1.6 }}>{result.top_priority}</div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: '#0f0f0f', border: '1px solid #2a2018', padding: '32px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#a09080', marginBottom: 12, lineHeight: 1.7 }}>{result.cta_hook}</div>
              <div style={{ fontSize: 16, color: '#e8dcc8', marginBottom: 24, fontWeight: 400 }}>
                CareerSwarm rebuilds your resume from your full career history.<br />
                <span style={{ color: '#d4922a' }}>Tailored to every job in under 2 minutes.</span>
              </div>
              <Link href="/auth/signup" style={{ display: 'inline-block', padding: '16px 40px', background: '#d4922a', color: '#080808', fontFamily: "'DM Mono',monospace", fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Fix My Resume Free
              </Link>
              <div style={{ marginTop: 12, fontSize: 11, color: '#4a4035', letterSpacing: '0.08em' }}>
                Free plan includes Career DNA builder + 3 tailored resumes/month
              </div>
            </div>

            {/* Roast again */}
            <button
              onClick={() => { setPhase('input'); setResult(null); setResumeText(''); }}
              style={{ marginTop: 24, background: 'transparent', border: '1px solid #2a2018', color: '#4a4035', fontFamily: "'DM Mono',monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 24px', cursor: 'pointer', width: '100%' }}
            >
              Roast a Different Resume
            </button>
          </div>
        )}
      </main>
    </>
  )
}
