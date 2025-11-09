-- ============================================
-- MIGRATION: Update bookings table schema
-- ============================================
-- Run this in your Supabase SQL Editor to add missing columns
-- This script is safe to run multiple times (uses IF NOT EXISTS)
-- ============================================

-- Add basic booking columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'booking_number') THEN
    ALTER TABLE bookings ADD COLUMN booking_number VARCHAR(50) UNIQUE NOT NULL DEFAULT 'VM-TEMP-' || gen_random_uuid()::text;
    RAISE NOTICE 'Added column: booking_number';
  ELSE
    RAISE NOTICE 'Column booking_number already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'theme') THEN
    ALTER TABLE bookings ADD COLUMN theme VARCHAR(20) NOT NULL DEFAULT 'romantique' CHECK (theme IN ('romantique', 'nature', 'urbain'));
    RAISE NOTICE 'Added column: theme';
  ELSE
    RAISE NOTICE 'Column theme already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'start_date') THEN
    ALTER TABLE bookings ADD COLUMN start_date DATE NOT NULL DEFAULT CURRENT_DATE;
    RAISE NOTICE 'Added column: start_date';
  ELSE
    RAISE NOTICE 'Column start_date already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'end_date') THEN
    ALTER TABLE bookings ADD COLUMN end_date DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '2 days';
    RAISE NOTICE 'Added column: end_date';
  ELSE
    RAISE NOTICE 'Column end_date already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'total_price') THEN
    ALTER TABLE bookings ADD COLUMN total_price DECIMAL(10,2) NOT NULL DEFAULT 0;
    RAISE NOTICE 'Added column: total_price';
  ELSE
    RAISE NOTICE 'Column total_price already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'status') THEN
    ALTER TABLE bookings ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
    RAISE NOTICE 'Added column: status';
  ELSE
    RAISE NOTICE 'Column status already exists';
  END IF;
END $$;

-- Add num_guests column if missing
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'num_guests') THEN
    ALTER TABLE bookings ADD COLUMN num_guests INTEGER DEFAULT 2;
    RAISE NOTICE 'Added column: num_guests';
  ELSE
    RAISE NOTICE 'Column num_guests already exists';
  END IF;
END $$;

-- Add guest booking info columns (for bookings without user accounts)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'email') THEN
    ALTER TABLE bookings ADD COLUMN email VARCHAR(255);
    RAISE NOTICE 'Added column: email';
  ELSE
    RAISE NOTICE 'Column email already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'first_name') THEN
    ALTER TABLE bookings ADD COLUMN first_name VARCHAR(100);
    RAISE NOTICE 'Added column: first_name';
  ELSE
    RAISE NOTICE 'Column first_name already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'last_name') THEN
    ALTER TABLE bookings ADD COLUMN last_name VARCHAR(100);
    RAISE NOTICE 'Added column: last_name';
  ELSE
    RAISE NOTICE 'Column last_name already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'phone') THEN
    ALTER TABLE bookings ADD COLUMN phone VARCHAR(20);
    RAISE NOTICE 'Added column: phone';
  ELSE
    RAISE NOTICE 'Column phone already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'address_line1') THEN
    ALTER TABLE bookings ADD COLUMN address_line1 VARCHAR(255);
    RAISE NOTICE 'Added column: address_line1';
  ELSE
    RAISE NOTICE 'Column address_line1 already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'address_line2') THEN
    ALTER TABLE bookings ADD COLUMN address_line2 VARCHAR(255);
    RAISE NOTICE 'Added column: address_line2';
  ELSE
    RAISE NOTICE 'Column address_line2 already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'postal_code') THEN
    ALTER TABLE bookings ADD COLUMN postal_code VARCHAR(20);
    RAISE NOTICE 'Added column: postal_code';
  ELSE
    RAISE NOTICE 'Column postal_code already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'city') THEN
    ALTER TABLE bookings ADD COLUMN city VARCHAR(100);
    RAISE NOTICE 'Added column: city';
  ELSE
    RAISE NOTICE 'Column city already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'country') THEN
    ALTER TABLE bookings ADD COLUMN country VARCHAR(100) DEFAULT 'France';
    RAISE NOTICE 'Added column: country';
  ELSE
    RAISE NOTICE 'Column country already exists';
  END IF;
END $$;

-- Add payment_status column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN
    ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
    RAISE NOTICE 'Added column: payment_status';
  ELSE
    RAISE NOTICE 'Column payment_status already exists';
  END IF;
END $$;

-- Add optional reference columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'user_id') THEN
    ALTER TABLE bookings ADD COLUMN user_id UUID;
    RAISE NOTICE 'Added column: user_id';
  ELSE
    RAISE NOTICE 'Column user_id already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'destination_id') THEN
    ALTER TABLE bookings ADD COLUMN destination_id UUID;
    RAISE NOTICE 'Added column: destination_id';
  ELSE
    RAISE NOTICE 'Column destination_id already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'special_requests') THEN
    ALTER TABLE bookings ADD COLUMN special_requests TEXT;
    RAISE NOTICE 'Added column: special_requests';
  ELSE
    RAISE NOTICE 'Column special_requests already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'reveal_code') THEN
    ALTER TABLE bookings ADD COLUMN reveal_code VARCHAR(10);
    RAISE NOTICE 'Added column: reveal_code';
  ELSE
    RAISE NOTICE 'Column reveal_code already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'box_shipped_at') THEN
    ALTER TABLE bookings ADD COLUMN box_shipped_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added column: box_shipped_at';
  ELSE
    RAISE NOTICE 'Column box_shipped_at already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'code_sent_at') THEN
    ALTER TABLE bookings ADD COLUMN code_sent_at TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added column: code_sent_at';
  ELSE
    RAISE NOTICE 'Column code_sent_at already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'stripe_session_id') THEN
    ALTER TABLE bookings ADD COLUMN stripe_session_id VARCHAR(255);
    RAISE NOTICE 'Added column: stripe_session_id';
  ELSE
    RAISE NOTICE 'Column stripe_session_id already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'stripe_payment_intent_id') THEN
    ALTER TABLE bookings ADD COLUMN stripe_payment_intent_id VARCHAR(255);
    RAISE NOTICE 'Added column: stripe_payment_intent_id';
  ELSE
    RAISE NOTICE 'Column stripe_payment_intent_id already exists';
  END IF;
END $$;

-- Add timestamp columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'created_at') THEN
    ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added column: created_at';
  ELSE
    RAISE NOTICE 'Column created_at already exists';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'bookings' AND column_name = 'updated_at') THEN
    ALTER TABLE bookings ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    RAISE NOTICE 'Added column: updated_at';
  ELSE
    RAISE NOTICE 'Column updated_at already exists';
  END IF;
END $$;

-- Update status constraint to include 'draft'
DO $$
BEGIN
  -- Drop old constraint if exists
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

  -- Add new constraint with 'draft' status
  ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
    CHECK (status IN ('draft', 'pending', 'confirmed', 'cancelled', 'completed'));

  RAISE NOTICE 'Updated status constraint to include draft';
END $$;

-- Add payment_status constraint
DO $$
BEGIN
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;

  ALTER TABLE bookings ADD CONSTRAINT bookings_payment_status_check
    CHECK (payment_status IN ('pending', 'paid', 'refunded'));

  RAISE NOTICE 'Added payment_status constraint';
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Your bookings table is now up to date.';
  RAISE NOTICE '========================================';
END $$;
