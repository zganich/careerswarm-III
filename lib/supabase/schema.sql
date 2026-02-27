-- ============================================================
-- CareerSwarm Database Schema
-- Run this in Supabase SQL editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ORGANIZATIONS (Recruiters, Unemployment Offices) ────────────────────────
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('recruiter', 'unemployment_office', 'enterprise')),
  subscription_tier TEXT CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  max_candidates INTEGER DEFAULT 50,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── USERS ───────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  user_type TEXT NOT NULL DEFAULT 'job_seeker' CHECK (user_type IN ('job_seeker', 'recruiter', 'admin')),
  organization_id UUID REFERENCES organizations(id),
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'pro', 'premium')),
  credits_remaining INTEGER DEFAULT 3,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CAREER DNA ───────────────────────────────────────────────────────────────
CREATE TABLE career_dna (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,

  -- Identity
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin TEXT,
  location TEXT NOT NULL,

  -- Profile
  current_title TEXT NOT NULL,
  years_experience TEXT,
  industries TEXT[] DEFAULT '{}',
  target_titles TEXT[] DEFAULT '{}',
  summary TEXT,
  superpower TEXT,

  -- Search Criteria
  min_base TEXT,
  min_ote TEXT,
  location_preferences TEXT[] DEFAULT '{}',
  hard_exclusions TEXT[] DEFAULT '{}',

  -- Skills
  skills_crm TEXT[] DEFAULT '{}',
  skills_ai TEXT[] DEFAULT '{}',
  skills_domain TEXT[] DEFAULT '{}',
  skills_partner_types TEXT[] DEFAULT '{}',
  skills_tools TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  awards TEXT[] DEFAULT '{}',

  -- Differentiator
  differentiator TEXT,

  -- Work History (JSONB for flexibility)
  companies JSONB DEFAULT '[]',

  -- Raw source material
  raw_resume_text TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  company TEXT NOT NULL,
  title TEXT NOT NULL,
  dates TEXT,
  what TEXT NOT NULL,
  metric TEXT NOT NULL,
  how TEXT,
  timeframe TEXT,
  impact TEXT CHECK (impact IN ('high', 'medium', 'low')) DEFAULT 'medium',

  -- Google XYZ formatted version
  formatted TEXT NOT NULL,

  -- Include in Career DNA (user can toggle off weak ones)
  included BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── GENERATED APPLICATIONS ───────────────────────────────────────────────────
CREATE TABLE generated_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Source
  job_url TEXT,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  job_description TEXT NOT NULL,

  -- Generated content
  resume_text TEXT NOT NULL,
  cover_letter_text TEXT NOT NULL,
  outreach_message TEXT,

  -- AI Scoring
  fit_score FLOAT,
  ats_score FLOAT,
  keywords_matched INTEGER,
  apply_recommendation TEXT,

  -- Achievements used (for analytics: which ones work)
  achievements_used UUID[] DEFAULT '{}',

  -- Application Tracking
  status TEXT DEFAULT 'generated' CHECK (
    status IN ('generated', 'submitted', 'interviewing', 'offer', 'rejected', 'withdrawn')
  ),
  got_interview BOOLEAN,
  got_offer BOOLEAN,
  submitted_at TIMESTAMPTZ,

  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RECRUITER CANDIDATES ─────────────────────────────────────────────────────
CREATE TABLE recruiter_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  candidate_user_id UUID REFERENCES users(id), -- If candidate has own account
  candidate_name TEXT NOT NULL,
  candidate_email TEXT,
  uploaded_resume_url TEXT,
  career_dna_extracted BOOLEAN DEFAULT FALSE,
  career_dna_id UUID REFERENCES career_dna(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_candidates ENABLE ROW LEVEL SECURITY;

-- Users: own row only
CREATE POLICY "users_own" ON users
  FOR ALL USING (auth.uid() = id);

-- Career DNA: own only
CREATE POLICY "career_dna_own" ON career_dna
  FOR ALL USING (auth.uid() = user_id);

-- Achievements: own only
CREATE POLICY "achievements_own" ON achievements
  FOR ALL USING (auth.uid() = user_id);

-- Applications: own only
CREATE POLICY "applications_own" ON generated_applications
  FOR ALL USING (auth.uid() = user_id);

-- Recruiter candidates: recruiter owns
CREATE POLICY "recruiter_candidates_own" ON recruiter_candidates
  FOR ALL USING (auth.uid() = recruiter_id);

-- ─── TRIGGERS: updated_at ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER career_dna_updated_at BEFORE UPDATE ON career_dna
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER orgs_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── FUNCTION: Create user profile on signup ──────────────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX achievements_user_id ON achievements(user_id);
CREATE INDEX achievements_impact ON achievements(impact);
CREATE INDEX applications_user_id ON generated_applications(user_id);
CREATE INDEX applications_status ON generated_applications(status);
CREATE INDEX recruiter_candidates_recruiter_id ON recruiter_candidates(recruiter_id);
