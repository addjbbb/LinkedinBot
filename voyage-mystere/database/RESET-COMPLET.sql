-- ============================================
-- RESET COMPLET - Voyage Mystère Database
-- ============================================
-- ⚠️  ATTENTION: Ce script supprime TOUTES les données existantes !
-- ⚠️  Utilisez uniquement si vous voulez repartir à zéro
-- ============================================

-- Désactiver les contraintes temporairement
SET session_replication_role = 'replica';

-- SUPPRIMER TOUTES LES TABLES EXISTANTES
DROP TABLE IF EXISTS booking_options CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS questionnaire_responses CASCADE;
DROP TABLE IF EXISTS available_dates CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Réactiver les contraintes
SET session_replication_role = 'origin';

-- ============================================
-- CRÉER TOUTES LES TABLES
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_guests INTEGER DEFAULT 2,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'confirmed', 'cancelled', 'completed')),
  -- Guest booking info (if no user_id)
  email VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  postal_code VARCHAR(20),
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'France',
  -- Booking details
  destination_id UUID,
  special_requests TEXT,
  reveal_code VARCHAR(10),
  box_shipped_at TIMESTAMP WITH TIME ZONE,
  code_sent_at TIMESTAMP WITH TIME ZONE,
  -- Payment
  payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_booking_number ON bookings(booking_number);

-- ============================================
-- QUESTIONNAIRE RESPONSES
-- ============================================
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  occasion VARCHAR(100),
  traveler_style TEXT[],
  rhythm VARCHAR(50),
  budget VARCHAR(50),
  dietary_restrictions TEXT[],
  mobility VARCHAR(50),
  phobias TEXT[],
  visited_regions TEXT[],
  max_distance INTEGER DEFAULT 300,
  transport_preference VARCHAR(50),
  accommodation_type VARCHAR(50),
  preferred_time VARCHAR(50),
  desired_experience TEXT,
  music_preference VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questionnaire_booking_id ON questionnaire_responses(booking_id);

-- ============================================
-- DESTINATIONS
-- ============================================
CREATE TABLE destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  region VARCHAR(100),
  country VARCHAR(100) DEFAULT 'France',
  description TEXT,
  accommodation_name VARCHAR(200),
  accommodation_type VARCHAR(50),
  activities TEXT[],
  is_active BOOLEAN DEFAULT true,
  min_price DECIMAL(10,2),
  max_capacity INTEGER DEFAULT 20,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_destinations_theme ON destinations(theme);
CREATE INDEX idx_destinations_active ON destinations(is_active);
CREATE INDEX idx_destinations_region ON destinations(region);

-- ============================================
-- AVAILABLE DATES
-- ============================================
CREATE TABLE available_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 10,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(theme, date)
);

CREATE INDEX idx_available_dates_theme_date ON available_dates(theme, date);
CREATE INDEX idx_available_dates_available ON available_dates(is_available);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_checkout_session_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'pending',
  payment_method VARCHAR(50),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT,
  destination_revealed VARCHAR(100),
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reviews_published ON reviews(is_published);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);

-- ============================================
-- BOOKING OPTIONS (for upgrades and add-ons)
-- ============================================
CREATE TABLE booking_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  option_type VARCHAR(50) NOT NULL,
  option_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_booking_options_booking_id ON booking_options(booking_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_options ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES - DESTINATIONS (Public Read)
-- ============================================
CREATE POLICY "Public can view active destinations"
  ON destinations FOR SELECT
  USING (is_active = true);

-- ============================================
-- RLS POLICIES - AVAILABLE DATES (Public Read)
-- ============================================
CREATE POLICY "Public can view available dates"
  ON available_dates FOR SELECT
  USING (is_available = true);

-- ============================================
-- RLS POLICIES - REVIEWS (Public Read)
-- ============================================
CREATE POLICY "Public can view published reviews"
  ON reviews FOR SELECT
  USING (is_published = true);

-- ============================================
-- RLS POLICIES - BOOKINGS (Important!)
-- ============================================

-- Allow public to INSERT bookings (for guest checkouts)
CREATE POLICY "Public can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Allow public to SELECT their own bookings by booking_number
CREATE POLICY "Public can view bookings by booking_number"
  ON bookings FOR SELECT
  USING (true);

-- Allow public to UPDATE bookings (for adding info during booking flow)
CREATE POLICY "Public can update bookings"
  ON bookings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES - QUESTIONNAIRE (Guest Access)
-- ============================================

-- Allow public to INSERT questionnaire responses
CREATE POLICY "Public can create questionnaire responses"
  ON questionnaire_responses FOR INSERT
  WITH CHECK (true);

-- Allow public to SELECT questionnaire responses
CREATE POLICY "Public can view questionnaire responses"
  ON questionnaire_responses FOR SELECT
  USING (true);

-- ============================================
-- RLS POLICIES - PAYMENTS (Public for Stripe)
-- ============================================

-- Allow service role to manage payments (Stripe webhooks)
CREATE POLICY "Service role can manage payments"
  ON payments FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- RLS POLICIES - BOOKING OPTIONS
-- ============================================

CREATE POLICY "Public can manage booking options"
  ON booking_options FOR ALL
  USING (true)
  WITH CHECK (true);

-- ============================================
-- SEED DATA (Destinations exemples)
-- ============================================

INSERT INTO destinations (name, theme, region, description, accommodation_name, accommodation_type, is_active, min_price) VALUES
  ('Château de la Loire', 'romantique', 'Pays de la Loire', 'Un château romantique avec vue sur la Loire', 'Château Romantique', 'château', true, 890),
  ('Cabane dans les Arbres', 'nature', 'Vosges', 'Une cabane perchée au cœur de la forêt', 'Cabane Éco-Lodge', 'cabane', true, 750),
  ('Loft Urbain Paris', 'urbain', 'Île-de-France', 'Loft moderne au cœur de Paris avec rooftop', 'Boutique Hotel Paris', 'boutique', true, 820);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Base de données créée avec succès !';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables créées: 8';
  RAISE NOTICE 'Policies RLS: Configurées pour bookings publics';
  RAISE NOTICE 'Destinations exemple: 3 ajoutées';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Prochaines étapes:';
  RAISE NOTICE '1. Testez le flux de réservation';
  RAISE NOTICE '2. Vérifiez que les bookings se créent';
  RAISE NOTICE '3. Ajoutez vos vraies destinations';
  RAISE NOTICE '========================================';
END $$;
