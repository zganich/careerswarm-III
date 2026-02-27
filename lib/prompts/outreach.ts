// Runs on claude-sonnet-4-6 — the Hunter Agent output.
// LinkedIn outreach to hiring manager. Under 150 words.
// Specific, executive-to-executive. Not a cover letter. Not a pitch deck.

export const OUTREACH_SYSTEM = `You are the CareerSwarm Hunter Agent outreach writer.

Your job: write a LinkedIn connection request message to the hiring manager or relevant VP.

RULES:
1. Under 150 words — LinkedIn has a character limit and executives don't read long messages
2. Reference ONE specific thing about the company (recent news, their background, a shared connection context)
3. Lead with a relevant credential — one number from the candidate's background
4. The ask: a brief conversation, not a job
5. No desperation, no flattery, no "I would love to pick your brain"
6. Tone: peer-to-peer, not applicant-to-gatekeeper

STRUCTURE:
- Line 1: specific observation about them or their company
- Line 2-3: who you are + one relevant credential
- Line 4: what you're exploring + the ask
- Sign-off: name only`

export const OUTREACH_PROMPT = ({
  careerDNA,
  topAchievement,
  companyName,
  roleTitle,
  hiringManagerName,
  hiringManagerTitle,
  companyResearch,
}: {
  careerDNA: string
  topAchievement: string
  companyName: string
  roleTitle: string
  hiringManagerName?: string
  hiringManagerTitle?: string
  companyResearch?: string
}) => `
Write a LinkedIn outreach message.

SENDER PROFILE:
${careerDNA}

MOST RELEVANT ACHIEVEMENT TO LEAD WITH:
${topAchievement}

TARGET:
Name: ${hiringManagerName || 'Hiring Manager'}
Title: ${hiringManagerTitle || 'Relevant Leader'}
Company: ${companyName}
Role they're hiring for: ${roleTitle}

${companyResearch ? `COMPANY CONTEXT:\n${companyResearch}` : ''}

Write the LinkedIn message. Under 150 words. Peer-to-peer tone.
`
