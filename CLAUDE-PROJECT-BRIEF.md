# CareerSwarm III — Claude Project Knowledge File
> This is the condensed context brief. The full living document is CLAUDE.md in the workspace.
> At the start of every session: read this, then read CLAUDE.md for full detail if needed.

---

## What This Is

**CareerSwarm** is a live SaaS product at careerswarm.com. It gives job seekers an AI-powered swarm of 9 specialized agents that handles every stage of the job search: resume tailoring, cover letters, outreach, interview prep, opportunity scoring, pipeline tracking, and compensation analysis. Built by James Knight — a partnerships exec who lived the job search problem and built the tool he needed, then realized everyone who couldn't afford a career coach needed it too.

- **Live URL:** https://careerswarm.com
- **Repo:** https://github.com/zganich/careerswarm-III
- **Stack:** Next.js 14 + Supabase + Anthropic SDK (Claude Sonnet for generation, Haiku for scoring) + Tailwind + Radix UI
- **Vercel plan:** Hobby — 10s function timeout. Never use Opus. Never increase maxDuration.
- **Supabase project:** grcnfkxmmrboavlbqnqs

---

## James Knight — Founder Profile

- **Role:** Founder & CEO, sole developer
- **Background:** 15 years partnerships/BD at enterprise tech companies
- **Target roles (for CareerSwarm as user):** Head of Partnerships, VP Partnerships, Director Strategic Alliances
- **Location:** Cottonwood Heights, UT — Remote or SLC only
- **Comp floor:** $200K+ OTE
- **Email:** james@careerswarm.com (primary for CareerSwarm business)
- **Personal email:** jknight3@gmail.com (Gmail MCP connected to this account — use for Gmail searches)

---

## Current State Snapshot (updated Mar 21, 2026)

### What's live and working
- careerswarm.com deployed on Vercel, latest build READY (commit 42115a4)
- Supabase auth + all 4 tables: users, career_dna, achievements, generated_applications
- is_beta column live — James's row: is_beta=true, onboarding_complete=false
- 7 of 9 agents live in production (Job Discovery + Comp Analyst = Phase 3)
- Stripe billing fully wired — NOT yet activated in production (env vars not set)
- Test user: tester@careerswarm.com / TestUser2026!

### What's NOT done yet (in priority order)
1. **URGENT — IBM deadline March 25:** Submit IBM Impact Accelerator at ibmimpact.versaic.com/login — POLISHED .docx ready in workspace
2. **Submit Anthropic credits:** claude.ai/programs/startups — .docx with all answers ready in workspace
3. **James must complete onboarding** at careerswarm.com — required to access dashboard
4. **Stripe env vars** not set in Vercel: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_PRO
5. Phase 3 not started: Exa job discovery, Vercel cron, Resend email alerts, .docx downloads
6. Git index.lock in local repo — next Claude Code session: `rm .git/index.lock && git pull origin main`

---

## Environment Guide (which tool for what)

| Task | Use |
|------|-----|
| Code, TypeScript, git commits, npm install, tsc | **Claude Code** (terminal) |
| Documents, grants, strategy, MCP tasks, Supabase queries, git push, browser testing | **Cowork** (this environment — PRIMARY) |
| Quick questions, mobile, brainstorming without context | **Claude Chat** (claude.ai) |

**Cowork has:** Gmail MCP, Google Calendar MCP, Notion MCP, Vercel MCP, Claude in Chrome, docx/pptx/pdf/xlsx skills, direct git push capability.

---

## Non-Negotiable Rules

1. **Never use em dashes (—)** in any generated content — resumes, proposals, code comments, anywhere.
2. **Never claim paying subscribers or revenue** until Stripe is confirmed live in production.
3. **Never hallucinate metrics** — all achievement numbers must come from Career DNA.
4. **Never use Opus** on Vercel Hobby — 10s timeout kills it. Use Sonnet (generation) and Haiku (scoring/extraction).
5. **Check lib/types.ts** before adding any new fields — type changes have downstream effects everywhere.
6. **Prose over bullets** in all documents, proposals, and strategy writing. Bullets only for genuine lists.
7. **Never use** the words "genuinely," "straightforward," or "honestly" in any output.
8. **End of session:** Update Current State in CLAUDE.md, ask the ritual question (Rule 15), push via git.

---

## Key Decisions (do not reverse without reading CLAUDE.md Decisions Log first)

- **PDF parsing:** unpdf v1 (not pdf-parse — crashes on Vercel serverless)
- **AI models:** MODELS.generation = Sonnet, MODELS.fast = Haiku (constants in lib/claude.ts)
- **Career DNA:** Master Profile, not static resume. It only grows, never shrinks when tailoring. This is the product moat.
- **Stripe:** Wired but not live. Do not assume it works until env vars confirmed in Vercel.
- **/roast page:** Unprotected route (top-of-funnel). Never add to middleware.ts protected paths.

---

## Infrastructure Credentials (CLI use only — never commit)

- Supabase URL: https://grcnfkxmmrboavlbqnqs.supabase.co
- Supabase Management API: https://api.supabase.com/v1/projects/grcnfkxmmrboavlbqnqs/database/query
- Vercel team: team_uGoV76kKTxBjxeh6GMSsbgfD
- Vercel project: prj_Wj43kVfLzQAhtrPZF8IsHCwbBhqA
- GitHub repo: zganich/careerswarm-III
- Notion Mission Control: https://www.notion.so/325b12ea6b738114b859d4c11f82f9aa

---

## Business Context

- Pre-revenue, live product. Blockers to revenue: Stripe env vars + Resume Roast (top-of-funnel) not built.
- Entity formation (Utah LLC) in progress.
- Grant applications are immediate funding priority: IBM (deadline March 25 2026), Anthropic credits, Microsoft for Startups.
- James is the founder AND the target user. The founder story belongs in all external-facing materials.
- Phase 0-2 complete. Phase 3 next: Exa job discovery, cron, Resend, .docx downloads.

---

## Grant Documents in Workspace

| File | Status |
|------|--------|
| CareerSwarm-IBM-Impact-Proposal-POLISHED.docx | Ready to submit — ibmimpact.versaic.com/login |
| CareerSwarm-Anthropic-Credits-Application.docx | Ready to submit — claude.ai/programs/startups |
