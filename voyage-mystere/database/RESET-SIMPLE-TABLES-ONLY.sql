-- =============================================
-- RESET SIMPLE - TABLES UNIQUEMENT
-- =============================================
-- ⚠️ Supprimez d'abord les utilisateurs manuellement via l'interface Supabase !
-- Authentication → Users → Delete user
-- =============================================

-- Désactiver temporairement les contraintes
SET session_replication_role = replica;

-- Supprimer toutes les tables
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admins CASCADE;
DROP TABLE IF EXISTS user_credits CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS booking_options CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS available_dates CASCADE;
DROP TABLE IF EXISTS questionnaire_responses CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert own profile during signup" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can insert own profile during signup"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. DESTINATIONS TABLE
-- =============================================
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  theme VARCHAR(50) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  region VARCHAR(100) NOT NULL,
  country VARCHAR(100) DEFAULT 'France',
  description TEXT,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active destinations" ON destinations;

CREATE POLICY "Anyone can read active destinations"
  ON destinations FOR SELECT
  USING (is_active = true);

INSERT INTO destinations (name, theme, region, country, description, is_active) VALUES
  ('Château de la Loire', 'romantique', 'Centre-Val de Loire', 'France', 'Un château romantique au cœur de la vallée de la Loire', true),
  ('Cabane dans les Alpes', 'nature', 'Auvergne-Rhône-Alpes', 'France', 'Refuge paisible en pleine montagne', true),
  ('Loft parisien', 'urbain', 'Île-de-France', 'France', 'Appartement moderne au cœur de Paris', true);

-- =============================================
-- 3. BOOKINGS TABLE
-- =============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'VM-' || TO_CHAR(NOW(), 'YYYY-MM-') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_guests INTEGER DEFAULT 2,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'cancelled', 'completed')),
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address_line1 VARCHAR(255),
  postal_code VARCHAR(20),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'France',
  special_requests TEXT,
  upgrade VARCHAR(50),
  selected_options TEXT[],
  payment_status VARCHAR(20) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  referral_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Anonymous can view bookings by email" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    email = (auth.jwt() ->> 'email')::text
  );

CREATE POLICY "Anonymous can view bookings by email"
  ON bookings FOR SELECT
  TO anon
  USING (email IS NOT NULL);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR email = (auth.jwt() ->> 'email')::text);

-- =============================================
-- 4. QUESTIONNAIRE_RESPONSES TABLE
-- =============================================
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  interests TEXT[],
  travel_style VARCHAR(50),
  budget_preference VARCHAR(50),
  special_occasions TEXT,
  dietary_restrictions TEXT[],
  accessibility_needs TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 5. AVAILABLE_DATES TABLE
-- =============================================
CREATE TABLE available_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 10,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(theme, date)
);

ALTER TABLE available_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Available dates are publicly readable" ON available_dates;

CREATE POLICY "Available dates are publicly readable"
  ON available_dates FOR SELECT
  USING (is_available = true);

CREATE INDEX idx_available_dates_theme_date ON available_dates(theme, date);
CREATE INDEX idx_available_dates_available ON available_dates(is_available);

-- =============================================
-- 6. PAYMENTS TABLE
-- =============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  payment_method VARCHAR(50),
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payments" ON payments;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE user_id = auth.uid()
      OR email = (auth.jwt() ->> 'email')::text
    )
  );

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);

-- =============================================
-- 7. REVIEWS TABLE
-- =============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  is_published BOOLEAN DEFAULT false,
  admin_response TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(booking_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published reviews are publicly readable" ON reviews;
DROP POLICY IF EXISTS "Users can insert reviews for their bookings" ON reviews;

CREATE POLICY "Published reviews are publicly readable"
  ON reviews FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can insert reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())
  );

CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_is_published ON reviews(is_published);

-- =============================================
-- 8. BOOKING_OPTIONS TABLE
-- =============================================
CREATE TABLE booking_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  option_type VARCHAR(100) NOT NULL,
  option_value TEXT NOT NULL,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 9. REFERRALS TABLE
-- =============================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referee_email VARCHAR(255) NOT NULL,
  referee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  reward_amount DECIMAL(10,2) DEFAULT 50.00,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 10. USER_CREDITS TABLE
-- =============================================
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  source VARCHAR(50) NOT NULL,
  description TEXT,
  expires_at TIMESTAMP,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 11. ADMINS TABLE
-- =============================================
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins are not accessible publicly" ON admins;

CREATE POLICY "Admins are not accessible publicly"
  ON admins FOR ALL
  USING (false);

INSERT INTO admins (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@voyage-mystere.fr',
  '$2a$10$GUo6ZUxLg4lG.g6e75m2vew2kBVLI5EQDt2mCkBdYHZA6GkLYKqZu',
  'Admin',
  'Voyage Mystère',
  'super_admin'
);

-- =============================================
-- 12. ADMIN_SESSIONS TABLE
-- =============================================
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin sessions are not accessible publicly" ON admin_sessions;

CREATE POLICY "Admin sessions are not accessible publicly"
  ON admin_sessions FOR ALL
  USING (false);

CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);

-- =============================================
-- TRIGGERS
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INDEX SUR BOOKINGS
-- =============================================

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);

-- ✅ TERMINÉ !
--
-- Vérification :
SELECT 'users' as table_name, COUNT(*) as rows FROM users
UNION ALL
SELECT 'destinations', COUNT(*) FROM destinations
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'admins', COUNT(*) FROM admins;

-- Résultat attendu :
-- users: 0
-- destinations: 3
-- bookings: 0
-- admins: 1
