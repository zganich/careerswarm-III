# CareerSwarm III — Claude Context & Rules

> Read this file at the start of EVERY task before doing anything else.
> Update the "Current State" section after every task completes.

---

## Project Overview

**CareerSwarm III** is a multi-tenant Next.js SaaS that gives job seekers their own AI-powered agent swarm. Users upload their resume once, build their Career DNA, and the swarm handles discovery, scoring, materials generation, outreach, interview prep, and pipeline tracking.

- **Live URL:** https://careerswarm.com
- **Repo:** https://github.com/zganich/careerswarm-III
- **Vercel project:** `careerswarm-iii` (team: `jknight3-gmailcoms-projects`)
- **Supabase project:** `grcnfkxmmrboavlbqnqs` — https://grcnfkxmmrboavlbqnqs.supabase.co
- **Stack:** Next.js 14 (App Router) + Supabase (auth + DB) + Anthropic SDK + Tailwind + Radix UI
- **Node version on Vercel:** 24.x
- **Vercel plan:** Hobby (10s function timeout — keep this in mind for API routes)

---

## Owner / Candidate Profile

- **Name:** James Knight
- **Email:** jknight3@gmail.com
- **Target roles:** Head of Partnerships, VP Partnerships, Director Strategic Alliances
- **Location:** Cottonwood Heights, UT (SLC metro) — Remote or SLC only
- **Comp floor:** $200K+ OTE

---

## Current State (update after every task)

### Infrastructure — ALL GREEN as of Mar 5, 2026
- [x] Git: `main` is default branch on GitHub, local and origin in sync, working tree clean
- [x] Vercel: Live on `main`, careerswarm.com attached, latest build READY (56s)
- [x] Supabase tables: `users`, `career_dna`, `achievements`, `generated_applications` — all exist
- [x] Supabase auth: site_url = `https://careerswarm.com`, redirect URLs set for all envs, `mailer_autoconfirm = true`
- [x] Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL` confirmed pointing at correct project
- [x] GitHub default branch: fixed from `claude/chat-claude-code-integration-BzsLN` → `main`
- [x] TypeScript: 0 errors (`tsc --noEmit` passes clean)
- [x] PDF parsing: replaced pdf-parse with `unpdf` v1 (serverless-first PDF.js wrapper — zero-dep, works on Vercel Hobby)
- [x] Nav: Sign Out now calls `supabase.auth.signOut()` properly (was bare `<a>` link, session never cleared)
- [x] Nav: Landing page has Sign In link for returning users

### Build Phase Status
- [x] **Phase 0 — DONE:** Career DNA onboarding wizard, opportunity scoring, application package generator, localStorage prototype
- [x] **Phase 1 — DONE:** Next.js App Router scaffold, Supabase auth, all API routes, dashboard wired to Supabase, prompts for all 7 agent functions
- [ ] **Phase 2 — NOT STARTED:** Stripe payments integration (installed but not wired)
- [ ] **Phase 3 — NOT STARTED:** Exa/Perplexity job discovery, Vercel cron, Resend email alerts, .docx downloads
- [ ] **Phase 4 — NOT STARTED:** Mobile dashboard, team/coach accounts, analytics, referral

### Known Issues / Next Up
- Stripe keys exist in `.env.local.example` but are not integrated — Phase 2
- `maxDuration = 90` in `parse-resume` only works on Vercel Pro; currently on Hobby (10s limit)

---

## Rules — Follow Every Time

### Before starting any task
1. Run `git status` and `git log --oneline -5` to understand current state
2. Read this file (CLAUDE.md) top to bottom
3. If touching any `.ts` or `.tsx` file, run `tsc --noEmit` first to know the baseline error count

### While working
4. Never commit directly to `main` without running `tsc --noEmit` and confirming 0 errors
5. Never use `em dashes (—)` in any output, resume, or cover letter content
6. Never hallucinate metrics — all achievement numbers must come from the user's Career DNA
7. Always check if a change in one file affects types, consuming components, or API routes before committing
8. Keep API routes under Vercel's 10s Hobby limit — use `MODELS.generation` (Sonnet), not `MODELS.synthesis` (Opus), unless on Pro

### After every task
9. Run `tsc --noEmit` — must be 0 errors before committing
10. `git add` only the files changed for that task (never `git add -A` blindly)
11. Commit with a clear message describing what changed and why
12. `git push origin main`
13. Update the "Current State" section of this file and commit the update
14. Confirm the Vercel build triggered and passed before marking task complete

### Git workflow
- Branch: always work on `main` for this project (single dev, no PRs needed until Phase 2+)
- Commit style: `fix:`, `feat:`, `chore:`, `docs:` prefixes
- Never force push, never skip hooks

---

## Key Files Map

| File | Purpose |
|------|---------|
| `app/page.tsx` | Landing page (generic, no personal data) |
| `app/onboarding/page.tsx` | 4-phase Career DNA wizard |
| `app/dashboard/dashboard-client.tsx` | Main dashboard (Generate / Pipeline / DNA tabs) |
| `app/api/parse-resume/route.ts` | Extracts Career DNA from resume text (Sonnet x3 parallel) |
| `app/api/extract-file/route.ts` | Server-side PDF/DOCX text extraction |
| `app/api/generate/route.ts` | Generates resume + cover letter + outreach in parallel |
| `app/api/score-opportunity/route.ts` | Scores job opportunity 0-100 against Career DNA |
| `app/api/save-dna/route.ts` | Saves Career DNA + achievements to Supabase |
| `lib/claude.ts` | Anthropic client wrapper + MODELS constants |
| `lib/types.ts` | All TypeScript interfaces (CareerDNA, Achievement, etc.) |
| `lib/prompts/` | All agent prompt files (7 agents) |
| `lib/supabase/` | Supabase client (server + browser) |
| `middleware.ts` | Auth protection — redirects unauthenticated users |
| `supabase/migrations/` | Schema SQL — already applied to hosted project |
| `ARCHITECTURE.md` | Full product roadmap and data model |
| `00_ORCHESTRATOR.md` | Master agent definition |
| `01_JOB_DISCOVERY.md` through `09_COMPENSATION_ANALYST.md` | Agent definitions |

---

## Infrastructure Credentials (for CLI use only — never commit)

- **Supabase URL:** `https://grcnfkxmmrboavlbqnqs.supabase.co`
- **Supabase project ref:** `grcnfkxmmrboavlbqnqs`
- **Vercel team:** `team_uGoV76kKTxBjxeh6GMSsbgfD`
- **Vercel project ID:** `prj_Wj43kVfLzQAhtrPZF8IsHCwbBhqA`
- **GitHub repo:** `zganich/careerswarm-III`

---

## Agent Roster (9 agents)

| Agent | File | Status in Product |
|-------|------|------------------|
| Orchestrator | `00_ORCHESTRATOR.md` | Scoring logic built into `score-opportunity` route |
| Job Discovery | `01_JOB_DISCOVERY.md` | Phase 3 (needs Exa API + cron) |
| Company Research | `02_COMPANY_RESEARCH.md` | Phase 1 — prompt ready, no dedicated route yet |
| Location Verifier | `03_LOCATION_VERIFIER.md` | Built into scoring prompt |
| Resume Tailor | `04_RESUME_TAILOR.md` | Live — `lib/prompts/tailor-resume.ts` |
| Cover Letter | `05_COVER_LETTER.md` | Live — `lib/prompts/cover-letter.ts` |
| Outreach | `06_OUTREACH.md` | Live — `lib/prompts/outreach.ts` |
| Interview Prep | `07_INTERVIEW_PREP.md` | Phase 1 — prompt exists, no route yet |
| Pipeline Tracker | `08_PIPELINE_TRACKER.md` | Dashboard live, Supabase-backed |
| Comp Analyst | `09_COMPENSATION_ANALYST.md` | Phase 1 — prompt ready, no route yet |

---

## Pricing Model (current)
- **Free:** 3 tailored resumes/month, Career DNA builder, opportunity scoring
- **Pro (Founding Member):** $49/mo — unlimited resumes, cover letters, outreach, ATS scoring, weekly alerts
- Stripe integration is Phase 2 — not yet active
