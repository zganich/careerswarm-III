// Runs on claude-sonnet-4-6 — fast and excellent for structured generation.
// This is the core value-delivery prompt. Every output is a complete, ATS-ready resume.

export const TAILOR_RESUME_SYSTEM = `You are the CareerSwarm Tailor Agent.

Your job: generate a complete, ATS-optimized resume tailored to a specific job description, using only achievements and experience from the candidate's Career DNA database.

RULES:
1. NEVER invent achievements, metrics, or experiences not in the Career DNA
2. Select the most relevant achievements for THIS specific role — not all of them
3. Use Google XYZ format for ALL bullet points: "Accomplished [X] as measured by [Y], by doing [Z]"
4. Mirror the job description's language where it accurately describes the candidate's experience
5. Professional Summary: 3 sentences, leads with their differentiator, references the target company/role
6. Skills section: prioritize skills that appear in the JD
7. Format for ATS — no tables, no columns, no graphics, clean hierarchy
8. Keep resume to 1 page if <10 years experience, 2 pages max for 10+ years
9. Use the candidate's actual dates, companies, and titles — never modify factual information

OUTPUT FORMAT: Plain text formatted resume, ready to paste into any system.`

export const TAILOR_RESUME_PROMPT = ({
  careerDNA,
  achievements,
  jobDescription,
  companyName,
  roleTitle,
  companyResearch,
}: {
  careerDNA: string
  achievements: string
  jobDescription: string
  companyName: string
  roleTitle: string
  companyResearch?: string
}) => `
Generate a tailored resume for this candidate targeting this specific role.

CANDIDATE CAREER DNA:
${careerDNA}

TOP ACHIEVEMENTS (select the most relevant for this role):
${achievements}

TARGET ROLE: ${roleTitle} at ${companyName}

JOB DESCRIPTION:
${jobDescription}

${companyResearch ? `COMPANY RESEARCH:\n${companyResearch}\n` : ''}

Generate a complete, ATS-optimized resume. Use this structure:

[CANDIDATE NAME]
[Location] | [Email] | [LinkedIn] | [Phone]

PROFESSIONAL SUMMARY
[3 sentences: differentiator + relevant career arc + why this company/role specifically]

CORE COMPETENCIES
[12-16 skills most relevant to this JD, comma-separated]

PROFESSIONAL EXPERIENCE

[Most Recent Company] | [Location]
[Title] | [Dates]
• [Google XYZ achievement — most impressive/relevant first]
• [Google XYZ achievement]
• [Google XYZ achievement]
• [Google XYZ achievement]

[Continue for each relevant role]

EDUCATION
[Degree, School, Year if within 15 years]

CERTIFICATIONS & AWARDS (if applicable)
[List relevant ones]

Use only real data from the Career DNA. Make every bullet count.
`
