-- ============================================
-- VOYAGE MYSTÈRE DATABASE SCHEMA
-- ============================================
-- PostgreSQL Schema for Supabase
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_number VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  num_guests INTEGER DEFAULT 2,
  total_price DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  destination_id UUID,
  special_requests TEXT,
  reveal_code VARCHAR(10),
  box_shipped_at TIMESTAMP WITH TIME ZONE,
  code_sent_at TIMESTAMP WITH TIME ZONE,
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_date ON bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_number ON bookings(booking_number);

-- ============================================
-- QUESTIONNAIRE RESPONSES
-- ============================================
CREATE TABLE IF NOT EXISTS questionnaire_responses (
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

CREATE INDEX IF NOT EXISTS idx_questionnaire_booking_id ON questionnaire_responses(booking_id);

-- ============================================
-- DESTINATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS destinations (
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

CREATE INDEX IF NOT EXISTS idx_destinations_theme ON destinations(theme);
CREATE INDEX IF NOT EXISTS idx_destinations_active ON destinations(is_active);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);

-- ============================================
-- AVAILABLE DATES
-- ============================================
CREATE TABLE IF NOT EXISTS available_dates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  theme VARCHAR(20) NOT NULL CHECK (theme IN ('romantique', 'nature', 'urbain')),
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  max_bookings INTEGER DEFAULT 10,
  current_bookings INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(theme, date)
);

CREATE INDEX IF NOT EXISTS idx_available_dates_theme_date ON available_dates(theme, date);
CREATE INDEX IF NOT EXISTS idx_available_dates_available ON available_dates(is_available);

-- ============================================
-- PAYMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
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

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_payment_intent ON payments(stripe_payment_intent_id);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
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

CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(is_published);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews(booking_id);

-- ============================================
-- BOOKING OPTIONS (for upgrades and add-ons)
-- ============================================
CREATE TABLE IF NOT EXISTS booking_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  option_type VARCHAR(50) NOT NULL, -- 'upgrade', 'champagne', 'photoshoot', 'basket'
  option_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_options_booking_id ON booking_options(booking_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate unique booking number
CREATE OR REPLACE FUNCTION generate_booking_number()
RETURNS VARCHAR AS $$
DECLARE
  new_number VARCHAR;
  year VARCHAR;
  month VARCHAR;
  random_part VARCHAR;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');
  month := TO_CHAR(NOW(), 'MM');
  random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  new_number := 'VM-' || year || '-' || month || '-' || random_part;
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate reveal code
CREATE OR REPLACE FUNCTION generate_reveal_code()
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR;
BEGIN
  code := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  RETURN code;
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

-- RLS Policies for public read access to destinations
CREATE POLICY "Public can view active destinations"
  ON destinations FOR SELECT
  USING (is_active = true);

-- RLS Policies for public read access to available dates
CREATE POLICY "Public can view available dates"
  ON available_dates FOR SELECT
  USING (is_available = true);

-- RLS Policies for public read access to published reviews
CREATE POLICY "Public can view published reviews"
  ON reviews FOR SELECT
  USING (is_published = true);

-- Users can read their own data (requires auth.uid())
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can read their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own questionnaire responses
CREATE POLICY "Users can view own questionnaire"
  ON questionnaire_responses FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- Users can read their own payments
CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings WHERE user_id = auth.uid()
    )
  );

-- Users can read their own reviews
CREATE POLICY "Users can view own reviews"
  ON reviews FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own reviews
CREATE POLICY "Users can create own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA (Optional - Example Destinations)
-- ============================================

INSERT INTO destinations (name, theme, region, description, accommodation_name, accommodation_type, is_active, min_price) VALUES
  ('Château de la Loire', 'romantique', 'Pays de la Loire', 'Un château romantique avec vue sur la Loire', 'Château Romantique', 'château', true, 890),
  ('Cabane dans les Arbres', 'nature', 'Vosges', 'Une cabane perchée au cœur de la forêt', 'Cabane Éco-Lodge', 'cabane', true, 750),
  ('Loft Urbain Paris', 'urbain', 'Île-de-France', 'Loft moderne au cœur de Paris avec rooftop', 'Boutique Hotel Paris', 'boutique', true, 820)
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS (Optional - Useful Queries)
-- ============================================

-- View for booking statistics
CREATE OR REPLACE VIEW booking_stats AS
SELECT
  theme,
  COUNT(*) as total_bookings,
  COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_bookings,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
  AVG(total_price) as avg_price,
  SUM(total_price) as total_revenue
FROM bookings
GROUP BY theme;

-- View for review statistics
CREATE OR REPLACE VIEW review_stats AS
SELECT
  AVG(rating) as average_rating,
  COUNT(*) as total_reviews,
  COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_reviews
FROM reviews
WHERE is_published = true;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE users IS 'User accounts';
COMMENT ON TABLE bookings IS 'Customer bookings with mystery destination';
COMMENT ON TABLE questionnaire_responses IS 'Personalization questionnaire answers';
COMMENT ON TABLE destinations IS 'Available mystery destinations';
COMMENT ON TABLE available_dates IS 'Date availability by theme';
COMMENT ON TABLE payments IS 'Payment transactions via Stripe';
COMMENT ON TABLE reviews IS 'Customer reviews and testimonials';
COMMENT ON TABLE booking_options IS 'Additional options added to bookings';

-- ============================================
-- END OF SCHEMA
-- ============================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Voyage Mystère database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Configure RLS policies for your auth setup';
  RAISE NOTICE '2. Add your destination data';
  RAISE NOTICE '3. Configure available dates';
  RAISE NOTICE '4. Test with your application';
END $$;
