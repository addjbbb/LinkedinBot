-- Migration: Add destination_id to bookings table
-- Date: 2025-11-10
-- Description: Link bookings to destinations for automated assignment

-- Add destination_id column to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_destination_id ON bookings(destination_id);

-- Add comment
COMMENT ON COLUMN bookings.destination_id IS 'Assigned destination based on questionnaire matching algorithm';
