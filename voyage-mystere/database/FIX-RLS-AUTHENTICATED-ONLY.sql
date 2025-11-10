-- =============================================
-- RLS FINAL : RÉSERVATIONS POUR UTILISATEURS CONNECTÉS UNIQUEMENT
-- =============================================
-- Les utilisateurs DOIVENT être connectés pour réserver
-- =============================================

-- ========================================
-- NETTOYER ET RECRÉER LES POLITIQUES BOOKINGS
-- ========================================

ALTER TABLE bookings DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
DROP POLICY IF EXISTS "bookings_select_own" ON bookings;
DROP POLICY IF EXISTS "bookings_insert_own" ON bookings;
DROP POLICY IF EXISTS "bookings_update_own" ON bookings;

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- SELECT : l'utilisateur ne voit que ses réservations
CREATE POLICY "bookings_select_own"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- INSERT : l'utilisateur ne peut créer que pour lui-même
CREATE POLICY "bookings_insert_own"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE : l'utilisateur ne peut modifier que les siennes
CREATE POLICY "bookings_update_own"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ========================================
-- QUESTIONNAIRE_RESPONSES (liées aux bookings)
-- ========================================

ALTER TABLE questionnaire_responses DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view questionnaire for their bookings" ON questionnaire_responses;
DROP POLICY IF EXISTS "Anyone can insert questionnaire responses" ON questionnaire_responses;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questionnaire_select_own"
  ON questionnaire_responses FOR SELECT
  TO authenticated
  USING (booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid()));

CREATE POLICY "questionnaire_insert_own"
  ON questionnaire_responses FOR INSERT
  TO authenticated
  WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid()));

-- ========================================
-- BOOKING_OPTIONS (liées aux bookings)
-- ========================================

ALTER TABLE booking_options DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view booking options for their bookings" ON booking_options;
DROP POLICY IF EXISTS "Anyone can insert booking options" ON booking_options;
ALTER TABLE booking_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "booking_options_select_own"
  ON booking_options FOR SELECT
  TO authenticated
  USING (booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid()));

CREATE POLICY "booking_options_insert_own"
  ON booking_options FOR INSERT
  TO authenticated
  WITH CHECK (booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid()));

-- ========================================
-- VÉRIFICATION
-- ========================================

SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('bookings', 'questionnaire_responses', 'booking_options')
ORDER BY tablename, cmd;

-- ✅ CONFIGURATION TERMINÉE
--
-- Maintenant :
-- - Seuls les utilisateurs CONNECTÉS peuvent créer des réservations
-- - Chaque utilisateur ne peut créer/voir/modifier que SES propres réservations
-- - user_id doit toujours être égal à auth.uid()
