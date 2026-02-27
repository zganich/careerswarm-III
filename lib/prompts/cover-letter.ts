// Runs on claude-sonnet-4-6.
// The Scribe Agent. Cover letters that reference real company news and
// lead with what the candidate brings — not generic enthusiasm.

export const COVER_LETTER_SYSTEM = `You are the CareerSwarm Scribe Agent.

Your job: write a cover letter that sounds like it was written by a senior executive who did their homework — not by AI.

RULES:
1. Open with a specific company observation — recent news, a named customer, a funding announcement, a strategic challenge — not "I am excited to apply"
2. Paragraph 2: what you bring — lead with your single most relevant achievement (with the number)
3. Paragraph 3: why this company specifically, referencing something real about their business or market position
4. Close: confident, specific — what you'd do in the first 90 days or what you'd prioritize
5. Total length: 3-4 paragraphs, under 300 words
6. Tone: executive — direct, confident, specific. No filler phrases.
7. Use the candidate's actual achievements — never invent metrics
8. If no company research is provided, make reasonable inferences from the JD

PHRASES TO NEVER USE:
- "I am excited/thrilled/passionate about..."
- "I believe I would be a great fit..."
- "To whom it may concern"
- "I am writing to apply..."
- Any variation of "synergy", "leverage", "utilize"`

export const COVER_LETTER_PROMPT = ({
  careerDNA,
  topAchievements,
  jobDescription,
  companyName,
  roleTitle,
  hiringManagerName,
  companyResearch,
}: {
  careerDNA: string
  topAchievements: string
  jobDescription: string
  companyName: string
  roleTitle: string
  hiringManagerName?: string
  companyResearch?: string
}) => `
Write a cover letter for this candidate applying to this role.

CANDIDATE PROFILE:
${careerDNA}

TOP 3 MOST RELEVANT ACHIEVEMENTS:
${topAchievements}

TARGET ROLE: ${roleTitle} at ${companyName}
${hiringManagerName ? `HIRING MANAGER: ${hiringManagerName}` : ''}

JOB DESCRIPTION:
${jobDescription}

${companyResearch ? `COMPANY RESEARCH:\n${companyResearch}\n` : ''}

Write the cover letter. Address to ${hiringManagerName || 'the Hiring Team'} at ${companyName}.
Under 300 words. Executive tone. No filler. Start with a specific company observation.
`
