# CAREERSWARM III — PRODUCT README
## Job Search Automation for Mid- to C-Level Roles

---

## WHAT THIS IS

**CareerSwarm III** is the **productized version** of a personal agent-swarm job search system. The original system automated one user's senior partnership leadership search (reducing time-per-application from 2–4 hours to 15–20 minutes). This repo is the **product**: a multi-tenant system that gives every job seeker their own AI-powered agent swarm for **mid- to C-level** job searches.

- **Origin:** Same 9-agent design that ran for the founder's personal search; here it is generalized via **Career DNA** (per-user profile, achievements, preferences) and shared pipeline logic.
- **Product:** Users build their Career DNA once; the swarm handles discovery, scoring, materials generation, outreach, interview prep, and pipeline tracking. See `ARCHITECTURE.md` for scaling, data model, and roadmap.

Personal-origin reference (differentiators and pipeline snapshot from the original run) is in `archive/` for context only; the product uses no hardcoded user data.

---

## AGENT ROSTER

| File | Agent | Primary Function |
|------|-------|-----------------|
| `00_ORCHESTRATOR.md` | Orchestrator | Coordinates all agents, enforces hard rules, scores opportunities, surfaces decisions to the user |
| `01_JOB_DISCOVERY.md` | Job Discovery | Searches job boards and funding signals for new partnership/leadership opportunities |
| `02_COMPANY_RESEARCH.md` | Company Research | Produces strategic intelligence report and user-fit mapping for each opportunity |
| `03_LOCATION_VERIFIER.md` | Location Verifier | Hard gate — confirms role matches user location preferences before any materials are created |
| `04_RESUME_TAILOR.md` | Resume Tailor | Produces ATS-compliant, company-specific resume from user's Career DNA / resume data |
| `05_COVER_LETTER.md` | Cover Letter | Writes company-specific cover letters with real hooks and verified proof points |
| `06_OUTREACH.md` | Outreach | Identifies hiring manager contacts and writes LinkedIn/email outreach messages |
| `07_INTERVIEW_PREP.md` | Interview Prep | Produces company-specific interview briefs with coached STAR stories and questions |
| `08_PIPELINE_TRACKER.md` | Pipeline Tracker | Maintains single source of truth for all opportunities, stages, follow-ups, and status |
| `09_COMPENSATION_ANALYST.md` | Compensation Analyst | Estimates OTE for unlisted roles, evaluates offers, and supports negotiation |

---

## HARD RULES (Enforced by Orchestrator on All Agents)

These rules cannot be overridden by any agent or instruction:

1. **Location:** Every role must match the user's location preferences (e.g. Remote US or specified metro). LOCATION_VERIFIER is a hard gate — no materials until PASS.
2. **Compensation:** User's minimum OTE floor (e.g. $200K) enforced. Flag anything unclear.
3. **No hallucination:** Every metric in every resume and cover letter comes from the user's Career DNA / Master Resume Database. No estimation, no extrapolation.
4. **Contact block:** Every resume and cover letter includes the user's full contact information.
5. **No prohibited roles:** Per user preferences (e.g. SDR/BDR management, affiliate/DSP, pure sales IC, international employment).
6. **No prohibited formatting:** No em dashes, no double bold, no AI slop phrases, no ATS-breaking elements.
7. **Speed:** URGENT opportunities (posted <24 hours) interrupt batch processing.

---

## STANDARD PIPELINE FLOW

```
JOB_DISCOVERY
     │
     ▼
LOCATION_VERIFIER ──(FAIL)──► Discard + log
     │
     │ PASS
     ▼
COMPENSATION_ANALYST ──(FAIL)──► Discard or flag to user
     │
     │ PASS
     ▼
COMPANY_RESEARCH
     │
     ▼
ORCHESTRATOR (score opportunity)
     │
     ├──(Score ≥ 70)──► RESUME_TAILOR + COVER_LETTER (parallel)
     │                       │
     │                       ▼
     │                  OUTREACH (identify contacts)
     │                       │
     │                       ▼
     │                  PIPELINE_TRACKER (log all)
     │
     ├──(Score 50–69)──► Present to user for go/no-go
     │
     └──(Score < 50)──► Discard + log NOT_A_FIT

Later:
     ├── Screen scheduled → INTERVIEW_PREP activates
     ├── Offer received → COMPENSATION_ANALYST activates
     └── Weekly → PIPELINE_TRACKER generates summary
```

---

## OPPORTUNITY SCORING RUBRIC (Quick Reference)

| Criterion | Points |
|-----------|--------|
| Location verified ✓ | 25 |
| Compensation ≥ user minimum OTE | 15 |
| Zero-to-one build required | 15 |
| Series A/B/C stage | 10 |
| Target industry match | 10 |
| Title match (e.g. partnership/leadership) | 10 |
| Posted within 7 days | 10 |
| Recent funding (<90 days) | 5 |
| **Total** | **100** |

Apply if ≥ 70. Present to user if 50–69. Discard if < 50.

---

## ACHIEVEMENT FORMAT STANDARD

Google XYZ format — used in all resumes, cover letters, and outreach:

> Accomplished [X] as measured by [Y], by doing [Z]

Example:

> Scaled the partner ecosystem from 2 to 90+ active firms, achieving 75% year-over-year revenue growth by executing a systematic VAR/MSP recruitment and enablement strategy.

---

## IMPLEMENTATION NOTES

### Recommended Framework

LangGraph (agent orchestration with state management) or CrewAI (multi-agent task delegation). Both support the sequential + parallel execution patterns in the pipeline flow above.

### State Management

The PIPELINE_TRACKER record schema serves as shared state across agents. Every agent reads from and writes to the pipeline record for each opportunity. In the product, see `ARCHITECTURE.md` for the full data model (Career DNA, pipeline record, API routes).

### Tool Requirements per Agent

| Agent | Tools Needed |
|-------|-------------|
| JOB_DISCOVERY | Web search, HTTP fetch (Greenhouse/Lever APIs), RSS reader |
| COMPANY_RESEARCH | Web search, LinkedIn scrape-equivalent, Crunchbase API |
| LOCATION_VERIFIER | Web search, job posting fetch |
| RESUME_TAILOR | File read (Resume Database / Career DNA), DOCX/PDF generator |
| COVER_LETTER | File read (Resume Database / Career DNA), DOCX generator |
| OUTREACH | LinkedIn search, email finder (Hunter.io equivalent) |
| INTERVIEW_PREP | Web search, file read (Resume Database, Company Research) |
| PIPELINE_TRACKER | Database read/write, calendar integration |
| COMPENSATION_ANALYST | Web search (Glassdoor, Levels.fyi), calculation |

### Trigger Modes

- **Scheduled (daily):** JOB_DISCOVERY runs morning scan, PIPELINE_TRACKER checks follow-up deadlines
- **Scheduled (weekly Monday):** Full pipeline summary, Monitor list check, Watch list check
- **Event-driven:** New role URGENT flag, offer received, interview scheduled
- **On-demand:** User requests specific action (research company, write resume for X, prep for interview)

---

## GLOSSARY

| Term | Definition |
|------|------------|
| Zero-to-one | Building a partnership program from scratch where none existed |
| OTE | On-Target Earnings (base + variable at 100% quota attainment) |
| VAR | Value-Added Reseller |
| MSP | Managed Service Provider |
| SI | System Integrator |
| PRM | Partner Relationship Management platform |
| ATS | Applicant Tracking System (what resumes must pass through) |
| BATNA | Best Alternative To a Negotiated Agreement |
| STAR | Situation, Task, Action, Result (interview story format) |
| PMF | Product-Market Fit |
| QBR | Quarterly Business Review |
| Career DNA | Per-user profile (achievements, preferences, comp floor, etc.) used to personalize all agent outputs in the product |

---

## REFERENCE

- **Product architecture, data model, phases:** `ARCHITECTURE.md`
- **Personal-origin context (archived):** `archive/PERSONAL_ORIGIN_REFERENCE.md` and `archive/ARCHIVE.md`
- **Original personal system spec:** The README in the "md files" spec (personal job automation for the founder) describes the single-user origin; CareerSwarm III is the productized version for all mid- to C-level job seekers.

---

*CareerSwarm III — Job search automation for mid- to C-level roles. Same swarm, scaled by Career DNA.*
