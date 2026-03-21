# Claude Projects Setup Guide — CareerSwarm III

## What This Gets You

Instead of starting every Cowork session from scratch or typing "read CLAUDE.md" every time, a Claude Project auto-loads your context, keeps all CareerSwarm conversations in one place, and makes it easy to find anything from past sessions.

---

## Step 1 — Create the Project (2 minutes)

1. In the Claude desktop app, look at the left sidebar under **Projects**
2. Click **"+ Create your first project"** (or the + next to Projects)
3. Name it: **CareerSwarm III**
4. Click Create

---

## Step 2 — Add Knowledge Files (5 minutes)

Knowledge files load automatically at the start of every conversation in this project. Add these two files:

**File 1 — The quick-load brief (add this first):**
- File: `CLAUDE-PROJECT-BRIEF.md` from your workspace folder
- This is the condensed context — the essentials Claude needs without reading the full CLAUDE.md

**File 2 — The full living document (add this second):**
- File: `CLAUDE.md` from your workspace folder
- This is the complete context with decisions log, learnings, and full history

How to add:
1. Inside your new CareerSwarm III project, look for **"Add content"** or a knowledge/files section
2. Upload or link each file
3. Claude will confirm they're loaded

> Note: If the combined file size hits the project limit, keep only CLAUDE-PROJECT-BRIEF.md. It contains everything Claude needs to work effectively.

---

## Step 3 — Add a Project Instruction (2 minutes)

Projects let you set a persistent instruction that applies to every conversation. Use this:

```
You are working on CareerSwarm III, a live SaaS product at careerswarm.com.
Read CLAUDE-PROJECT-BRIEF.md at the start of every session.
For full detail on any decision or history, read CLAUDE.md.
Follow all rules in those files exactly — especially: no em dashes, no hallucinated metrics, no Opus on Vercel Hobby, prose over bullets in documents.
James is not technical — explain code concepts in plain English.
Be direct. Decide. Lead with the most important thing. Do not present options when a recommendation is appropriate.
```

---

## Step 4 — Move Your Conversations (1 minute)

From now on, start all CareerSwarm work by:
1. Clicking into the **CareerSwarm III** project in the sidebar
2. Clicking **New conversation** from inside the project

Old conversations in Recents won't move automatically, but new ones will be organized automatically.

---

## Step 5 — Conversation Discipline (ongoing)

One rule that separates power users from everyone else: **one topic per conversation.**

- "Build the Resume Roast feature" = one conversation
- "Polish the IBM proposal" = one conversation
- "Debug the Stripe webhook" = one conversation

Don't let conversations grow to 50 messages. Long conversations degrade Claude's performance as earlier context gets compressed. Start fresh often. The project knowledge files mean you never lose context — you just pick up where you left off.

---

## What You'll See After Setup

- Left sidebar: **CareerSwarm III** project with all your conversations organized inside
- Every new conversation: Claude already knows the product, stack, James's profile, current priorities, and all the rules — without you saying anything
- Searchable history: All past conversations findable from within the project

---

## Files in Your Workspace That Support This System

| File | Purpose |
|------|---------|
| CLAUDE-PROJECT-BRIEF.md | Condensed knowledge file for Claude Projects (add to project) |
| CLAUDE.md | Full living document — updated end of every session, pushed to GitHub |
| CLAUDE-PROJECTS-SETUP.md | This file — setup instructions |
| GITHUB-REFERENCE.md | Plain English git guide for James |
