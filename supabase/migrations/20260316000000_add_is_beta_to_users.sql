-- ============================================================
-- Add is_beta flag to users table
-- Beta users receive unlimited access regardless of subscription tier
-- ============================================================

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_beta BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN users.is_beta IS 'When true, user has unlimited access to all features (beta bypass). Set manually by admin.';
