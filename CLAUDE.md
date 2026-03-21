# CareerSwarm III — Claude Context & Rules

> Read this file at the start of EVERY task before doing anything else.
> Update the "Current State" section after every task completes.

---

## Environment Guide — Which Claude Tool to Use

James works across three Claude environments. Each has a distinct role:

### Claude Code (terminal / VS Code)
**Use for:** All code work. TypeScript fixes, new API routes, React components, Supabase migrations, git commits, Vercel deploys, npm installs, debugging.
**Has:** Full repo access, bash, git, npm, tsc, Vercel CLI.
**Does NOT have:** MCP connections, Cowork skills, document generation.
**How to start:** `cd` into the repo root, run `claude`. CLAUDE.md is auto-loaded.

### Cowork (Claude desktop app)
**Use for:** Documents (docx, pptx, xlsx, PDF), strategy, research, MCP tasks, grant proposals, decks, sprint planning, and anything that produces a file deliverable.
**Has:** Workspace folder at `/sessions/loving-cool-wright/mnt/careerswarm III/`, MCP connections (Vercel, Gmail, Google Calendar, Notion), skills (docx, pptx, pdf, xlsx, humanize, and others).
**Key skills to invoke:** `humanize` — always run on cover letters, outreach copy, and proposal prose before finalizing. `docx` / `pptx` / `pdf` for any document output.
**Does NOT have:** Direct git access or the ability to deploy code.
**How to start:** Open Claude desktop app, select Cowork, open a new session. CLAUDE.md is loaded via the workspace folder.

### Claude Chat (claude.ai — web or mobile)
**Use for:** Quick strategic questions, brainstorming, reviewing a pasted document, thinking through decisions, or any session where you don't have desktop access.
**Has:** Conversation, file uploads (paste or attach), web search.
**Does NOT have:** Workspace folder access, MCP connections, skills, or persistent project context.
**How to use without losing context:**
1. Open claude.ai in browser or the Claude mobile app.
2. Start your message with this block (copy/paste from here):

```
PROJECT CONTEXT — CareerSwarm III
Live URL: https://careerswarm.com | Repo: zganich/careerswarm-III
Stack: Next.js 14 + Supabase + Anthropic SDK + Tailwind + Radix UI
Vercel: Hobby plan (10s function timeout)
[Paste the Current State section below, then ask your question]
```

3. Copy the "Current State" section from this file and paste it after the block above.
4. Ask your question. Claude chat will have enough context to give useful answers.

**For code reviews on mobile:** Copy the relevant file contents directly into the chat. Claude chat can review, suggest fixes, and explain — you then implement in Claude Code when back at your desk.

---

## Handoff Protocol — Switching Environments

When switching from one environment to another mid-task:
1. In the current environment, note what was just completed and what is next.
2. Update the "Current State" section of this file (Cowork and Claude Code can both write here).
3. In the new environment, read this file top to bottom before touching anything.

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
- [x] **Phase 2 — DONE:** Stripe checkout, webhooks, portal, upgrade UI all wired
- [ ] **Phase 3 — NOT STARTED:** Exa/Perplexity job discovery, Vercel cron, Resend email alerts, .docx downloads
- [ ] **Phase 4 — NOT STARTED:** Mobile dashboard, team/coach accounts, analytics, referral

### Known Issues / Next Up
- Stripe env vars must be set in Vercel: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_PRO
- Stripe webhook endpoint must be registered in Stripe dashboard: https://careerswarm.com/api/stripe/webhook
- `maxDuration = 90` in `parse-resume` only works on Vercel Pro; currently on Hobby (10s limit)
- Schema gaps (identified Mar 2026, not yet migrated): `career_dna` missing `role_family`, `career_narrative`, `consolidation_status`; `achievements` missing `source_resume_id`; tables `roasts` and `guest_sessions` not yet created — required for Resume Roast and guest session features
- Persona hardcoding: 7 locations in codebase still use hardcoded partnerships/BD persona — do not add more. Fix is Sprint 0 (`lib/role-taxonomy.ts`)
- Immediate funding actions: IBM Impact Accelerator (submit before March 25 2026 — proposal drafted, needs fact-check and humanize pass before submission), Microsoft for Startups (microsoft.com/startups, free $6K, ~5 min), Anthropic startup credits (claude.ai/programs/startups)
- IBM proposal CRITICAL flag: proposal claims "paying subscribers" and "paying customers" but Stripe is not live. Must correct before submission or it is a material misrepresentation.
- Notion Mission Control built March 16 2026 — 10 domain pages covering all business areas. URL: https://www.notion.so/325b12ea6b738114b859d4c11f82f9aa
- GITHUB-REFERENCE.md committed and live in repo root — non-technical git guide for James.
- OpenClaw integration planned (Phase 3): personal AI agent platform connecting CareerSwarm to WhatsApp/Slack/Telegram via SOUL.md config. Architecture documented in Notion.

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
15. **End-of-session ritual:** Before closing, ask: "Was anything learned, decided, corrected, or preferred in this session that future Claude sessions should know?" If yes, add it to the Decisions Log or Learnings section below. This is how the file compounds — every session should leave it slightly smarter than it was.

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

---

## Decisions Log

Architectural and strategic decisions with the reasoning behind them. Do not reverse these without understanding the original reason first. If a decision needs to change, update this log with why.

| Decision | What was chosen | Why — do not revert without reading this |
|----------|----------------|------------------------------------------|
| PDF parsing library | `unpdf` v1 | `pdf-parse` crashes on Vercel serverless/edge functions due to native binary dependencies. `unpdf` is a serverless-first PDF.js wrapper with zero native deps. Replaced in Phase 1. |
| AI model routing | Sonnet for generation, Haiku for scoring/extraction | Hobby plan has a 10s function timeout. Opus times out. Haiku handles simple extraction fast and cheap. Never use Opus on Hobby. Constants live in `lib/claude.ts` as `MODELS.generation` and `MODELS.fast`. |
| Git branching | Single `main` branch | Single developer, no PRs needed until a technical co-founder joins. Simplifies the workflow. Revisit at Phase 4 when team hiring starts. |
| Database | Supabase | Built-in auth, RLS, storage, and real-time. Reduces external service count vs. PlanetScale + Auth0 + S3. All tables scoped to `auth.uid() = user_id` via RLS. |
| Career DNA as master database | Master Profile, not static resume | Every generated resume is a derived output from the Master Profile. The Profile never shrinks when tailoring — it only grows. This is the core product moat. Do not redesign this pattern. |
| Persona hardcoding | Scheduled for Sprint 0 refactor | Codebase currently has hardcoded partnerships/BD persona in 7 locations (`onboarding/page.tsx`, `lib/prompts/parse-resume.ts`, `lib/prompts/extract-skills.ts`, `lib/prompts/score-opportunity.ts`, `app/page.tsx`, and others). Fix is `lib/role-taxonomy.ts` as single source of truth with parameterized prompts. Do NOT add more hardcoded partnerships references anywhere. |
| /roast page auth | Unprotected route | Resume Roast is the top-of-funnel acquisition tool — no account required. Do not add `/roast` to the protected paths in `middleware.ts`. Guest sessions use `session_token` in localStorage and link to account post-signup. |
| Stripe status | Wired but not live | Stripe checkout, webhooks, and portal are built. Env vars (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO`) are NOT yet set in Vercel. Webhook is NOT yet registered in Stripe dashboard. Do not assume Stripe is functional until both are confirmed. |
| Humanization layer | Shared prompt constant, not post-processing | Humanization rules belong at the end of each prompt in `lib/prompts/` (cover-letter, outreach, resume summary section) as a shared `HUMANIZATION_RULES` constant — not as a separate API call. One import, all agents inherit the change. |
| Document generation (Cowork) | JS generator scripts + docx npm | Pattern: write a Node.js generator script in `/sessions/loving-cool-wright/careerswarm-spec/`, run with `node`, copy output `.docx`/`.pptx` to workspace folder. The local npm project at that path has `docx` and `pptxgenjs` installed. |

---

## Learnings

Preferences, repeated corrections, and patterns James has established. Every Claude session in every environment should read this before starting work. Add to this list whenever a preference is stated or a mistake is corrected.

**Writing & tone**
- James prefers prose over bullet points in proposals, strategy documents, and any long-form writing. Use bullets only when the content is genuinely list-like (e.g., a feature comparison table, a checklist).
- Never use em dashes (—) in any generated content — resumes, cover letters, proposals, or code comments. Use a comma, a period, or restructure the sentence.
- Never use the words "genuinely," "straightforward," or "honestly" in any output.
- IBM proposal and founder-facing documents use first-person voice for narrative sections (Problem Statement, Team, Closing). Keep this consistent across all versions.
- When writing founder narrative, lead with the human story before the statistics. The story earns the numbers; the numbers don't earn the story.
- Always run the `humanize` skill on cover letters, outreach copy, and proposal prose before finalizing (Cowork only — invoke via skill tool).

**Code & architecture**
- Never suggest reverting a decision that is documented in the Decisions Log without first reading the reason and flagging the conflict explicitly.
- `maxDuration = 90` in `parse-resume/route.ts` only works on Vercel Pro. On Hobby, the limit is 10s. Do not increase timeouts — optimize for speed or queue the work instead.
- Always check `lib/types.ts` before adding new fields to any component or API route. Type changes have downstream effects across consuming components and routes.
- When adding a new Supabase table or column, write the migration SQL in `supabase/migrations/` with a timestamped filename. Never alter the schema directly in the Supabase dashboard without a corresponding migration file.

**Workflow**
- At the end of every session (Claude Code or Cowork), update the Current State section and ask the end-of-session ritual question (Rule 15). This is not optional — it is how context persists.
- When switching environments mid-task, note what was just completed and what is next before closing. The next environment reads this file first.
- James works across three environments: Claude Code (code), Cowork (documents + MCP), Claude Chat (mobile/strategic). See Environment Guide at the top of this file for task routing.

**Business context**
- CareerSwarm is pre-revenue but live. The product works. The blockers to revenue are Stripe env vars (not set) and top-of-funnel (Resume Roast not built yet).
- Entity formation (Utah LLC) is in progress. Grant applications (IBM Impact Accelerator deadline March 25 2026, Microsoft for Startups, Anthropic startup credits) are the immediate funding priority.
- James is both the founder and the target user — a partnerships/BD executive who lived the job search problem firsthand. This is not a pivot or a business school exercise. The founder story belongs in all external-facing materials.
- Never let grant or investor materials claim "paying subscribers" or "paying customers" until Stripe is confirmed live. This is a material misrepresentation risk.

**Workflow (updated March 16 2026)**
- James wants Claude to decide top priorities, not present options. Be direct. Lead with the most important thing.
- James is not technical. Explain git/code concepts in plain English. GITHUB-REFERENCE.md in workspace root is the reference guide.
- Cowork updates to CLAUDE.md must be committed and pushed via Claude Code to sync with GitHub. Remind James of this at end of session.
- Notion Mission Control (https://www.notion.so/325b12ea6b738114b859d4c11f82f9aa) is the business operating system. Update it when domain status changes.
- End-of-session command: James says "end of session" or "update CLAUDE.md" -- update Current State, add any new learnings, then remind him to open Claude Code and push the CLAUDE.md change.
