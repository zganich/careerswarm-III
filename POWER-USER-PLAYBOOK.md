# CareerSwarm Power User Playbook
> How to run an AI-native operation the way people who build this stuff actually use it.
> Updated: March 2026

---

## The Core Principle

The gap between a casual Claude user and a power user is not intelligence or creativity. It is **structure**. Power users build systems that make every session faster than the last. Casual users start from zero every time.

Everything in this playbook is about reducing startup friction, increasing output quality, and making the AI work harder so you work less.

---

## Layer 1 — Context (You've Built This)

**What it is:** CLAUDE.md + CLAUDE-PROJECT-BRIEF.md as a Claude Project knowledge file.

**Why it matters:** Every session loads with full context. Claude knows your stack, your rules, your priorities, and your history without you saying a word.

**What you have:**
- CLAUDE.md — the full living document, pushed to GitHub after every session
- CLAUDE-PROJECT-BRIEF.md — the condensed version, optimized for Claude Projects
- Claude Project: CareerSwarm III — organizes all conversations, auto-loads both files

**The discipline:** Update CLAUDE.md at the end of EVERY session. The file compounds. Each session leaves it slightly smarter than it was. Skip this once and you lose the compounding.

---

## Layer 2 — Automation (Just Added)

**What it is:** Scheduled tasks that run without you.

**What's running:**
- **Morning briefing** — Weekdays at 8 AM: grant deadline countdown, Gmail scan for IBM/Anthropic responses, Vercel build status, today's top priorities. You open the app and the day is already organized.
- **IBM deadline alert** — March 24 at 8 AM: urgent one-time alert the day before the IBM submission deadline.

**What to add next (in order of value):**

1. **Weekly status push to Notion** — Every Friday at 4 PM, auto-update Notion Mission Control with the week's completed items, blockers, and next week's priorities. One less thing to remember.

2. **Stripe activation reminder** — Fire once when you're ready: "Set Stripe env vars in Vercel. Here are the exact steps." Wire it for when Phase 3 starts.

3. **Monthly metrics digest** — First Monday of each month: pull Supabase user count, Vercel traffic, and draft a one-paragraph investor/grant update. Useful even when pre-revenue.

---

## Layer 3 — MCP Connections (You Have Good Ones, Add These)

**What you already have:** Gmail, Google Calendar, Notion, Vercel, Claude in Chrome, Google Drive.

**What's missing:**

| MCP | What It Unlocks |
|-----|----------------|
| **GitHub** | "Show me all open issues" / "What changed in the last commit" / "Create a PR" — all from Cowork without switching to terminal |
| **Stripe** | Once Stripe is live: "What's MRR this week?" / "Which plan are most users on?" / real-time revenue visibility |
| **Resend** (Phase 3) | Email delivery control directly from Cowork — test, send, and monitor transactional emails without logging into another dashboard |
| **Linear or Notion Tasks** | Turn CLAUDE.md Known Issues into actual trackable tickets — assign, prioritize, move to done, all from conversation |

To install: In Cowork, type "search for [GitHub / Stripe / Resend] MCP" and I'll find and install it.

---

## Layer 4 — Conversation Patterns (This Is the Real Unlock)

### One topic per conversation
Start a new conversation for each distinct task. "Build Resume Roast" is one conversation. "Debug the scoring API" is another. Long conversations degrade output quality as early context gets compressed. Short, focused conversations consistently outperform marathon sessions.

### Front-load the ask
Start every request with the output you want, not the background. Instead of: "So I've been thinking about the IBM proposal and there are a few sections that feel weak, particularly around the metrics table which says 1-2 pilots but the executive summary says 3 orgs, and I was wondering if..." say: "Fix the metrics table inconsistency in the IBM proposal: Year 1 should say 3 pilots to match the Executive Summary."

Claude does better with direct requests than with narrative context-building.

### Use XML tags for complex requests
When you need a specific structure, tell Claude explicitly:

```
<task>Write the Anthropic credits application</task>
<constraints>No em dashes. No claims of paying subscribers. First person voice.</constraints>
<output>A .docx file with one section per application field, plus a submission guide at the end.</output>
```

This is not required for simple requests, but for anything with multiple requirements it dramatically improves first-draft quality.

### Ask for a plan before execution on big tasks
For anything that touches code or takes more than 10 minutes: "Before you build this, tell me the approach and what files you'll touch." Catches misunderstandings before they cost time.

---

## Layer 5 — Parallel Agents (Advanced)

Cowork can run multiple sub-tasks simultaneously. This is how you do research at 4x speed.

Example: "I need competitive research on Resume.io, Teal, and Rezi simultaneously — one agent per competitor, all running in parallel."

Example: "Check Vercel build status, scan Gmail for IBM responses, and pull the latest user count from Supabase — all at once."

You don't have to orchestrate this manually. Just ask for it and Cowork handles the parallelization.

---

## Layer 6 — Memory Management (The Productivity Plugin)

Your plugin has a `memory-management` skill that builds a two-tier memory system: a working memory file (CLAUDE.md, which you already have) and a deeper knowledge base in a `memory/` directory. It can learn your shorthand, decode your acronyms, and remember preferences you've stated.

To activate: type `start memory management` in a Cowork session.

For CareerSwarm, the most valuable use is storing: recurring vendor/partner names, your standard objection responses for sales conversations, and the specific framing you prefer for different audiences (IBM vs Anthropic vs investors vs users).

---

## Layer 7 — Skills as Power Tools

You have a full skill library. The ones worth knowing:

| Skill | When to use |
|-------|------------|
| `docx` | Any Word document — proposals, contracts, SOPs |
| `pptx` | Pitch decks, IBM follow-up slides, investor presentations |
| `xlsx` | Financial models, budget tracking, user metrics dashboards |
| `canvas-design` | Posters, one-pagers, visual assets — PNG/PDF output |
| `marketing:content-creation` | Blog posts, LinkedIn content, launch copy |
| `marketing:email-sequence` | Onboarding emails, re-engagement flows, beta user nurture |
| `sales:account-research` | Research any company before a partnership call |
| `sales:competitive-intelligence` | Battlecards vs Resume.io, Teal, Kickresume |
| `skill-creator` | Build a custom skill for any recurring workflow |

---

## The Daily Rhythm (What This Looks Like in Practice)

**8:00 AM** — Morning briefing fires automatically. You open the app, see your priorities, grant countdown, and any important emails. Takes 60 seconds to read.

**Working session** — Open CareerSwarm III project. Start a new conversation per topic. Claude loads full context automatically.

**End of session** — Say "end of session." Claude updates CLAUDE.md, asks the ritual question, pushes to GitHub.

**Weekly (Friday)** — Notion Mission Control auto-updates. You have a record of the week without writing anything.

---

## What the Best Operators Actually Do Differently

They treat the AI like a senior colleague, not a search engine. They give context, set constraints, and ask for specific outputs. They invest in the scaffolding (CLAUDE.md, Projects, scheduled tasks) once, then spend zero time on setup from that point forward. They start new conversations frequently. They end sessions with the ritual update.

The result is that every session picks up exactly where the last one left off, the AI gets more useful over time (not less), and the total time spent managing the AI is near zero.

You're already doing most of this. The pieces that were missing are now in place.
