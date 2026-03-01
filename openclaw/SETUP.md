# OpenClaw Setup — CareerSwarm III

Control CareerSwarm development from your iPhone via Telegram.
Message your bot → it invokes Claude Code on your Mac → changes are committed and pushed automatically.

---

## Prerequisites

- Mac with Node.js 18+ installed
- iPhone with Telegram
- Anthropic account (console.anthropic.com)

---

## Step 1 — Create a Telegram bot

1. Open Telegram on your iPhone
2. Search for **@BotFather** → tap **Start**
3. Send: `/newbot`
4. Follow prompts: give it a name (e.g. `CareerSwarm Dev`) and a username ending in `_bot`
5. BotFather replies with a token like `7123456789:AAHdqTcvCH...` — copy it
6. Tap the link BotFather gives you to open your new bot, then tap **Start**

---

## Step 2 — Get a dedicated Anthropic API key

1. Go to **console.anthropic.com/settings/keys**
2. Click **Create Key** → name it `openclaw`
3. Copy the key (starts with `sk-ant-api03-...`)
4. Go to **console.anthropic.com/settings/limits** → set a **$30/mo** hard spend cap

Use a *separate* key from the CareerSwarm production `ANTHROPIC_API_KEY` so spend is isolated.

---

## Step 3 — Run setup on your Mac

```bash
bash ~/careerswarm-III/openclaw/setup.sh
```

This installs OpenClaw globally (`npm i -g openclaw`) and copies the config template to `~/.openclaw/openclaw.json`.

---

## Step 4 — Fill in your tokens

```bash
nano ~/.openclaw/openclaw.json
```

Replace the two placeholders:

| Find | Replace with |
|---|---|
| `REPLACE_WITH_YOUR_TELEGRAM_BOT_TOKEN` | token from Step 1 |
| `REPLACE_WITH_YOUR_OPENCLAW_ANTHROPIC_API_KEY` | key from Step 2 |

Save: `Ctrl+O` → Enter → `Ctrl+X`

---

## Step 5 — Start the gateway

```bash
openclaw gateway
```

Wait until you see `Telegram: connected`.

---

## Step 6 — Pair your iPhone

In a second terminal tab:

```bash
openclaw pairing list telegram
# Shows a short pairing code, e.g. ABC-123
openclaw pairing approve telegram ABC-123
```

On your iPhone, open Telegram → your bot → send that code (e.g. `ABC-123`).
You should get back: `✓ Paired. You can now send tasks.`

---

## Step 7 — Verify it works

Send these messages from your iPhone:

```
hello
```
→ Should reply with `🦞 Hey! ...`

```
what branch is careerswarm on?
```
→ Should reply `claude/chat-claude-code-integration-BzsLN`

```
run the typescript check
```
→ Runs `npx tsc --noEmit` and reports results

---

## Keep it running (background)

To keep OpenClaw alive after closing Terminal:

```bash
nohup openclaw gateway > ~/.openclaw/gateway.log 2>&1 &
echo $! > ~/.openclaw/gateway.pid
```

To stop it:

```bash
kill $(cat ~/.openclaw/gateway.pid)
```

To check if it's running:

```bash
ps aux | grep openclaw
```

---

## Cost tips

The config already applies these savings automatically:

- **Haiku** model for questions, lookups, file reads
- **Sonnet** (default) for actual code changes
- Responses are kept short (Telegram, not a chat window)
- Daily session reset at 6 AM UTC (keeps context window lean)

With the $30/mo cap, you're well-protected. Typical dev session = $0.10–$0.50.

---

## Useful commands (send from iPhone)

```
read CLAUDE.md
what's in the session log?
run the playwright tests
check for typescript errors
what files changed recently?
show me the dashboard generate tab code
fix the [describe bug]
add [describe feature]
commit and push
deploy (ask me for the Vercel token first)
```

---

## Config files

| File | Purpose |
|---|---|
| `openclaw/openclaw.json` | Config template (committed to repo) |
| `openclaw/setup.sh` | One-command Mac installer |
| `~/.openclaw/openclaw.json` | Your live config (tokens filled in, NOT in repo) |
| `~/.openclaw/gateway.log` | Gateway logs (when running in background) |
