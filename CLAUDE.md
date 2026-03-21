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

### Cowork (Claude desktop app) — PRIMARY ENVIRONMENT
**Use for:** Everything. Code edits, database ops, browser testing, documents, grants, strategy, MCP tasks, git push. This is the single control center.
**Has:** Workspace folder, MCP connections (Vercel, Gmail, Google Calendar, Notion), skills (docx, pptx, pdf, xlsx), Supabase API access, GitHub push via token, Claude in Chrome for browser testing.
**CLI credentials available in this session:**
- Supabase personal access token: stored, use Management API at `https://api.supabase.com/v1/projects/grcnfkxmmrboavlbqnqs/database/query`
- Supabase service role key: available via API key endpoint (fetch fresh each session)
- GitHub token: set in git remote URL — `git push origin main` works directly from Cowork
**Key skills to invoke:** `docx` / `pptx` / `pdf` for document output.
**Does NOT have:** `npm install`, `tsc --noEmit` (TypeScript compile check) — for these only, use Claude Code.
**How to start:** Open Claude desktop app, select Cowork. CLAUDE.md is loaded via workspace folder.

### Claude Projects (claude.ai — web or mobile)
**Use for:** Quick strategic questions, brainstorming, reviewing a pasted document, thinking through decisions, or any session where you don't have desktop access.
**Has:** Conversation, file uploads, web search, and persistent project context via CLAUDE-PROJECT-BRIEF.md as a knowledge file.
**Does NOT have:** Workspace folder access, MCP connections, or skills.
**How to use:** Open the CareerSwarm III project in claude.ai. Context is loaded automatically from the knowledge file — no need to paste anything. Just ask your question.
**Keeping context current:** At the end of any Cowork session where state changed, regenerate CLAUDE-PROJECT-BRIEF.md and re-upload it to the Claude Project knowledge file.
**For code reviews on mobile:** Copy the relevant file contents directly into the chat. Claude Projects can review, suggest fixes, and explain — implement in Claude Code when back at your desk.

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

## Current State (update after every task)

### Infrastructure — Last updated Mar 21, 2026 (end of session 3)
- [x] Git: `main` is default branch, GitHub token wired into remote — Cowork can push directly
- [x] Vercel: Live on `main`, careerswarm.com attached, latest build READY (commit 9889677)
- [x] Supabase tables: `users`, `career_dna`, `achievements`, `generated_applications` — all exist
- [x] Supabase `is_beta` column: LIVE — applied via Management API on Mar 20
- [x] James user row: EXISTS — `is_beta = true`, `onboarding_complete = false`
- [x] Supabase auth: site_url = `https://careerswarm.com`, redirect URLs set, `mailer_autoconfirm = true`
- [x] Vercel env vars: `NEXT_PUBLIC_SUPABASE_URL` confirmed pointing at correct project
- [x] TypeScript: 0 errors (last confirmed Mar 16)
- [x] PDF parsing: `unpdf` v1 — live
- [x] Onboarding placeholders: FIXED and deployed (PR #4 merged, commit e19f2d3)
- [x] Parse-resume timeout fix: sequential calls, 8000 char cap — DEPLOYED
- [x] Test user created: `tester@careerswarm.com` / `TestUser2026!` — confirmed in auth + users table
- [x] Stale PR #1 closed on GitHub
- [x] IBM proposal polished: `CareerSwarm-IBM-Impact-Proposal-POLISHED.docx` saved to workspace — READY TO SUBMIT (uses james@careerswarm.com)
- [x] Anthropic credits application drafted: `CareerSwarm-Anthropic-Credits-Application.docx` saved to workspace — includes all field answers + submission guide (uses james@careerswarm.com)
- [x] Primary email updated to james@careerswarm.com across all project files, docs, and scheduled tasks
- [x] Claude Projects setup: CLAUDE-PROJECT-BRIEF.md + CLAUDE-PROJECTS-SETUP.md created in workspace
- [x] Power user playbook: POWER-USER-PLAYBOOK.md created in workspace
- [x] Scheduled tasks live: `careerswarm-morning-briefing` (weekdays 8am) + `ibm-deadline-alert` (Mar 24 8am)
- [x] Stale IBM proposal drafts deleted (FINAL.docx + original .docx removed — POLISHED.docx is the only version)
- [ ] James must complete onboarding at careerswarm.com to set `onboarding_complete = true` and create `career_dna` row — required to access dashboard
- [x] Claude Projects setup complete: CareerSwarm III project created, CLAUDE-PROJECT-BRIEF.md added as knowledge file
- [ ] Run morning briefing task once manually (Scheduled sidebar) to pre-approve Gmail + Vercel tool access
- [x] Git index.lock cleared by Claude Code session Mar 21 — repo is clean
- [ ] Stripe env vars still not set in Vercel (see Known Issues)

### Build Phase Status
- [x] **Phase 0 — DONE:** Career DNA onboarding wizard, opportunity scoring, application package generator, localStorage prototype
- [x] **Phase 1 — DONE:** Next.js App Router scaffold, Supabase auth, all API routes, dashboard wired to Supabase, prompts for all 7 agent functions
- [x] **Phase 2 — DONE:** Stripe checkout, webhooks, portal, upgrade UI all wired
- [ ] **Phase 3 — NOT STARTED:** Exa/Perplexity job discovery, Vercel cron, Resend email alerts, .docx downloads
- [ ] **Phase 4 — NOT STARTED:** Mobile dashboard, team/coach accounts, analytics, referral

### Known Issues / Next Up (priority order)
1. Submit IBM Impact Accelerator before March 25 2026 — POLISHED .docx ready in workspace; submit at ibmimpact.versaic.com/login
2. Submit Anthropic startup credits — .docx with all answers ready in workspace; submit at claude.ai/programs/startups
3. Complete onboarding at careerswarm.com — required to unlock dashboard (James must do this in browser)
4. Set Stripe env vars in Vercel: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_PRO
5. Register Stripe webhook at https://careerswarm.com/api/stripe/webhook
6. Run full browser test of onboarding + dashboard + generate flow — blocked until James completes onboarding
7. Get beta tester's email and run `UPDATE users SET is_beta = true WHERE email = 'tester@email.com'` via Supabase API (Cowork can do this)
8. Claude Code: run `rm .git/index.lock && git pull origin main` to clear stale lock and sync local repo
- Schema gaps (not yet migrated): `career_dna` missing `role_family`, `career_narrative`, `consolidation_status`; `achievements` missing `source_resume_id`; tables `roasts` and `guest_sessions` not yet created
- Persona hardcoding: 7 locations still hardcoded — fix is Sprint 0 (`lib/role-taxonomy.ts`), do not add more
- Notion Mission Control built March 16 2026: https://www.notion.so/325b12ea6b738114b859d4c11f82f9aa
- OpenClaw integration planned (Phase 3): personal AI agent platform, architecture documented in Notion

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
| Document generation (Cowork) | Skills-based generation | Use the `docx`, `pptx`, and `pdf` skills in Cowork to generate documents directly. No external scripts needed. Output goes to the workspace folder. |

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
- Be direct. Decide. Lead with the most important thing. Do not present options when a recommendation is appropriate.
- James is not technical. Explain git/code concepts in plain English. GITHUB-REFERENCE.md in the workspace is the reference guide.
- At the end of every session (Claude Code or Cowork), update the Current State section and ask the end-of-session ritual question (Rule 15). This is not optional.
- When switching environments mid-task, note what was just completed and what is next before closing.
- One topic per conversation keeps Claude performing well. Start new conversations frequently; the project knowledge file means context never gets lost.
- Stale draft docs should be deleted once a polished version exists. Only keep the submission-ready version of each document.
- End-of-session: James says "end of session" -- update Current State + Learnings, then push CLAUDE.md via `git push origin main`.
- Primary email for CareerSwarm business is james@careerswarm.com. jknight3@gmail.com is the Gmail MCP connected account -- use it for inbox searches but not as the business contact email.

**Technical workflow**
- Cowork is the PRIMARY environment. It can push to git, run Supabase queries, and do browser testing. Claude Code is only needed for `npm install` and `tsc --noEmit`.
- GitHub token is wired into git remote -- Cowork can run `git push origin main` directly.
- Supabase Management API works from Cowork bash: POST to `https://api.supabase.com/v1/projects/grcnfkxmmrboavlbqnqs/database/query` with the personal access token.
- Supabase service role key can be fetched fresh via `https://api.supabase.com/v1/projects/grcnfkxmmrboavlbqnqs/api-keys` -- use for auth admin operations.
- Test user exists: `tester@careerswarm.com` / `TestUser2026!` -- use for browser/API testing without touching James's account.
- Claude in Chrome can READ pages and fill form fields on careerswarm.com. Screenshots, JavaScript execution, and click actions via the computer tool are blocked when the Claude extension is active on the same origin. Workaround for click actions: use form_input and scroll_to tools instead of computer clicks.
- All CareerSwarm API routes use Supabase SSR cookie-based auth -- they cannot be tested via curl with Bearer tokens. A real browser session is required to test the full UI flow.
- Git index.lock conflict: if `.git/index.lock` exists (from a Claude Code session), Cowork cannot push. Fix: ask Claude Code to run `rm .git/index.lock && git pull origin main` at start of next session.

**Accuracy**
- Verify facts before stating them. Do not repeat notes from CLAUDE.md as truth without confirming first. If something is stated as a fact, it should be confirmed, not assumed from a prior note.
- Do not quote line counts, file sizes, or other specifics without checking.

**Business context**
- CareerSwarm is pre-revenue but live. The blockers to revenue are Stripe env vars (not set) and top-of-funnel (Resume Roast not built yet).
- James is both the founder and the target user -- a partnerships/BD executive who lived the job search problem firsthand. The founder story belongs in all external-facing materials.
- Never let grant or investor materials claim "paying subscribers" or "paying customers" until Stripe is confirmed live. This is a material misrepresentation risk.
- Notion Mission Control: https://www.notion.so/325b12ea6b738114b859d4c11f82f9aa
