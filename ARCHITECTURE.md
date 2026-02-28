# CareerSwarm III — Product Architecture
## Scaling from 1 User to Thousands

---

## What We're Building

A multi-tenant SaaS that gives every job seeker their own AI-powered agent swarm — the same 9-agent system that took James from hours-per-application to minutes. Users upload their resume once, build their Career DNA, and the swarm handles discovery, scoring, materials generation, outreach, interview prep, and pipeline tracking automatically.

**Core insight:** Everything in the personal system is parameterized by Career DNA. The agents don't change. The prompts don't change. Only the user context injected into each agent changes.

**Origin:** The personal system that preceded this product is documented in the README in the original "md files" spec (single-user job automation for the founder). CareerSwarm III is the productized version for all mid- to C-level job seekers.

---

## Agent Roster → Product Features

| Agent File | Agent | Product Feature | Status |
|-----------|-------|----------------|--------|
| `00_ORCHESTRATOR.md` | Orchestrator | Scoring engine + routing logic | Built (in onboarding.html) |
| `01_JOB_DISCOVERY.md` | Job Discovery | Automated daily job scan | Phase 2 (needs cron + search API) |
| `02_COMPANY_RESEARCH.md` | Company Research | One-click company intel report | Phase 1 — API route ready |
| `03_LOCATION_VERIFIER.md` | Location Verifier | Hard gate in scoring prompt | Built (in scoring logic) |
| `04_RESUME_TAILOR.md` | Resume Tailor | Tailored resume bullets + summary | Phase 1 — API route ready |
| `05_COVER_LETTER.md` | Cover Letter | Company-specific cover letter | Built (in application generator) |
| `06_OUTREACH.md` | Outreach | 5-type LinkedIn/email outreach pack | Phase 1 — API route ready |
| `07_INTERVIEW_PREP.md` | Interview Prep | Company-specific STAR brief | Phase 1 — API route ready |
| `08_PIPELINE_TRACKER.md` | Pipeline Tracker | Dashboard + pipeline DB | Phase 1 (localStorage) → Phase 2 (Supabase) |
| `09_COMPENSATION_ANALYST.md` | Comp Analyst | OTE estimation + offer negotiation | Phase 1 — API route ready |

---

## Tech Stack

### Current (MVP — No Auth)
```
Frontend:     Vanilla HTML/JS (index.html, onboarding.html, dashboard.html)
API:          Vercel Serverless Functions (Node.js)
AI:           Anthropic API (claude-sonnet-4-5-20250929) via /api/claude proxy
Storage:      localStorage (Career DNA, pipeline, agent outputs)
Deployment:   Vercel (static + serverless)
```

### Phase 1 (Auth + Payments — 2–4 weeks)
```
Auth:         Clerk (drop-in, Vercel-native, free to start)
Database:     Supabase PostgreSQL (user profiles, pipeline records, agent outputs)
Payments:     Stripe (subscription + per-credit model)
Email:        Resend (pipeline alerts, weekly summaries)
```

### Phase 2 (Full Automation — 4–8 weeks)
```
Job Search:   Exa API (semantic job board search, funding signals)
Scheduling:   Vercel Cron Jobs (daily job discovery per user)
Documents:    Docx generation (resume .docx + cover letter .docx downloads)
Search:       Perplexity API (company research with live web data)
```

---

## Data Model

### Career DNA Object (per user)
```json
{
  "userId": "uuid",
  "name": "string",
  "email": "string",
  "linkedin": "string",
  "location": "string",
  "profile": {
    "currentTitle": "string",
    "yearsExp": "string",
    "industries": ["array"],
    "targetTitles": ["array"],
    "summary": "string",
    "superpower": "string",
    "companies": [{ "name", "title", "dates", "stage" }],
    "compRange": { "minBase": "string", "minOTE": "string" }
  },
  "achievements": [{
    "company": "string",
    "title": "string",
    "what": "string",
    "metric": "string",
    "formatted": "string (Google XYZ format)",
    "impact": "high|medium|low",
    "included": true
  }],
  "skills": {
    "crm": [], "ai": [], "domain": [],
    "partnerTypes": [], "tools": [],
    "certifications": [], "awards": [],
    "differentiators": []
  },
  "differentiator": "string (selected)",
  "preferences": {
    "locationTypes": ["Remote", "Hybrid"],
    "minBase": "string",
    "minOTE": "string",
    "dealBreakers": "string"
  }
}
```

### Pipeline Record (per opportunity per user)
```json
{
  "id": "uuid",
  "userId": "uuid",
  "company": "string",
  "roleTitle": "string",
  "stage": "DISCOVERED|VERIFYING|RESEARCHING|PREPARING|READY|APPLIED|SCREEN_SCHEDULED|SCREEN_COMPLETE|INTERVIEW_SCHEDULED|INTERVIEW_COMPLETE|FINAL_ROUND|OFFER_RECEIVED|OFFER_ACCEPTED|OFFER_DECLINED|REJECTED|WITHDRAWN|NOT_A_FIT|DEAD_LEAD|MONITOR",
  "opportunityScore": 0,
  "locationVerified": "PASS|FAIL|UNCLEAR",
  "compVerified": false,
  "compEstimate": "string",
  "applyUrl": "string",
  "jdText": "string",
  "dateDiscovered": "ISO date",
  "dateApplied": "ISO date",
  "nextActionDate": "ISO date",
  "materials": {
    "resumeBullets": "string",
    "coverLetter": "string",
    "talkingPoints": "string",
    "outreach": "string",
    "researchReport": "string"
  },
  "contacts": [{ "name", "title", "linkedin", "outreachSent", "status" }],
  "flags": ["array of strings"],
  "notes": "string"
}
```

---

## API Routes

### Current
```
POST /api/claude              — Anthropic proxy (all agent calls)
```

### Phase 1 (Building Now)
```
POST /api/agents/score        — Opportunity scoring (0–100) with full rubric
POST /api/agents/research     — Company intelligence report
POST /api/agents/resume       — Tailored resume bullets + summary
POST /api/agents/cover-letter — Company-specific cover letter
POST /api/agents/outreach     — 5-type outreach message pack
POST /api/agents/interview    — STAR brief + questions
POST /api/agents/comp-check   — OTE estimation + offer analysis
```

### Phase 2
```
POST /api/agents/discover     — Job discovery (Exa API)
GET  /api/pipeline            — User pipeline (Supabase)
POST /api/pipeline            — Create/update pipeline record
GET  /api/pipeline/:id        — Single opportunity detail
```

---

## Pricing Model

### Option A: Subscription (Recommended for Scale)
- **Free:** Career DNA builder + 3 opportunity scores
- **Pro ($49/mo):** Unlimited scoring + full application packages (cover letter, tailored bullets, outreach)
- **Growth ($99/mo):** Everything + automated job discovery (daily scan) + interview prep + pipeline tracking
- **Team ($299/mo):** 5 seats — for outplacement firms, career coaches, bootcamps

### Option B: Credit-Based (Better for one-time users)
- Career DNA build: Free
- Application package: 3 credits ($9 = 3 packages)
- Credit pack: $19 = 10 packages, $49 = 30 packages

### Recommendation: Start with credit-based for beta validation, switch to subscription at 100+ users.

---

## Build Phases

### Phase 0: DONE ✓
- [x] Career DNA onboarding (5-phase wizard)
- [x] Job opportunity scoring (0–100 with rubric)
- [x] Application package generator (cover letter + talking points + resume bullets + outreach)
- [x] localStorage persistence
- [x] User preferences (location, comp floor, deal breakers)

### Phase 1: NOW (This Week)
- [ ] Agent API routes (6 endpoints — pure LLM, no external dependencies)
- [ ] Dashboard (pipeline tracker + agent hub)
- [ ] Company research agent (in-app, uses JD + LLM knowledge)
- [ ] Interview prep agent
- [ ] Comp check agent
- [ ] Landing page generification (remove personal data)

### Phase 2: Auth + Payments (Weeks 2–4)
- [ ] Clerk auth (email magic link or Google SSO)
- [ ] Supabase database (Career DNA + pipeline persistence)
- [ ] Stripe integration (credits or subscription)
- [ ] Rate limiting per user tier

### Phase 3: Automation (Weeks 4–8)
- [ ] Exa/Perplexity API integration (live job search + company research)
- [ ] Vercel Cron (daily job discovery per user)
- [ ] Email alerts (Resend — new matches, follow-up reminders)
- [ ] .docx resume + cover letter downloads

### Phase 4: Scale (Month 3+)
- [ ] Mobile-responsive dashboard
- [ ] Team/coach accounts
- [ ] Analytics (application → interview → offer conversion rates)
- [ ] Referral program

---

## Agent Prompt Strategy

**The key to multi-user scale:** Every agent prompt is written to accept a `CAREER_DNA` block and a `JOB_CONTEXT` block as inputs, replacing all hardcoded personal data.

```
System prompt = [Agent's core instructions from MD file — universal]
User message  = [CAREER_DNA object] + [JOB_CONTEXT: JD + company + role]
```

No agent prompt contains any user-specific data. All personalization comes from the Career DNA injection at runtime. This means:
- Same codebase for all users
- Same prompt quality for all users
- Zero data leakage between users
- Career DNA can be updated without changing any agent code

---

## Quality Constraints (Enforced Across All Agents)

From the Orchestrator's hard rules — applied to all users, not just James:

1. **No hallucination** — all metrics come from user's Career DNA, not estimated
2. **No em dashes** in any output
3. **No AI slop phrases** ("passionate about", "dynamic", "proven track record", "leverage synergies")
4. **Google XYZ format** for all achievement bullets
5. **ATS compliance** — no tables, no text boxes, no graphics in resume output
6. **Speed** — URGENT roles (posted <24h) surface immediately

---

## Key Differentiator vs. Competitors

| Feature | CareerSwarm | Teal | Jobscan | Resume.io | Rezi |
|---------|------------|------|---------|-----------|------|
| Multi-agent swarm | ✓ | — | — | — | — |
| Career DNA build from resume | ✓ | Partial | — | — | Partial |
| Job opportunity scoring | ✓ | — | ATS only | — | — |
| Full application package in <60s | ✓ | — | — | — | — |
| Company research agent | ✓ (Phase 2) | — | — | — | — |
| Automated job discovery | ✓ (Phase 2) | — | — | — | — |
| Interview prep per company | ✓ | — | — | — | — |
| Pipeline tracker | ✓ | ✓ | — | — | — |
| No hallucinated metrics | ✓ | N/A | N/A | N/A | — |

**The defensible moat:** Career DNA + agent swarm that uses *only verified user achievements* — no generic filler. Every output is traceable to the user's real proof points.
