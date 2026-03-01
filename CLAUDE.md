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

## Environment Variables (set in Vercel `careerswarm-iii` project)
- `ANTHROPIC_API_KEY` — Claude API key
- `NEXT_PUBLIC_SUPABASE_URL` — https://grcnfkxmmrboavlbqnqs.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-side only)
- `NEXT_PUBLIC_APP_URL` — https://careerswarm.com

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

## Key Files
- `lib/claude.ts` — Claude API client + model constants
- `lib/ats-scorer.ts` — Deterministic ATS keyword scoring engine (no AI)
- `lib/types.ts` — Shared TypeScript types
- `lib/prompts/` — All Claude system prompts
- `app/api/` — API routes (parse-resume, generate, update-status, etc.)
- `app/dashboard/dashboard-client.tsx` — Main dashboard UI
- `app/onboarding/page.tsx` — 5-phase onboarding flow
- `supabase/fix-trigger.sql` — Trigger repair SQL (already applied)

## User Flow
1. Sign up → `handle_new_user` trigger creates `public.users` row
2. Onboarding (5 phases): upload resume → parse → review skills → review achievements → differentiators → save Career DNA
3. Dashboard: Generate tab (paste JD → generate tailored resume + cover letter + outreach), Pipeline tab (track applications), DNA tab (view/update Career DNA)

## Known Issues / Notes
- Supabase free tier SMTP: 4 emails/hour — needs custom SMTP for production scale (password reset emails)
- `careerswarm.com` was previously pointed at the old `careerswarm` Vercel project — now correctly points to `careerswarm-iii`
