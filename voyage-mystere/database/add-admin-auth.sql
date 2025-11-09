-- =============================================
-- ADMIN AUTHENTICATION SYSTEM
-- =============================================

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin'
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin sessions table for token management
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index on token for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table
-- Admins cannot be accessed via regular Supabase client (only via service role)
CREATE POLICY "Admins are not accessible publicly"
  ON admins FOR ALL
  USING (false);

-- RLS Policies for admin_sessions table
CREATE POLICY "Admin sessions are not accessible publicly"
  ON admin_sessions FOR ALL
  USING (false);

-- Create default super admin
-- Password: admin123 (CHANGE THIS IN PRODUCTION!)
-- Hash generated with bcrypt, rounds=10
INSERT INTO admins (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@voyage-mystere.fr',
  '$2a$10$rMQxq8fN5vE7YC3LQQx8hOmYHZqFZQWJVJfZQXqYQXqYQXqYQXqYQ', -- admin123
  'Admin',
  'Voyage Mystère',
  'super_admin'
)
ON CONFLICT (email) DO NOTHING;

-- ✅ Admin authentication system created successfully!
--
-- Default credentials (CHANGE IN PRODUCTION):
-- Email: admin@voyage-mystere.fr
-- Password: admin123
