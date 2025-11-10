-- =============================================
-- FIX URGENT: RLS Bookings Insert Policy
-- =============================================
-- Corrige l'erreur "new row violates row-level security policy"
-- lors de la création de réservation
-- =============================================

-- Supprimer l'ancienne politique qui ne fonctionne pas
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

-- Créer la politique correcte qui permet VRAIMENT à tout le monde d'insérer
-- Sans TO clause = s'applique à tous les rôles (anon, authenticated, etc.)
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  WITH CHECK (true);

-- Vérifier la politique
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'bookings' AND cmd = 'INSERT';

-- ✅ CORRECTION APPLIQUÉE
-- La politique permet maintenant à TOUS les utilisateurs (authentifiés et anonymes)
-- de créer des réservations
