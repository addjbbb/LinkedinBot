-- Migration: Add revelation_code to bookings table
-- Date: 2025-11-10
-- Description: Add field for mystery destination revelation codes sent 48h before departure

-- Add revelation_code column to bookings
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS revelation_code VARCHAR(20) UNIQUE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_revelation_code ON bookings(revelation_code);

-- Add index for efficient cron job queries (find bookings needing codes)
CREATE INDEX IF NOT EXISTS idx_bookings_start_date_status ON bookings(start_date, status)
WHERE status = 'confirmed';

-- Add comment
COMMENT ON COLUMN bookings.revelation_code IS 'Unique code sent 48h before trip to reveal destination';
