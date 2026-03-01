# CareerSwarm III — Claude Code Context

## What This Is
CareerSwarm is a Next.js 14 SaaS app that helps job seekers generate ATS-optimized, tailored resumes and cover letters using Claude AI. Users upload their resume once, CareerSwarm extracts a "Career DNA" profile, and then generates tailored application documents for any job posting.

## Key URLs
- **Production**: https://careerswarm.com (and https://www.careerswarm.com)
- **Vercel project**: `careerswarm-iii` (NOT the old `careerswarm` project — that's a different/older codebase)
- **Vercel project ID**: `prj_Wj43kVfLzQAhtrPZF8IsHCwbBhqA`
- **Supabase project**: `grcnfkxmmrboavlbqnqs` → https://grcnfkxmmrboavlbqnqs.supabase.co

## Stack
- **Framework**: Next.js 14 App Router (TypeScript, strict mode)
- **Auth + DB**: Supabase (PostgreSQL + RLS + Auth)
- **AI**: Anthropic Claude API
  - `claude-opus-4-6` — Career DNA synthesis (multi-resume, long context)
  - `claude-sonnet-4-6` — Resume generation, cover letters, scoring
- **Deployment**: Vercel (`careerswarm-iii` project)
- **Styling**: Tailwind CSS
- **Email**: Resend (`lib/email.ts`) — welcome + upgrade confirmation emails

## Environment Variables (set in Vercel `careerswarm-iii` project)
- `ANTHROPIC_API_KEY` — Claude API key
- `NEXT_PUBLIC_SUPABASE_URL` — https://grcnfkxmmrboavlbqnqs.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)
- `NEXT_PUBLIC_APP_URL` — https://careerswarm.com
- `STRIPE_SECRET_KEY` — Stripe secret key (sk_live_...)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (pk_live_...)
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (whsec_...)
- `STRIPE_PRICE_PRO` — Stripe Price ID for Pro plan (price_...)
- `RESEND_API_KEY` — Resend API key (re_...) for transactional emails

## Pending Setup (owner must do in dashboards — not code tasks)
- **Stripe**: Set all `STRIPE_*` env vars in Vercel. Create webhook endpoint at `https://careerswarm.com/api/stripe/webhook` in Stripe Dashboard, listening for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Enable Customer Portal in Stripe Dashboard → Settings → Billing → Customer Portal.
- **Resend**: Set `RESEND_API_KEY` in Vercel. Verify `careerswarm.com` domain in Resend dashboard. Configure Supabase custom SMTP (Settings → Auth → SMTP) to use Resend's SMTP to bypass the 4 emails/hour limit.

## Vercel CLI / Deployment
- Token: stored by user (request from user if needed)
- Always deploy to `careerswarm-iii` project, NEVER to `careerswarm` (old project)
- `.vercel/project.json` is linked to `prj_Wj43kVfLzQAhtrPZF8IsHCwbBhqA`
- Deploy command: `vercel deploy --prod --token <token>`

## Git
- Branch: `claude/chat-claude-code-integration-BzsLN`
- Remote: origin

## Database (Supabase)
Tables: `users`, `career_dna`, `achievements`, `job_postings`, `generated_applications`
- All tables have RLS enabled
- `handle_new_user` trigger on `auth.users` INSERT → auto-creates `public.users` row
- Trigger was broken and fixed — uses COALESCE for null safety + ON CONFLICT DO NOTHING
- `users` table has: `subscription_status` ('free'|'pro'|'premium'), `credits_remaining` (int), `stripe_customer_id`, `stripe_subscription_id`

## Key Files
- `lib/claude.ts` — Claude API client + model constants
- `lib/email.ts` — Resend email utility (welcome, upgrade confirmation)
- `lib/ats-scorer.ts` — Deterministic ATS keyword scoring engine (no AI)
- `lib/types.ts` — Shared TypeScript types
- `lib/prompts/` — All Claude system prompts
- `app/api/` — API routes (parse-resume, generate, update-status, etc.)
- `app/api/stripe/` — Stripe: create-checkout, webhook, portal
- `app/dashboard/dashboard-client.tsx` — Main dashboard UI
- `app/onboarding/page.tsx` — 5-phase onboarding flow
- `supabase/fix-trigger.sql` — Trigger repair SQL (already applied)

## User Flow
1. Sign up → `handle_new_user` trigger creates `public.users` row
2. Onboarding (5 phases): upload resume → parse → review skills → review achievements → differentiators → save Career DNA
3. Dashboard: Generate tab (paste JD → generate tailored resume + cover letter + outreach), Pipeline tab (track applications), DNA tab (view/update Career DNA)
4. Upgrade: free users see "Upgrade to Pro →" in nav → Stripe Checkout → webhook activates Pro

## Subscription Logic
- Free: 3 credits (lifetime), each generation decrements by 1
- Pro: unlimited, `isPaid` check in `/api/generate` covers pro + premium
- Stripe webhook handles activation (checkout.session.completed) and deactivation (subscription.deleted → restore 3 credits)

## Stripe (TEST MODE — as of 2026-03-01)
- Product: `prod_U48f7gOLwXWeuD` — "CareerSwarm Pro"
- Price: `price_1T60OZHlPFPXpDEaHnRNoWaj` — $49/month recurring, "Pro Monthly - Founding Rate"
- Webhook: `we_1T60OhHlPFPXpDEa11w1mMP1` — registered at `https://careerswarm.com/api/stripe/webhook`
- All Stripe env vars set in Vercel (dev + preview + production)
- **Currently in TEST MODE** — swap to live keys before accepting real payments

## Known Issues / Notes
- Supabase free tier SMTP: 4 emails/hour — must configure Resend SMTP in Supabase dashboard before launch
- Stripe is TEST MODE — needs live keys + new live webhook before real payments
- Resend env var not yet set in Vercel — owner needs to add RESEND_API_KEY
- Stripe Customer Portal must be enabled in Stripe Dashboard → Settings → Billing → Customer Portal

---

## Session Log — Key Decisions & Changes
<!-- Keep this section updated. Add an entry whenever something important is decided, fixed, or changed. -->
<!-- Format: `YYYY-MM-DD — Description` -->

- **2026-03-01** — Moved `careerswarm.com` + `www.careerswarm.com` from old `careerswarm` Vercel project to `careerswarm-iii`. Updated `NEXT_PUBLIC_APP_URL` to `https://careerswarm.com`. Redeployed to production.
- **2026-03-01** — Created this CLAUDE.md file for persistent context across sessions.
- **2026-03-01** — Created `app/auth/error/page.tsx` — was missing, auth callback was throwing 404 on any failed code exchange.
- **2026-03-01** — Full MVP audit completed. Core product complete. Stripe integration was the only major gap.
- **2026-03-01** — Built full Stripe integration: create-checkout, webhook (checkout.session.completed + subscription.updated + subscription.deleted), portal. Stripe API version: `2025-02-24.acacia`. Stripe client init moved inside handlers (lazy) to prevent crash when env vars missing.
- **2026-03-01** — Dashboard: "Upgrade to Pro →" button (nav + generate error banner), Pro portal link, post-checkout `?upgraded=1` success banner.
- **2026-03-01** — `/api/generate`: `isPaid` check covers pro + premium, 90s timeout via Promise.race, null guard on userData.
- **2026-03-01** — Resend transactional email: `lib/email.ts`, welcome email triggered from `/api/save-dna`, upgrade email triggered from Stripe webhook. Graceful no-op if `RESEND_API_KEY` not set.
- **2026-03-01** — Upgrade button loading state added to dashboard nav and generate error banner.
- **2026-03-01** — Stripe TEST MODE fully wired: created product (prod_U48f7gOLwXWeuD), price $49/mo (price_1T60OZHlPFPXpDEaHnRNoWaj), webhook endpoint (we_1T60OhHlPFPXpDEa11w1mMP1). All Stripe env vars set in Vercel via API. Deployed to production. careerswarm.com live and returning 200.

---

## Instructions for Claude: Keeping This File Current

After every session where something meaningful happens, **update this file before ending**:

1. **Session Log** — add one line per: bug fix, new feature, infra change, DB migration, key decision
2. **Top sections** — update if facts change (new env vars, new key files, new tables, resolved issues)
3. **Commit CLAUDE.md with the work**, not separately
4. **Keep it concise** — orientation tool, not a changelog

---

## Agent Swarm Workflow (for Claude: how to work efficiently)

When the user says "go" or gives a multi-part task, use this pattern:

### Orchestrator Pattern
1. **Read** CLAUDE.md + relevant files to understand current state (fast, parallel reads)
2. **Decompose** into independent workstreams that don't touch the same files
3. **Launch agents in parallel** using the Agent tool with `run_in_background: true`
4. **Do your own work** on a non-overlapping task while agents run (e.g., update CLAUDE.md, do a quick standalone fix)
5. **Wait for agent completion** notifications, then review output
6. **Type-check** with `npx tsc --noEmit` before committing
7. **Single commit** covering all parallel work with a clear multi-part message
8. **Update CLAUDE.md** session log, then push

### Agent Specializations to Use
- **Resend/email tasks** → general-purpose agent with explicit file list
- **API route changes** → general-purpose agent, isolated to specific route files
- **UI/dashboard changes** → general-purpose agent, isolated to dashboard-client.tsx
- **DB schema / SQL** → general-purpose agent with Supabase context
- **Exploration/audit** → Explore agent (fast, read-only)
- **Architecture planning** → Plan agent

### File Isolation Rules (prevent agent conflicts)
- Each agent gets an explicit list of files it may touch
- Agents writing to lib/ should not touch app/ and vice versa
- dashboard-client.tsx is a hotspot — only one agent at a time
- Always instruct agents: "Do NOT commit — just write the files"

### Review Before Commit
- Run `npx tsc --noEmit` — zero errors required
- Spot-check agent output for: hardcoded values, missing error handling, type assertions that hide bugs
- If an agent produces something questionable, fix it inline before committing

### Parallel Task Examples
These can safely run in parallel:
- `lib/email.ts` (new file) + `app/api/stripe/webhook/route.ts` (add email call)
- `app/api/stripe/*.ts` (Stripe hardening) + CLAUDE.md update
- New SQL migration + new API route that uses it

These CANNOT run in parallel:
- Two agents both touching `dashboard-client.tsx`
- Two agents both touching `app/api/generate/route.ts`
