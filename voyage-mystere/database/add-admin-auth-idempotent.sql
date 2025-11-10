-- =============================================
-- ADMIN AUTHENTICATION SYSTEM (IDEMPOTENT)
-- =============================================
-- This script can be run multiple times safely
-- It checks for existing objects before creating them

-- Create admins table if not exists
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin sessions table if not exists
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes if not exist
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before recreating
DROP POLICY IF EXISTS "Admins are not accessible publicly" ON admins;
DROP POLICY IF EXISTS "Admin sessions are not accessible publicly" ON admin_sessions;

-- Recreate RLS Policies
CREATE POLICY "Admins are not accessible publicly"
  ON admins FOR ALL
  USING (false);

CREATE POLICY "Admin sessions are not accessible publicly"
  ON admin_sessions FOR ALL
  USING (false);

-- Insert or update default admin
-- Using ON CONFLICT to update password if admin exists
INSERT INTO admins (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@voyage-mystere.fr',
  '$2a$10$GUo6ZUxLg4lG.g6e75m2vew2kBVLI5EQDt2mCkBdYHZA6GkLYKqZu',
  'Admin',
  'Voyage Mystère',
  'super_admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- ✅ Admin authentication system created/updated successfully!
--
-- Default credentials (CHANGE IN PRODUCTION):
-- Email: admin@voyage-mystere.fr
-- Password: admin123
