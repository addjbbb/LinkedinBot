-- FIX-RLS-QUICK.sql
-- Script rapide pour corriger les politiques RLS des tables bookings et questionnaire_responses
-- IMPORTANT : Exécutez ce script dans Supabase SQL Editor

-- ============================================================
-- 1. BOOKINGS - Politiques pour utilisateurs authentifiés
-- ============================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
DROP POLICY IF EXISTS "bookings_update_own" ON bookings;

-- Créer les nouvelles politiques
CREATE POLICY "bookings_insert_own"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_select_own"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bookings_update_own"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin peut tout voir/modifier
CREATE POLICY "bookings_admin_all"
  ON bookings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- ============================================================
-- 2. QUESTIONNAIRE_RESPONSES - Politiques pour utilisateurs authentifiés
-- ============================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Anyone can insert questionnaire responses" ON questionnaire_responses;
DROP POLICY IF EXISTS "Users can view questionnaire for their bookings" ON questionnaire_responses;
DROP POLICY IF EXISTS "questionnaire_insert_own" ON questionnaire_responses;
DROP POLICY IF EXISTS "questionnaire_select_own" ON questionnaire_responses;
DROP POLICY IF EXISTS "questionnaire_update_own" ON questionnaire_responses;
DROP POLICY IF EXISTS "questionnaire_admin_all" ON questionnaire_responses;

-- Créer les nouvelles politiques
CREATE POLICY "questionnaire_insert_own"
  ON questionnaire_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = questionnaire_responses.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "questionnaire_select_own"
  ON questionnaire_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = questionnaire_responses.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "questionnaire_update_own"
  ON questionnaire_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = questionnaire_responses.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Admin peut tout voir/modifier
CREATE POLICY "questionnaire_admin_all"
  ON questionnaire_responses FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- ============================================================
-- 3. BOOKING_OPTIONS - Politiques pour utilisateurs authentifiés
-- ============================================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "booking_options_insert_own" ON booking_options;
DROP POLICY IF EXISTS "booking_options_select_own" ON booking_options;
DROP POLICY IF EXISTS "booking_options_admin_all" ON booking_options;

-- Créer les nouvelles politiques
CREATE POLICY "booking_options_insert_own"
  ON booking_options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_options.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

CREATE POLICY "booking_options_select_own"
  ON booking_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings
      WHERE bookings.id = booking_options.booking_id
      AND bookings.user_id = auth.uid()
    )
  );

-- Admin peut tout voir/modifier
CREATE POLICY "booking_options_admin_all"
  ON booking_options FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE admins.id = auth.uid()
    )
  );

-- ============================================================
-- 4. VÉRIFICATION
-- ============================================================

-- Afficher les politiques pour bookings
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'bookings'
ORDER BY policyname;

-- Afficher les politiques pour questionnaire_responses
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'questionnaire_responses'
ORDER BY policyname;

-- Afficher les politiques pour booking_options
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'booking_options'
ORDER BY policyname;

-- ============================================================
-- FIN DU SCRIPT
-- ============================================================
-- Vous devriez maintenant voir 4 politiques pour bookings
-- Vous devriez maintenant voir 4 politiques pour questionnaire_responses
-- Vous devriez maintenant voir 3 politiques pour booking_options
