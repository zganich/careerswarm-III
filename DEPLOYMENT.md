# CareerSwarm III — Vercel & Supabase Setup

Use this checklist when the Vercel project is still pointing at the **old** CareerSwarm (static + serverless API) or when deployments are failing.

---

## ✅ Done via CLI (careerswarm.com)

- **Vercel:** Project linked as `careerswarm-iii` (scope: jknight3-gmailcoms-projects).
- **`NEXT_PUBLIC_APP_URL`** set to **`https://careerswarm.com`** for Production, Preview, and Development.
- **Custom domain:** Add `careerswarm.com` in Vercel after the first successful production deploy (Settings → Domains, or `vercel domains add careerswarm.com`). Vercel only allows assigning a domain once a production deployment has succeeded.

You still need to add **Supabase** (and optionally **Anthropic**) env vars in the [Vercel dashboard](https://vercel.com) for the app to build and run. See sections 2 and 3 below.

---

## Why things break

- **This repo is a Next.js app** (App Router, `app/`, `next.config.js`).
- The **old** CareerSwarm was a different stack: static `public/` + serverless `api/*.js` (see `vercel.json.local.bak`).
- If the Vercel project was created for the old stack, its **Framework** and **Build** settings are wrong, and env may point at an old Supabase project.

---

## 1. Vercel — Fix or create project

### Option A: Reuse the existing Vercel project (recommended if you want to keep the same URL)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) and select the project that’s currently “old CareerSwarm”.
2. **Settings → General**
   - **Framework Preset:** set to **Next.js** (not “Other” or “Vite”).
   - **Root Directory:** leave blank (or set to `.` so repo root is used).
   - **Build Command:** `npm run build` (default for Next.js).
   - **Output Directory:** leave default (Next.js uses `.next`).
3. **Settings → Git**
   - Confirm the connected repo is **zganich/careerswarm-III** (or your fork).
   - **Production Branch:** e.g. `main` (or the branch you deploy from).
4. **Redeploy:** Deployments → … on latest deployment → **Redeploy** (or push a commit to trigger a new build).

### Option B: Create a new Vercel project for CareerSwarm III

1. **Add New Project** → Import **zganich/careerswarm-III** (or your fork).
2. **Configure:**
   - **Framework:** Next.js (should be auto-detected).
   - **Root Directory:** leave blank.
   - **Environment variables:** add them in the next step before first deploy.
3. Deploy. Your app will get a new URL (e.g. `careerswarm-iii-xxx.vercel.app`). Use that for `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs below.

---

## 2. Vercel — Environment variables

In **Vercel → Your Project → Settings → Environment Variables**, set (for Production, and optionally Preview/Development):

| Variable | Where to get it | Notes |
|----------|-----------------|--------|
| `NEXT_PUBLIC_APP_URL` | Your app URL | **Use `https://careerswarm.com`** (already set via CLI). Must match Supabase Auth redirects. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Project Settings → API | **Use the CareerSwarm III project**, not an old one. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same place | Public anon key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Same place | Secret; server-only. |
| `ANTHROPIC_API_KEY` | Anthropic console | For AI features. |
| Stripe keys | Stripe Dashboard | If you use Stripe (see `.env.local.example`). |

After changing env vars, **redeploy** so the build uses the new values.

---

## 3. Supabase — Use the right project

1. Open [Supabase Dashboard](https://supabase.com/dashboard).
2. Use (or create) the project for **CareerSwarm III** (local `config.toml` has `project_id = "careerswarm-III"`; the **hosted** project is separate and identified by its URL).
3. **Project Settings → API**  
   Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (only in server env, e.g. Vercel).

If you created a **new** Supabase project for III:

- Run the schema: **SQL Editor** → paste and run `supabase/migrations/20260227000000_initial_schema.sql` (or use `supabase db push` if you use the CLI linked to this project).

---

## 4. Supabase Auth — Redirect URLs

So login/signup redirects work on your deployed app:

1. **Supabase Dashboard** → your CareerSwarm III project → **Authentication → URL Configuration**.
2. **Site URL:** set to **`https://careerswarm.com`** (or your custom domain).
3. **Redirect URLs:** add:
   - `https://careerswarm.com/**`
   - `https://careerswarm-iii-*.vercel.app/**` (preview deployments)

---

## 5. Quick reference

- **App URL:** Use **`https://careerswarm.com`**. Must be the same in:
  - Vercel env: `NEXT_PUBLIC_APP_URL` (set via CLI)
  - Supabase Auth: Site URL + Redirect URLs
- **Custom domain:** Add `careerswarm.com` in Vercel after the first successful production deploy (Settings → Domains, or `vercel domains add careerswarm.com`).  
  **If the domain is already on another project:** In [Vercel Dashboard](https://vercel.com/dashboard) go to the **old** project → **Settings → Domains** → remove `careerswarm.com`. Then in **careerswarm-iii** → **Settings → Domains** → add `careerswarm.com` (or run `vercel domains add careerswarm.com` from this repo).
- **Supabase:** All three keys must be from the **same** Supabase project (the one you run the CareerSwarm III schema on).
- **Old backup:** Your previous Vercel config (static + API) is in `vercel.json.local.bak`; the repo’s `vercel.json` is for the **Next.js** app.

After these steps, trigger a new deploy and check the build logs. If the build still fails, the exact error in the logs will point to the next fix (e.g. missing env, wrong Node version, or a Supabase migration issue).
