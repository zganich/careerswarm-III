/**
 * CareerSwarm ATS Scoring Engine
 *
 * Replicates how real Applicant Tracking Systems score resumes:
 * 1. Extract keywords from JD, weighted by importance signals
 * 2. Match against resume text
 * 3. Score resume structure / format compliance
 * 4. Produce a separate "fit" score based on role/level/industry alignment
 *
 * No AI calls — fast, deterministic, low latency.
 */

// ─── STOP WORDS ───────────────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'being', 'but', 'by',
  'can', 'do', 'for', 'from', 'get', 'has', 'have', 'he', 'her', 'here',
  'him', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'its', 'may', 'not',
  'of', 'on', 'or', 'our', 'out', 'own', 'she', 'so', 'some', 'than',
  'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this',
  'those', 'to', 'up', 'us', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'who', 'will', 'with', 'would', 'you', 'your',
  // Job posting filler words
  'work', 'join', 'team', 'company', 'role', 'position', 'apply', 'applying',
  'looking', 'seeking', 'passionate', 'excited', 'opportunity', 'opportunities',
  'equal', 'employer', 'benefits', 'competitive', 'about', 'across', 'also',
  'any', 'both', 'each', 'every', 'including', 'make', 'more', 'much', 'must',
  'need', 'new', 'other', 'plus', 'provide', 'such', 'take', 'through',
  'use', 'well', 'within',
])

// ─── IMPORTANCE SIGNALS ───────────────────────────────────────────────────────

// Line-level signals — weight the terms on that line
const REQUIRED_RE = /\b(required|must have|must-have|mandatory|essential|critical|you (will|must|should) have|necessary|non-negotiable)\b/i
const PREFERRED_RE = /\b(preferred|nice to have|ideal|plus|bonus|advantage|ideally|desired|helpful)\b/i

// These are the signal words themselves — never extract them as skill keywords
const SIGNAL_WORDS = new Set([
  'required', 'mandatory', 'essential', 'critical', 'necessary',
  'preferred', 'ideal', 'desired', 'helpful', 'advantage', 'ideally',
  'experience', 'background', 'knowledge', 'skills', 'ability', 'proficiency',
  'proven', 'strong', 'excellent', 'good', 'great', 'deep', 'solid',
])

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Keyword {
  term: string
  weight: number // 2 = required, 1 = normal, 0.5 = preferred
}

export interface ATSResult {
  atsScore: number
  fitScore: number
  keywordsMatched: number
  keywordsTotal: number
  requiredMatched: number
  requiredTotal: number
  missingKeywords: string[]
}

// ─── KEYWORD EXTRACTION ───────────────────────────────────────────────────────

/**
 * Extract meaningful keywords from a job description, weighted by importance.
 */
function extractKeywords(jd: string): Keyword[] {
  const map = new Map<string, number>()

  const lines = jd.split(/\n+/)

  for (const line of lines) {
    const weight = REQUIRED_RE.test(line) ? 2 : PREFERRED_RE.test(line) ? 0.5 : 1

    // Normalize: lowercase, keep alphanumeric + # + . + + (for C#, .NET, C++)
    const cleaned = line.toLowerCase().replace(/[^a-z0-9#+.\- ]/g, ' ')
    // Skip signal words AND generic stop words from token list
    const tokens = cleaned.split(/\s+/).filter(
      (w) => w.length > 2 && !STOP_WORDS.has(w) && !SIGNAL_WORDS.has(w)
    )

    // Single tokens
    for (const token of tokens) {
      if (token.length >= 3) {
        const cur = map.get(token) ?? 0
        map.set(token, Math.max(cur, weight))
      }
    }

    // 2-gram phrases (e.g. "partner sales", "channel strategy", "salesforce cpq")
    // Only build phrases from non-signal, non-stop tokens
    for (let i = 0; i < tokens.length - 1; i++) {
      if (STOP_WORDS.has(tokens[i]) || STOP_WORDS.has(tokens[i + 1])) continue
      if (SIGNAL_WORDS.has(tokens[i]) || SIGNAL_WORDS.has(tokens[i + 1])) continue
      const phrase = `${tokens[i]} ${tokens[i + 1]}`
      if (phrase.length >= 6) {
        const cur = map.get(phrase) ?? 0
        map.set(phrase, Math.max(cur, weight))
      }
    }
  }

  // Return sorted by weight desc, term length desc (prefer longer/more specific matches)
  return Array.from(map.entries())
    .map(([term, weight]) => ({ term, weight }))
    .sort((a, b) => b.weight - a.weight || b.term.length - a.term.length)
    .slice(0, 200) // cap at 200 terms
}

// ─── STRUCTURE SCORING ────────────────────────────────────────────────────────

/**
 * Score resume structure completeness (0–100).
 * Mirrors what ATS parsers check for.
 */
function scoreStructure(resume: string): number {
  let score = 0

  // Required sections — ATS expects these headers
  if (/\b(summary|professional summary|objective|profile)\b/i.test(resume)) score += 12
  if (/\b(experience|work experience|employment|professional experience)\b/i.test(resume)) score += 18
  if (/\b(education|academic|degree)\b/i.test(resume)) score += 10
  if (/\b(skills|competencies|core competencies|expertise|technical skills)\b/i.test(resume)) score += 12

  // Contact info
  if (/@[a-z0-9.-]+\.[a-z]{2,}/i.test(resume)) score += 6    // email
  if (/linkedin\.com/i.test(resume)) score += 4               // LinkedIn

  // Quantified achievements (numbers = dollars, %, multipliers, headcounts)
  const metrics = resume.match(/\$[\d,]+[MBK]?|\d+%|\d+x|\b\d{1,3}[,\d]* (reps|accounts|partners|customers|employees|users)\b/gi) || []
  score += Math.min(metrics.length * 3, 18) // up to 18 points for 6+ metrics

  // Date ranges — structured work history
  if (/20\d{2}/.test(resume)) score += 8

  // Google XYZ / action verb bullets
  const bullets = (resume.match(/^[•\-*]\s+[A-Z]/gm) || []).length
  score += Math.min(bullets * 1, 12) // up to 12 points

  return Math.min(score, 100)
}

// ─── FIT SCORE ────────────────────────────────────────────────────────────────

/**
 * Score role/level/industry alignment between JD and candidate.
 * This is the "human fit" signal, separate from ATS keyword matching.
 */
function scoreFit(
  jd: string,
  resume: string,
  careerDNA?: Record<string, unknown>
): number {
  let score = 45
  const jdL = jd.toLowerCase()
  const resL = resume.toLowerCase()

  // ── Seniority alignment ──────────────────────────────────────────────
  const levels: Array<[string, string[]]> = [
    ['c-suite', ['chief ', 'cro', 'cso', 'cpo', 'cmo', 'cto', 'coo', 'ceo']],
    ['evp-svp', ['executive vice president', 'evp', 'svp', 'senior vice president']],
    ['vp', ['vp ', 'vice president', 'head of']],
    ['director', ['director', 'managing director']],
    ['manager', ['manager', 'lead ', 'senior manager']],
    ['ic', ['specialist', 'coordinator', 'associate', 'analyst']],
  ]

  const detectLevel = (text: string) => {
    for (const [level, terms] of levels) {
      if (terms.some((t) => text.includes(t))) return level
    }
    return 'unknown'
  }

  const jdLevel = detectLevel(jdL)
  const resLevel = detectLevel(resL)

  if (jdLevel !== 'unknown' && jdLevel === resLevel) score += 18
  else if (jdLevel !== 'unknown' && resLevel !== 'unknown' && jdLevel !== resLevel) {
    // adjacent levels are ok; big mismatches penalize
    const idx = levels.map(([l]) => l)
    const jdIdx = idx.indexOf(jdLevel)
    const resIdx = idx.indexOf(resLevel)
    const gap = Math.abs(jdIdx - resIdx)
    if (gap === 1) score += 6
    else if (gap >= 2) score -= 10
  }

  // ── Industry / domain alignment ──────────────────────────────────────
  const domains = [
    'saas', 'software', 'cloud', 'enterprise', 'fintech', 'healthtech',
    'ai', 'machine learning', 'channel', 'partnerships', 'alliances',
    'ecommerce', 'marketplace', 'cybersecurity', 'devops', 'infrastructure',
    'b2b', 'b2c', 'platform', 'api', 'open source',
  ]
  let domainMatches = 0
  for (const d of domains) {
    if (jdL.includes(d) && resL.includes(d)) domainMatches++
  }
  score += Math.min(domainMatches * 4, 16)

  // ── Key metric / outcome alignment ───────────────────────────────────
  const outcomeTerms = [
    'revenue', 'arr', 'mrr', 'pipeline', 'quota', 'bookings', 'growth',
    'partners', 'channel', 'ecosystem', 'alliances', 'headcount', 'retention',
    'expansion', 'churn', 'nrr', 'gm', 'gross margin',
  ]
  let outcomeMatches = 0
  for (const term of outcomeTerms) {
    if (jdL.includes(term) && resL.includes(term)) outcomeMatches++
  }
  score += Math.min(outcomeMatches * 3, 15)

  // ── Career DNA boost ─────────────────────────────────────────────────
  if (careerDNA) {
    // Target role title in JD
    const targets = (careerDNA.target_titles as string[] | undefined) || []
    if (targets.some((t) => jdL.includes(t.toLowerCase()))) score += 8

    // Candidate's core skills appear in JD
    const skills = [
      ...((careerDNA.skills_crm as string[] | undefined) || []),
      ...((careerDNA.skills_domain as string[] | undefined) || []),
      ...((careerDNA.skills_partner_types as string[] | undefined) || []),
    ]
    const skillHits = skills.filter((s) => jdL.includes(s.toLowerCase())).length
    score += Math.min(skillHits * 2, 12)
  }

  return Math.min(Math.max(Math.round(score), 20), 99)
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────

/**
 * Score a generated resume against a job description.
 *
 * Returns two distinct signals:
 * - atsScore: keyword match + format compliance (what an ATS parser sees)
 * - fitScore: seniority + domain + outcome alignment (what a recruiter sees)
 */
export function scoreResume(
  jd: string,
  resume: string,
  careerDNA?: Record<string, unknown>
): ATSResult {
  const keywords = extractKeywords(jd)
  const resumeL = resume.toLowerCase()

  // ── Keyword matching ──────────────────────────────────────────────────
  let matchedWeight = 0
  let totalWeight = 0
  let keywordsMatched = 0
  let requiredMatched = 0
  const missingKeywords: string[] = []

  const required = keywords.filter((k) => k.weight >= 2)

  for (const kw of keywords) {
    totalWeight += kw.weight
    if (resumeL.includes(kw.term)) {
      matchedWeight += kw.weight
      keywordsMatched++
      if (kw.weight >= 2) requiredMatched++
    } else if (kw.weight >= 2 && missingKeywords.length < 8) {
      missingKeywords.push(kw.term)
    }
  }

  // Keyword score contributes 65% of ATS score
  const keywordRatio = totalWeight > 0 ? matchedWeight / totalWeight : 0.5
  const keywordScore = keywordRatio * 65

  // Structure score contributes 35%
  const structureScore = (scoreStructure(resume) / 100) * 35

  let atsScore = Math.round(keywordScore + structureScore)

  // Hard cap if required keywords badly missed
  if (required.length > 0) {
    const requiredRate = requiredMatched / required.length
    if (requiredRate < 0.4) atsScore = Math.min(atsScore, 62)
    else if (requiredRate < 0.6) atsScore = Math.min(atsScore, 75)
  }

  atsScore = Math.min(Math.max(atsScore, 28), 99)

  // ── Fit score ─────────────────────────────────────────────────────────
  const fitScore = scoreFit(jd, resume, careerDNA)

  return {
    atsScore,
    fitScore,
    keywordsMatched,
    keywordsTotal: keywords.length,
    requiredMatched,
    requiredTotal: required.length,
    missingKeywords,
  }
}
