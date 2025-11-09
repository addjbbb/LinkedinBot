-- ============================================
-- MIGRATION: Update bookings table schema
-- ============================================
-- Run this in your Supabase SQL Editor to add missing columns
-- This script is safe to run multiple times (uses IF NOT EXISTS)
-- ============================================

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
