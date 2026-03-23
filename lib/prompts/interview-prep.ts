// Interview Prep Agent -- produces a company-specific prep brief using the
// candidate's actual achievements as STAR story material.
// Output is markdown rendered in the dashboard.

export const INTERVIEW_PREP_SYSTEM = `You are an executive interview coach preparing a senior professional for a high-stakes job interview. You create tailored prep briefs that draw exclusively from the candidate's real achievements -- never fabricate metrics or results. You are direct, specific, and practical. Never use em dashes in your output.`

interface InterviewPrepInput {
  companyName: string
  roleTitle: string
  jobDescription: string
  careerDNA: string
  achievements: string
}

export function INTERVIEW_PREP_PROMPT({
  companyName,
  roleTitle,
  jobDescription,
  careerDNA,
  achievements,
}: InterviewPrepInput): string {
  return `Prepare a focused interview brief for this candidate and role.

CANDIDATE PROFILE:
${careerDNA}

TOP ACHIEVEMENTS (use these as your STAR story source -- do not invent numbers):
${achievements}

COMPANY: ${companyName}
ROLE: ${roleTitle}

JOB POSTING:
${jobDescription.slice(0, 3000)}

Produce the prep brief in this exact format (plain markdown, no em dashes):

## Company Snapshot
3 bullet points: what the company does, inferred stage and funding status, what success looks like in this role based on the JD.

## Likely Questions
5 questions this interview panel will almost certainly ask, based on the JD requirements. Make them specific to this role, not generic.

## STAR Stories to Pull
For each of the 3 most relevant achievements from the list above, write:
- Achievement label (company + result)
- The Situation/Task in one sentence
- The Action in one sentence
- The Result (use the exact metric from the achievement -- never round up or fabricate)
- Which likely question above this story answers best

## Questions to Ask Them
5 sharp questions the candidate should ask the interviewer. Tailor them to this specific company and role. Never include questions about compensation, benefits, or vacation.

## 60-Second Opening
A concise "tell me about yourself" opening tailored to why this candidate is the right person for this specific role at this specific company. No em dashes.

Keep the total brief under 600 words.`
}
