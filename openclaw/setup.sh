#!/bin/bash
# OpenClaw setup for CareerSwarm III — run this on your Mac.
# Usage: bash openclaw/setup.sh
set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}🦞 Setting up OpenClaw for CareerSwarm III...${NC}"
echo ""

# 1. Check Node
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org then re-run.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node $(node -v) found${NC}"

# 2. Install OpenClaw
echo -e "${CYAN}→ Installing OpenClaw...${NC}"
npm i -g openclaw
echo -e "${GREEN}✓ OpenClaw installed${NC}"

# 3. Create config dir
mkdir -p ~/.openclaw
echo -e "${GREEN}✓ ~/.openclaw directory ready${NC}"

# 4. Copy config if not already present
CONFIG_DEST="$HOME/.openclaw/openclaw.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_SRC="$SCRIPT_DIR/openclaw.json"

if [ -f "$CONFIG_DEST" ]; then
  echo -e "${YELLOW}⚠ Config already exists at $CONFIG_DEST — skipping copy.${NC}"
  echo -e "  To reset: cp $CONFIG_SRC $CONFIG_DEST"
else
  cp "$CONFIG_SRC" "$CONFIG_DEST"
  echo -e "${GREEN}✓ Config copied to $CONFIG_DEST${NC}"
fi

# 5. Check if tokens need to be filled in
if grep -q "REPLACE_WITH" "$CONFIG_DEST"; then
  echo ""
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}  Action required: fill in these values in $CONFIG_DEST${NC}"
  echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "  ${CYAN}1. Telegram bot token${NC}"
  echo "     → Open Telegram → search @BotFather → /newbot"
  echo "     → Replace: REPLACE_WITH_YOUR_TELEGRAM_BOT_TOKEN"
  echo ""
  echo -e "  ${CYAN}2. Anthropic API key (separate from CareerSwarm's production key)${NC}"
  echo "     → https://console.anthropic.com/settings/keys → Create new key"
  echo "     → Set \$30/mo spend cap: https://console.anthropic.com/settings/limits"
  echo "     → Replace: REPLACE_WITH_YOUR_OPENCLAW_ANTHROPIC_API_KEY"
  echo ""
  echo -e "  Then re-run: ${GREEN}openclaw gateway${NC}"
  echo ""
else
  # 6. Start gateway and pair
  echo ""
  echo -e "${GREEN}✓ Config looks good. Starting OpenClaw...${NC}"
  echo ""
  echo -e "${CYAN}Run these commands in order:${NC}"
  echo ""
  echo "  openclaw gateway"
  echo "  # (in a new terminal tab)"
  echo "  openclaw pairing list telegram"
  echo "  openclaw pairing approve telegram <CODE>"
  echo ""
  echo -e "${CYAN}Then on iPhone:${NC} Open Telegram → your bot → send the pairing code."
fi

echo ""
echo -e "${CYAN}Useful Telegram commands once paired:${NC}"
echo "  run the tests"
echo "  what does CLAUDE.md say?"
echo "  fix the TypeScript errors"
echo "  deploy   (you'll be asked for your Vercel token)"
echo "  switch to haiku   (cheaper for simple questions)"
echo ""
echo -e "${GREEN}🦞 Setup complete!${NC}"
