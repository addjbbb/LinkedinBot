-- Migration: Add password change requirement for admins
-- Date: 2025-11-10
-- Description: Force default admin to change password on first login

-- Add must_change_password flag
ALTER TABLE admins
ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT false;

-- Set flag to true for existing admins (force password change)
UPDATE admins
SET must_change_password = true
WHERE email = 'admin@voyage-mystere.fr';

-- Add comment
COMMENT ON COLUMN admins.must_change_password IS 'Forces admin to change password on next login (security)';
