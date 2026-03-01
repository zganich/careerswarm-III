# CareerSwarm III — Claude Code Context

## Product
Next.js 14 SaaS. Users upload resume → extract "Career DNA" → generate tailored resumes + cover letters for any job posting using Claude AI.

## Quick Reference
| Thing | Value |
|---|---|
| Production | https://careerswarm.com |
| Vercel project | `careerswarm-iii` (NOT old `careerswarm`) |
| Vercel project ID | `prj_Wj43kVfLzQAhtrPZF8IsHCwbBhqA` |
| Supabase project | `grcnfkxmmrboavlbqnqs` |
| Git branch | `claude/chat-claude-code-integration-BzsLN` |
| Deploy cmd | `vercel deploy --prod --token <token>` |

## Stack
- Next.js 14 App Router, TypeScript strict
- Supabase (Postgres + RLS + Auth)
- Claude: `claude-opus-4-6` (DNA synthesis), `claude-sonnet-4-6` (generation)
- Stripe (payments), Resend (email), Tailwind CSS

## Key Files
- `lib/claude.ts` — Claude client + model constants
- `lib/email.ts` — Resend: welcome + upgrade emails (no-ops if `RESEND_API_KEY` unset)
- `lib/ats-scorer.ts` — Deterministic ATS keyword scoring (no AI)
- `lib/types.ts` — Shared TS types
- `lib/prompts/` — All Claude system prompts
- `app/api/generate/route.ts` — Main generation endpoint (90s timeout, isPaid check)
- `app/api/stripe/` — create-checkout, webhook, portal
- `app/api/save-dna/route.ts` — Saves Career DNA, triggers welcome email
- `app/dashboard/dashboard-client.tsx` — Main dashboard UI (hotspot — one agent at a time)
- `app/onboarding/page.tsx` — 5-phase onboarding
- `app/auth/error/page.tsx` — Auth error page

## Database
Tables: `users`, `career_dna`, `achievements`, `job_postings`, `generated_applications`
- All RLS enabled
- `handle_new_user` trigger: `auth.users` INSERT → `public.users` row (COALESCE + ON CONFLICT DO NOTHING)
- `users`: `subscription_status` ('free'|'pro'|'premium'), `credits_remaining` (int), `stripe_customer_id`, `stripe_subscription_id`

## Subscription Logic
- Free: 3 lifetime credits, decremented per generation
- Pro/Premium: unlimited (`isPaid` check in `/api/generate`)
- Webhook events: `checkout.session.completed` (activate), `customer.subscription.deleted` (deactivate → restore 3 credits)

## Stripe (TEST MODE)
- Product: `prod_U48f7gOLwXWeuD` — CareerSwarm Pro
- Price: `price_1T60OZHlPFPXpDEaHnRNoWaj` — $49/mo recurring
- Webhook: `we_1T60OhHlPFPXpDEa11w1mMP1` → `https://careerswarm.com/api/stripe/webhook`
- All `STRIPE_*` env vars set in Vercel (dev + preview + prod)
- **TEST MODE** — must swap to live keys + new webhook before real payments

## Env Vars (all set in Vercel `careerswarm-iii`)
`ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL` (https://careerswarm.com), `STRIPE_SECRET_KEY` (test), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test), `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PRO`, `RESEND_API_KEY` (**not yet set** — owner must add)

## Pending (owner dashboard tasks)
- **Stripe → live**: swap `STRIPE_*` vars to live keys, create live webhook (same URL + events), enable Customer Portal (Stripe Dashboard → Settings → Billing)
- **Resend**: add `RESEND_API_KEY` to Vercel, verify domain in Resend, configure Supabase custom SMTP with Resend to bypass 4 emails/hour limit

---

## Session Log
- **2026-03-01** — Initial build: full MVP. Auth, onboarding (5-phase), dashboard (Generate/Pipeline/DNA tabs), Career DNA, ATS scorer, Stripe integration (create-checkout, webhook, portal), Resend emails, `app/auth/error/page.tsx`, domain moved from old `careerswarm` → `careerswarm-iii` Vercel project.
- **2026-03-01** — Stripe TEST MODE wired end-to-end: product/price/webhook created via API, all Stripe env vars set in Vercel, deployed, careerswarm.com live (200).
- **2026-03-01** — Bug fix: `app/api/parse-resume/route.ts` — guard against undefined `achievements` key in Claude response (`?? []` fallback); added per-call `.catch()` labels on the three parallel Claude extractions so Vercel logs identify which step failed.
- **2026-03-01** — Bug fix: server-side sign-out. Added `app/api/auth/signout/route.ts` (POST → `supabase.auth.signOut()` server-side); updated `dashboard-client.tsx` to call it instead of browser-side `signOut()`, eliminating middleware race condition where cookie clear hadn't propagated before the redirect.
- **2026-03-01** — Feature + hardening: onboarding page. Added Sign Out button to nav; CareerSwarm logo → `<Link href="/">`; `useEffect` to detect Supabase `#error=` hash (OTP expired etc.), strip it from URL, show dismissible amber banner; `saveDNA` now surfaces error message instead of silently hiding spinner; `extractText` checks `res.ok` and throws on API failure (file correctly shows red "Failed" instead of green "Extracted" with no text); file size guard (>10 MB rejected); empty `---` separator no longer appended when all file extractions fail. New file: `app/api/auth/signout/route.ts`.
- **2026-03-01** — UX audit + fixes (95 issues identified, high-priority items addressed): (1) Home nav: added Sign In link; (2) Auth page logos → link home; (3) Signup confirmation: added spam folder tip, resend verification email button, "Already verified? Sign in" link, T&C acceptance note; (4) Auth error page: converted to client component, parses URL error params to show contextual title/message, adds "Contact support" mailto, detects signup vs password-reset context for correct recovery CTA; (5) Forgot-password: added spam tip + resend link button on success state, logo → home; (6) Landing: "Only 17 of 20 founding spots remaining" urgency badge on pricing section.

---

## Instructions for Claude

### Session Start
1. Read CLAUDE.md only — skip reading other files until you know what the task touches
2. Read only the files the task requires — use Grep/Glob to find them, don't explore broadly
3. Parallel-read all files you need in one shot before writing anything

### Doing Work
- **Parallel tool calls always** — reads, agents, searches — never sequential if independent
- **Agents for multi-file tasks** — launch with `run_in_background: true`, do other work while waiting
- Each agent gets an explicit file list; instruct: "Do NOT commit — just write the files"
- `dashboard-client.tsx` and `app/api/generate/route.ts` — one agent at a time (hotspots)

### Before Committing
- `npx tsc --noEmit` — zero errors required
- Single commit for all related work
- Update CLAUDE.md session log in the same commit
- Push: `git push origin claude/chat-claude-code-integration-BzsLN`

### Session End
Update CLAUDE.md: session log entry + any changed facts (new files, env vars, resolved issues). Commit with the work, not separately.

### Agent Types
- Exploration/audit → `Explore` agent (read-only, fast)
- Architecture → `Plan` agent
- Code changes → `general-purpose` agent with explicit file list
