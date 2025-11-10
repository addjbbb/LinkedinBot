-- =============================================
-- VOYAGE MYSTERE PREMIUM - COMPLETE DATABASE SETUP
-- =============================================
-- Version: 1.0
-- Description: Script complet pour créer toutes les tables de zéro
-- Exécuter ce script dans Supabase SQL Editor
-- =============================================

-- Enable UUID extension (required for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- CLEAN UP (Drop all tables if they exist)
-- =============================================
DROP TABLE IF EXISTS booking_options CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS user_credits CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS questionnaire_responses CASCADE;
DROP TABLE IF EXISTS available_dates CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_sessions CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

-- =============================================
-- 1. USERS TABLE (Customer Profiles)
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

-- RLS Policies for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own profile during signup"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

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

-- RLS: Destinations are public (anyone can read)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Destinations are publicly readable"
  ON destinations FOR SELECT
  USING (is_active = true);

-- Sample destinations
INSERT INTO destinations (name, theme, region, country, description, is_active) VALUES
  ('Château de la Loire', 'romantique', 'Centre-Val de Loire', 'France', 'Un château romantique au cœur de la vallée de la Loire', true),
  ('Cabane dans les Alpes', 'nature', 'Auvergne-Rhône-Alpes', 'France', 'Refuge paisible en pleine montagne', true),
  ('Loft parisien', 'urbain', 'Île-de-France', 'France', 'Appartement moderne au cœur de Paris', true);

-- =============================================
-- 3. BOOKINGS TABLE (Main reservations)
-- =============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'VM-' || TO_CHAR(NOW(), 'YYYY-MM-') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),

  -- User reference (null for guest bookings)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Booking details
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_guests INTEGER DEFAULT 2 CHECK (num_guests > 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'confirmed', 'cancelled', 'completed')),

  -- Guest information (for bookings without user_id)
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  postal_code VARCHAR(20),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'France',

  -- Additional info
  destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
  special_requests TEXT,
  upgrade VARCHAR(50), -- 'prestige' or null
  selected_options TEXT[], -- Array of option IDs ['champagne', 'photoshoot']

  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  stripe_payment_intent_id VARCHAR(255),

  -- Referral
  referral_code VARCHAR(50), -- Code de parrainage utilisé

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_email ON bookings(email);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);

-- RLS Policies for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create a booking (guest checkout)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Users can view their own bookings (by user_id or email)
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (
    auth.uid() = user_id
    OR
    (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  );

-- =============================================
-- 4. QUESTIONNAIRE_RESPONSES TABLE
-- =============================================
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  -- Questionnaire fields
  occasion VARCHAR(100),
  traveler_style TEXT[], -- Array: ['aventurier', 'contemplatif', 'gourmet']
  rhythm VARCHAR(50),
  budget VARCHAR(50),
  dietary_restrictions TEXT[], -- Array: ['vegetarien', 'sans_gluten']
  mobility VARCHAR(100),
  phobias TEXT[], -- Array: ['hauteur', 'eau']
  visited_regions TEXT[], -- Array: ['bretagne', 'normandie']
  max_distance INTEGER, -- En km
  transport_preference VARCHAR(50),
  accommodation_type VARCHAR(100),
  preferred_time VARCHAR(50),
  desired_experience TEXT,
  music_preference VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_questionnaire_booking_id ON questionnaire_responses(booking_id);

-- RLS
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert questionnaire responses"
  ON questionnaire_responses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their questionnaire responses"
  ON questionnaire_responses FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE user_id = auth.uid()
      OR (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );

-- =============================================
-- 5. AVAILABLE_DATES TABLE
-- =============================================
CREATE TABLE available_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 5,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(theme, date)
);

-- Index
CREATE INDEX idx_available_dates_theme_date ON available_dates(theme, date);

-- RLS
ALTER TABLE available_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Available dates are publicly readable"
  ON available_dates FOR SELECT
  USING (true);

-- =============================================
-- 6. PAYMENTS TABLE
-- =============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  payment_method VARCHAR(50), -- 'card', 'sepa', etc.
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_charge_id VARCHAR(255),
  error_message TEXT,
  metadata JSONB, -- Additional payment data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);

-- RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE user_id = auth.uid()
      OR (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );

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

-- Index
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
CREATE INDEX idx_reviews_is_published ON reviews(is_published);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published reviews are publicly readable"
  ON reviews FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can insert reviews for their bookings"
  ON reviews FOR INSERT
  WITH CHECK (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own reviews"
  ON reviews FOR SELECT
  USING (user_id = auth.uid());

-- =============================================
-- 8. BOOKING_OPTIONS TABLE
-- =============================================
CREATE TABLE booking_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  option_id VARCHAR(50) NOT NULL, -- 'champagne', 'photoshoot', 'basket'
  option_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_booking_options_booking_id ON booking_options(booking_id);

-- RLS
ALTER TABLE booking_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their booking options"
  ON booking_options FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE user_id = auth.uid()
      OR (auth.uid() IS NOT NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
    )
  );

-- =============================================
-- 9. REFERRALS TABLE (Parrainage)
-- =============================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Le parrain
  referral_code VARCHAR(50) UNIQUE NOT NULL, -- Code unique du parrain
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Le filleul
  referred_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL, -- Réservation du filleul
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  reward_amount DECIMAL(10,2) DEFAULT 50.00, -- Montant de la récompense
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Index
CREATE INDEX idx_referrals_user_id ON referrals(user_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_referred_user ON referrals(referred_user_id);

-- RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals"
  ON referrals FOR SELECT
  USING (user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Users can create their referral code"
  ON referrals FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =============================================
-- 10. USER_CREDITS TABLE
-- =============================================
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  source VARCHAR(50) NOT NULL, -- 'referral', 'promo', 'compensation'
  source_id UUID, -- ID de la source (referral_id par exemple)
  is_used BOOLEAN DEFAULT false,
  used_on_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  expires_at TIMESTAMP, -- Expiration dans 2 ans par exemple
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- Index
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_user_credits_is_used ON user_credits(is_used);

-- RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  USING (user_id = auth.uid());

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

-- RLS: Admins are NEVER accessible via public client
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins are not accessible publicly"
  ON admins FOR ALL
  USING (false);

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

-- Indexes
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_admin_id ON admin_sessions(admin_id);

-- RLS: Admin sessions are NEVER accessible via public client
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin sessions are not accessible publicly"
  ON admin_sessions FOR ALL
  USING (false);

-- =============================================
-- DEFAULT ADMIN ACCOUNT
-- =============================================
-- Password: admin123 (CHANGE IN PRODUCTION!)
-- Hash: bcrypt with 10 rounds
INSERT INTO admins (email, password_hash, first_name, last_name, role)
VALUES (
  'admin@voyage-mystere.fr',
  '$2a$10$GUo6ZUxLg4lG.g6e75m2vew2kBVLI5EQDt2mCkBdYHZA6GkLYKqZu',
  'Admin',
  'Voyage Mystère',
  'super_admin'
);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ✅ DATABASE SETUP COMPLETE!
-- =============================================
--
-- Tables created:
-- 1. users (customer profiles with Supabase Auth)
-- 2. destinations (available destinations)
-- 3. bookings (main reservations table)
-- 4. questionnaire_responses (personalization)
-- 5. available_dates (date availability)
-- 6. payments (payment tracking)
-- 7. reviews (customer reviews)
-- 8. booking_options (additional options)
-- 9. referrals (referral system)
-- 10. user_credits (customer credits)
-- 11. admins (admin accounts)
-- 12. admin_sessions (admin authentication)
--
-- RLS Policies: ✅ Configured for all tables
-- Indexes: ✅ Created for performance
-- Triggers: ✅ Auto-update timestamps
-- Sample Data: ✅ 3 destinations + 1 admin
--
-- Default Admin Credentials:
-- Email: admin@voyage-mystere.fr
-- Password: admin123
-- ⚠️ CHANGE THIS IN PRODUCTION!
--
-- Next steps:
-- 1. Configure Supabase Auth email templates
-- 2. Add Stripe webhook endpoint
-- 3. Configure environment variables
-- 4. Test user signup and booking flow
-- =============================================
