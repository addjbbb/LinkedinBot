-- ============================================
-- ADD REFERRALS TABLE FOR PARRAINAGE SYSTEM
-- ============================================
-- Run this AFTER RESET-COMPLET.sql
-- ============================================

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  credit_amount DECIMAL(10,2) DEFAULT 50.00,
  credit_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_referrals_user_id ON referrals(user_id);
CREATE INDEX idx_referrals_code ON referrals(referral_code);
CREATE INDEX idx_referrals_status ON referrals(status);

-- User credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  source VARCHAR(50) NOT NULL, -- 'referral', 'promo', 'refund', etc.
  reference_id UUID, -- referral_id, booking_id, etc.
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  used_booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_user_credits_is_used ON user_credits(is_used);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_first_name VARCHAR, user_last_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  code VARCHAR;
  counter INTEGER := 0;
  year VARCHAR;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');

  -- Try to generate unique code based on name + year
  LOOP
    IF counter = 0 THEN
      code := UPPER(SUBSTRING(user_first_name FROM 1 FOR 4)) || year;
    ELSE
      code := UPPER(SUBSTRING(user_first_name FROM 1 FOR 4)) || year || counter::TEXT;
    END IF;

    -- Check if code exists
    EXIT WHEN NOT EXISTS (SELECT 1 FROM referrals WHERE referral_code = code);
    counter := counter + 1;

    -- Safety check
    IF counter > 99 THEN
      code := UPPER(SUBSTRING(user_first_name FROM 1 FOR 2)) || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
      EXIT;
    END IF;
  END LOOP;

  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies for referrals
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own referrals"
  ON referrals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_credits
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits"
  ON user_credits FOR SELECT
  USING (auth.uid() = user_id);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Referrals system created successfully!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created: referrals, user_credits';
  RAISE NOTICE 'Function: generate_referral_code';
  RAISE NOTICE 'RLS policies configured';
  RAISE NOTICE '========================================';
END $$;
