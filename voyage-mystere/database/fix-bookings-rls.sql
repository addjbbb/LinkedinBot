-- =============================================
-- FIX BOOKINGS RLS POLICY
-- =============================================
-- Fixes the "permission denied for table users" error
-- by simplifying the RLS policy

-- Drop existing policy
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;

-- Recreate with simplified logic that doesn't query auth.users
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (
    -- User can see bookings where they're the owner
    auth.uid() = user_id
    OR
    -- Or if the email matches their authenticated email
    -- Using auth.jwt() to get email from JWT token instead of querying auth.users
    (auth.uid() IS NOT NULL AND email = (auth.jwt() ->> 'email')::text)
  );

-- ✅ Bookings RLS policy fixed!
-- Users can now view their bookings without permission errors
