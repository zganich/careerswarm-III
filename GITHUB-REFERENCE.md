# GitHub Reference Guide — CareerSwarm III
> For non-technical use. Keep this. Read it before touching anything in Claude Code.

---

## The Simple Mental Model

Think of your code like a Google Doc — but with superpowers.

| Concept | What it means in plain English |
|---------|-------------------------------|
| **Local** | Your computer (or the Claude Code environment) |
| **GitHub** | The cloud backup — the "real" version everyone can see |
| **Commit** | Taking a snapshot: "Save this exact state, with a note about what changed" |
| **Push** | Sending your local snapshots up to GitHub |
| **Pull** | Downloading the latest from GitHub to your local machine |
| **Branch** | A parallel copy of the code to experiment on without breaking the main version |
| **Main** | The live branch — what Vercel deploys from |

**The flow every time:**
1. Make changes (Claude Code does this for you)
2. Commit — save a snapshot with a message
3. Push — send it to GitHub
4. Vercel sees the push and automatically redeploys careerswarm.com

You never need to do steps 2-4 manually. Claude Code does them. You just need to know what they mean when Claude reports back.

---

## What Lives Where

```
Your computer / Claude Code environment
    └── /careerswarm-III/          <- the actual codebase
         ├── CLAUDE.md             <- the brain (must stay in sync with GitHub)
         ├── app/                  <- all the pages and API routes
         ├── lib/                  <- shared code (prompts, types, claude client)
         └── supabase/migrations/  <- database change history

GitHub (github.com/zganich/careerswarm-III)
    └── main branch               <- the "official" version
         └── everything above, kept in sync via push

Vercel (careerswarm.com)
    └── watches GitHub main branch
         └── every push triggers a new build and deploy automatically
```

**Rule:** If a change isn't on GitHub, it doesn't exist for Vercel. It doesn't exist for future Claude sessions. It doesn't exist if your computer dies.

---

## The Commands Claude Code Runs (so you know what they mean)

| Command | What it does |
|---------|-------------|
| `git status` | Shows what files have changed since the last commit |
| `git diff` | Shows the exact lines that changed |
| `git add CLAUDE.md` | Stages a specific file to be included in the next commit |
| `git commit -m "docs: update current state"` | Takes the snapshot with a message |
| `git push origin main` | Sends the snapshot to GitHub |
| `git log --oneline -5` | Shows the last 5 commits (like a change history) |
| `tsc --noEmit` | Checks for TypeScript errors — must be 0 before committing |

**You never need to type these.** Claude Code runs them. But when Claude says "pushed to main" or "0 TypeScript errors" — this is what it means.

---

## Commit Message Format

CareerSwarm uses a standard prefix system. Claude Code follows this automatically.

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature added |
| `fix:` | Bug fixed |
| `chore:` | Maintenance, config, no logic change |
| `docs:` | Documentation only (CLAUDE.md updates, README, etc.) |

Example: `docs: update current state after Notion setup session`

---

## When CLAUDE.md Changes

CLAUDE.md lives in the repo. When Cowork updates it (like today), that change needs to be committed and pushed via Claude Code before GitHub reflects it.

**The handoff:**
1. Cowork updates CLAUDE.md in the workspace folder
2. You open Claude Code (terminal) and say: "Commit and push the CLAUDE.md update"
3. Claude Code runs: `git add CLAUDE.md && git commit -m "docs: update current state" && git push origin main`
4. Done. GitHub has it. Future sessions have it.

**If you skip this step:** The next Claude Code session won't see the Cowork updates. The file on your disk and the file on GitHub will be out of sync. This is how context gets lost.

---

## What NEVER to Do

- Never commit directly from two environments at the same time (race condition)
- Never force push: `git push --force` (destroys history)
- Never commit `.env` files (contains secrets — they should stay in Vercel only)
- Never skip `tsc --noEmit` before committing code changes

---

## The One Command to Know

If you're ever unsure of the state of the repo, open Claude Code and say:

> "Run git status and git log --oneline -5 and tell me where we are."

That's it. Claude will read the state and tell you exactly what's committed, what's not, and what's in sync with GitHub.

---

## Vercel Deploy Status

After any push to main, go to:
`https://vercel.com/jknight3-gmailcoms-projects/careerswarm-iii`

You'll see the build log. Green = live. Red = something broke. Claude Code checks this automatically and will tell you if a build fails.

---

*Last updated: March 16, 2026*
