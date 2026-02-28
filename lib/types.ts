// ─── USER & AUTH ──────────────────────────────────────────────────────────────

export type UserType = 'job_seeker' | 'recruiter' | 'admin'
export type SubscriptionStatus = 'free' | 'pro' | 'premium'
export type OrgType = 'recruiter' | 'unemployment_office' | 'enterprise'
export type SubscriptionTier = 'starter' | 'professional' | 'enterprise'

export interface User {
  id: string
  email: string
  user_type: UserType
  organization_id: string | null
  subscription_status: SubscriptionStatus
  credits_remaining: number
  created_at: string
}

export interface Organization {
  id: string
  name: string
  type: OrgType
  subscription_tier: SubscriptionTier
  max_candidates: number
  created_at: string
}

// ─── CAREER DNA ───────────────────────────────────────────────────────────────

export interface CareerDNA {
  id: string
  user_id: string

  // Identity
  name: string
  email: string
  phone: string | null
  linkedin: string | null
  location: string

  // Profile
  current_title: string
  years_experience: string
  industries: string[]
  target_titles: string[]
  summary: string
  superpower: string

  // Criteria
  min_base: string
  min_ote: string
  location_preferences: string[]
  hard_exclusions: string[]

  // Skills
  skills_crm: string[]
  skills_ai: string[]
  skills_domain: string[]
  skills_partner_types: string[]
  skills_tools: string[]
  certifications: string[]
  awards: string[]

  // Differentiator
  differentiator: string

  // Work history (summary)
  companies: WorkHistory[]

  raw_resume_text: string | null
  created_at: string
  updated_at: string
}

export interface WorkHistory {
  company: string
  title: string
  dates: string
  stage: 'startup' | 'growth' | 'enterprise' | 'unknown'
}

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────

export type ImpactLevel = 'high' | 'medium' | 'low'

export interface Achievement {
  id: string
  user_id: string
  company: string
  title: string
  dates: string | null
  what: string
  metric: string
  how: string
  timeframe: string | null
  impact: ImpactLevel
  formatted: string // Google XYZ format
  included: boolean
  created_at: string
}

// ─── OPPORTUNITIES & SCORING ──────────────────────────────────────────────────

export type ApplyRecommendation = 'Apply Now' | 'Apply This Week' | 'Research First' | 'Skip'
export type RoleFit = 'Strong' | 'Good' | 'Weak' | 'Skip'

export interface ScoreReason {
  icon: '✓' | '⚠' | '✗'
  text: string
}

export interface OpportunityScore {
  score: number
  company: string
  role: string
  location_status: string
  location_ok: boolean
  location_note: string
  comp_estimate: string
  comp_ok: boolean
  comp_note: string
  role_type: string
  role_fit: RoleFit
  company_stage: string
  reasons: ScoreReason[]
  verdict: string
  apply_recommendation: ApplyRecommendation
}

// ─── GENERATED DOCUMENTS ─────────────────────────────────────────────────────

export type ApplicationStatus =
  | 'generated'
  | 'submitted'
  | 'interviewing'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

export interface GeneratedApplication {
  id: string
  user_id: string
  job_url: string | null
  company_name: string
  role_title: string
  job_description: string

  // Generated content
  resume_text: string
  cover_letter_text: string
  outreach_message: string | null

  // Scoring
  fit_score: number
  keywords_matched: number
  ats_score: number
  apply_recommendation: ApplyRecommendation

  // Tracking
  status: ApplicationStatus
  got_interview: boolean | null
  got_offer: boolean | null

  // Metadata
  achievements_used: string[]
  generated_at: string
  submitted_at: string | null
}

// ─── ONBOARDING STATE ─────────────────────────────────────────────────────────

export interface OnboardingState {
  // Step 1 — Upload
  resumeText: string
  name: string
  email: string
  linkedin: string
  location: string

  // Step 2 — Confirm (AI-extracted profile)
  profile: Partial<CareerDNA> | null

  // Step 3 — Achievements
  achievements: (Omit<Achievement, 'id' | 'user_id' | 'created_at'> & { tempId: string })[]

  // Step 4 — Skills & Differentiator
  differentiators: string[]
  skills: {
    crm: string[]
    ai: string[]
    domain: string[]
    partnerTypes: string[]
    tools: string[]
    certifications: string[]
    awards: string[]
  }
  differentiator: string

  // Step 5 — Scored Opportunities
  scoredOpportunities: (OpportunityScore & { jd: string })[]
}

// ─── API RESPONSES ────────────────────────────────────────────────────────────

export interface ParseResumeResponse {
  profile: Partial<CareerDNA>
  achievements: OnboardingState['achievements']
  skills: OnboardingState['skills']
  differentiators: string[]
}

export interface GenerateApplicationResponse {
  resume: string
  coverLetter: string
  outreachMessage: string
  fitScore: number
  atsScore: number
  keywordsMatched: number
  achievementsUsed: string[]
}
