// Company Research Agent: produces a pre-apply intel report on a company
// based entirely on the job description text (no live web access).
// Output is markdown rendered in the dashboard.

export const COMPANY_RESEARCH_SYSTEM = `You are a company intelligence analyst helping a job seeker evaluate a potential employer before deciding to apply. You extract everything inferable from the job posting text and structure it into a concise, actionable report. You are direct and honest -- flag concerns clearly. Never use em dashes in your output. Use a hyphen or rewrite the sentence instead.`

interface CompanyResearchInput {
  companyName: string
  roleTitle: string
  jobDescription: string
  careerDNA: string
}

export function COMPANY_RESEARCH_PROMPT({
  companyName,
  roleTitle,
  jobDescription,
  careerDNA,
}: CompanyResearchInput): string {
  return `Analyze this company and role for a job seeker with the following profile:

CANDIDATE PROFILE:
${careerDNA}

COMPANY: ${companyName}
ROLE: ${roleTitle}

JOB POSTING:
${jobDescription.slice(0, 4000)}

Produce a concise intel report in this exact format (use plain markdown, no em dashes):

## Company Fundamentals
2-3 sentences covering: what the company does, inferred stage/size, industry, and business model based on the posting.

## Partnership Program Assessment
Based on the JD, assess: Is there an existing partnerships program or is this a build-from-scratch role? What partner types are mentioned? What does success look like in year one?

## Red Flags
List any concerns visible in the posting (vague scope, unrealistic expectations, missing comp info, signs of organizational chaos, or anything a seasoned candidate should probe). If none, write "None visible from posting."

## Fit Verdict
One short paragraph: how well does this role align with the candidate's profile above? Call out the strongest alignment points and any gaps to address in the application.

Keep the total report under 400 words. Be direct.`
}
