# CareerSwarm III — Claude Project Knowledge File
> This is the condensed context brief for use in Claude Projects (claude.ai).
> The full living document is CLAUDE.md in the Cowork workspace — read it for complete detail.
> Keep this file current: re-upload to Claude Projects whenever CLAUDE.md state changes significantly.

---

## What This Is

**CareerSwarm** is a live SaaS product at careerswarm.com. It gives job seekers an AI-powered swarm of 9 specialized agents that handles every stage of the job search: resume tailoring, cover letters, outreach, interview prep, opportunity scoring, pipeline tracking, and compensation analysis.

- **Live URL:** https://careerswarm.com
- **Repo:** https://github.com/zganich/careerswarm-III
- **Stack:** Next.js 14 + Supabase + Anthropic SDK (Claude Sonnet for generation, Haiku for scoring) + Tailwind + Radix UI
- **Vercel plan:** Hobby — 10s function timeout. Never use Opus. Never increase maxDuration.
- **Supabase project:** grcnfkxmmrboavlbqnqs
- **Founder:** James Knight — james@careerswarm.com

---

## Current State Snapshot (updated Mar 21, 2026)

### What's live and working
- careerswarm.com deployed on Vercel, latest build READY (commit 42115a4)
- Supabase auth + all 4 tables: users, career_dna, achievements, generated_applications
- is_beta column live — James's row: is_beta=true, onboarding_complete=false
- 7 of 9 agents live in production (Job Discovery + Comp Analyst = Phase 3)
- Stripe billing fully wired but NOT yet activated (env vars not set in Vercel)
- Test user: tester@careerswarm.com / TestUser2026!
- Claude Projects setup complete: this file is the knowledge file

### What's NOT done yet (priority order)
1. **URGENT — IBM deadline March 25:** Submit at ibmimpact.versaic.com/login — POLISHED .docx ready in Cowork workspace
2. **Anthropic credits:** Submit at claude.ai/programs/startups — .docx ready in Cowork workspace
3. **James must complete onboarding** at careerswarm.com to access dashboard
4. **Stripe env vars** not set in Vercel: STRIPE_SECRET_KEY, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_PRO
5. Phase 3 not started: Exa job discovery, Vercel cron, Resend email alerts, .docx downloads

---

## Environment Guide

| Task | Use |
|------|-----|
| Code, TypeScript, git commits, npm install, tsc | **Claude Code** (terminal) |
| Supabase queries, git push, browser testing, documents, MCP tasks | **Cowork** (PRIMARY environment) |
| Quick questions, mobile, brainstorming | **Claude Projects** (here) |

**Cowork has:** Gmail MCP, Google Calendar MCP, Notion MCP, Vercel MCP, Claude in Chrome, docx/pptx/pdf/xlsx skills, direct git push.

---

## Non-Negotiable Rules

1. **Never use em dashes (—)** in any generated content — resumes, proposals, code comments, anywhere.
2. **Never claim paying subscribers or revenue** until Stripe is confirmed live in production.
3. **Never hallucinate metrics** — all achievement numbers must come from Career DNA data.
4. **Never use Opus** on Vercel Hobby — 10s timeout. Use Sonnet (generation) and Haiku (scoring/extraction).
5. **Prose over bullets** in all documents, proposals, and strategy writing. Bullets only for genuine lists.
6. **Never use** the words "genuinely," "straightforward," or "honestly" in any output.
7. **End of every Cowork session:** Update Current State in CLAUDE.md, ask the ritual question, push via git, re-upload this file to Claude Projects if state changed.

---

## Key Architectural Decisions (do not reverse without reading CLAUDE.md Decisions Log)

- **PDF parsing:** unpdf v1 (not pdf-parse — crashes on Vercel serverless)
- **AI models:** MODELS.generation = Sonnet, MODELS.fast = Haiku (constants in lib/claude.ts)
- **Career DNA:** Master Profile, not static resume. It only grows, never shrinks when tailoring. This is the product moat.
- **Stripe:** Wired but not live. Do not assume it works until env vars confirmed in Vercel.
- **/roast page:** Unprotected route (top-of-funnel acquisition). Never add to middleware.ts protected paths.
- **Persona hardcoding:** 7 locations still hardcoded for partnerships persona. Sprint 0 fix is lib/role-taxonomy.ts. Do not add more hardcoded references.

---

## Business Context

- Pre-revenue, live product. Blockers to revenue: Stripe env vars not set + Resume Roast (top-of-funnel) not built yet.
- Entity formation (Utah LLC) in progress.
- Grant applications are immediate funding priority: IBM Impact Accelerator (deadline March 25 2026), Anthropic startup credits, Microsoft for Startups.
- James is the founder AND the target user. The founder story belongs in all external-facing materials.
- Phase 0-2 complete. Phase 3 is next: Exa job discovery, cron jobs, Resend email, .docx downloads.
- Notion Mission Control: https://www.notion.so/325b12ea6b738114b859d4c11f82f9aa
