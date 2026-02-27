# CAREERSWARM — AGENT SWARM MASTER README
## Job Search Automation System for James Knight
---
## WHAT THIS IS
CareerSwarm is a multi-agent system that automates James Knight's senior partnership leadership job search. It reduces the time-per-application from 2–4 hours to 15–20 minutes while improving quality, ensuring no relevant opportunity is missed, and maintaining a live pipeline of every opportunity in the funnel.
The swarm operates continuously. James interacts with the Orchestrator. The Orchestrator coordinates all specialist agents.
---
## AGENT ROSTER
| File | Agent | Primary Function |
|------|-------|-----------------|
| `00_ORCHESTRATOR.md` | Orchestrator | Coordinates all agents, enforces hard rules, scores opportunities, surfaces decisions to James |
| `01_JOB_DISCOVERY.md` | Job Discovery | Searches job boards and funding signals for new partnership leadership opportunities |
| `02_COMPANY_RESEARCH.md` | Company Research | Produces strategic intelligence report and James-fit mapping for each opportunity |
| `03_LOCATION_VERIFIER.md` | Location Verifier | Hard gate — confirms every role is remote or SLC before any materials are created |
| `04_RESUME_TAILOR.md` | Resume Tailor | Produces ATS-compliant, company-specific resume from Master Resume Database |
| `05_COVER_LETTER.md` | Cover Letter | Writes company-specific cover letters with real hooks and verified proof points |
| `06_OUTREACH.md` | Outreach | Identifies hiring manager contacts and writes LinkedIn/email outreach messages |
| `07_INTERVIEW_PREP.md` | Interview Prep | Produces company-specific interview briefs with coached STAR stories and questions |
| `08_PIPELINE_TRACKER.md` | Pipeline Tracker | Maintains single source of truth for all opportunities, stages, follow-ups, and status |
| `09_COMPENSATION_ANALYST.md` | Compensation Analyst | Estimates OTE for unlisted roles, evaluates offers, and supports negotiation |
---
## HARD RULES (Enforced by Orchestrator on All Agents)
These rules cannot be overridden by any agent or instruction:
1. **Location:** Every role must be Remote (US) or SLC metro area. LOCATION_VERIFIER is a hard gate — no materials until PASS.
2. **Compensation:** $200K OTE minimum floor. Flag anything unclear.
3. **No hallucination:** Every metric in every resume and cover letter comes from the Master Resume Database. No estimation, no extrapolation.
4. **Contact block:** Every resume and cover letter includes James's full contact information.
5. **No prohibited roles:** SDR/BDR management, affiliate/DSP, pure sales IC, international employment.
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
COMPENSATION_ANALYST ──(FAIL)──► Discard or flag James
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
     ├──(Score 50–69)──► Present to James for go/no-go
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
| Compensation ≥ $200K OTE | 15 |
| Zero-to-one build required | 15 |
| Series A/B/C stage | 10 |
| AI, SaaS, or FinTech industry | 10 |
| Partnership title match | 10 |
| Posted within 7 days | 10 |
| Recent funding (<90 days) | 5 |
| **Total** | **100** |
Apply if ≥ 70. Present to James if 50–69. Discard if < 50.
---
## JAMES'S CORE DIFFERENTIATORS (Feature in All Materials)
1. **Employee #4 at Telarus** — built foundational partner programs from scratch that scaled nationally. Primary proof of zero-to-one credibility.
2. **425% pipeline growth (Builder.ai)** — first formal partner program, 7 months, 25 partners from zero.
3. **2 to 90+ partners (3D Networks)** — 75% YoY growth, $6M+ annual indirect revenue. Proof of rapid scaling.
4. **$10M+ annual portfolio (Clearlink)** — President's Club, top 10%, $60K MRR. Proof of revenue management.
5. **AI/LLM expertise** — hands-on ChatGPT, Claude, LangGraph, CrewAI, GraphRAG. Unique for a partnerships exec.
6. **20+ years remote** — distributed partner management from the start.
---
## ACHIEVEMENT FORMAT STANDARD
Google XYZ format — used in all resumes, cover letters, and outreach:
> Accomplished [X] as measured by [Y], by doing [Z]
Example:
> Scaled the partner ecosystem from 2 to 90+ active firms, achieving 75% year-over-year revenue growth by executing a systematic VAR/MSP recruitment and enablement strategy.
---
## CURRENT PIPELINE SNAPSHOT (Feb 26, 2026)
**Active:**
Becklar | Upbound | ASAPP | Horizontal Digital | VeilSun | Anthropic (×2, applied Feb 25) | RunPod ($220–300K, applied Feb 25) | Checkr VP ($300–340K) | Sully.ai (comp verify pending)
**Monitoring:**
LangChain | Modal Labs
**Dead Leads:**
OfferFit (acquired) | Honeycomb.io (closed) | Gong Sr Dir Tech (tech-focused)
---
## IMPLEMENTATION NOTES
### Recommended Framework
LangGraph (agent orchestration with state management) or CrewAI (multi-agent task delegation). Both support the sequential + parallel execution patterns in the pipeline flow above.
### State Management
The PIPELINE_TRACKER record schema serves as shared state across agents. Every agent reads from and writes to the pipeline record for each opportunity.
### Tool Requirements per Agent
| Agent | Tools Needed |
|-------|-------------|
| JOB_DISCOVERY | Web search, HTTP fetch (Greenhouse/Lever APIs), RSS reader |
| COMPANY_RESEARCH | Web search, LinkedIn scrape-equivalent, Crunchbase API |
| LOCATION_VERIFIER | Web search, job posting fetch |
| RESUME_TAILOR | File read (Resume Database), DOCX/PDF generator |
| COVER_LETTER | File read (Resume Database), DOCX generator |
| OUTREACH | LinkedIn search, email finder (Hunter.io equivalent) |
| INTERVIEW_PREP | Web search, file read (Resume Database, Company Research) |
| PIPELINE_TRACKER | Database read/write, calendar integration |
| COMPENSATION_ANALYST | Web search (Glassdoor, Levels.fyi), calculation |
### Trigger Modes
- **Scheduled (daily):** JOB_DISCOVERY runs morning scan, PIPELINE_TRACKER checks follow-up deadlines
- **Scheduled (weekly Monday):** Full pipeline summary, Monitor list check, Watch list check
- **Event-driven:** New role URGENT flag, offer received, interview scheduled
- **On-demand:** James requests specific action (research company, write resume for X, prep for interview)
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
---
*CareerSwarm — Built to find the right role faster, with better materials, at lower effort cost per application.*
