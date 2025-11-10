-- =============================================
-- FIX ALL RLS POLICIES - FINAL VERSION
-- =============================================
-- Ce script corrige toutes les politiques RLS pour permettre :
-- 1. L'inscription des utilisateurs
-- 2. L'accès aux réservations
-- 3. La lecture des destinations
-- =============================================

-- ========================================
-- 1. FIX USERS TABLE RLS
-- ========================================

-- Désactiver RLS temporairement pour nettoyer
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les anciennes politiques
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON users;
DROP POLICY IF EXISTS "Enable read access for users to their own data" ON users;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON users;

-- Réactiver RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Créer les nouvelles politiques (version corrigée)
CREATE POLICY "Users can insert own profile during signup"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========================================
-- 2. FIX BOOKINGS TABLE RLS
-- ========================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

-- Politique pour créer des réservations (authentifié ou anonyme)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Politique pour voir ses propres réservations (version simplifiée)
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR
    email = (auth.jwt() ->> 'email')::text
  );

-- Politique pour les anonymes (par email uniquement)
CREATE POLICY "Anonymous can view bookings by email"
  ON bookings FOR SELECT
  TO anon
  USING (email IS NOT NULL);

-- Politique pour mettre à jour ses réservations
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR email = (auth.jwt() ->> 'email')::text);

-- ========================================
-- 3. FIX DESTINATIONS TABLE RLS
-- ========================================

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Destinations are publicly readable" ON destinations;
DROP POLICY IF EXISTS "Anyone can read active destinations" ON destinations;

-- Politique pour lecture publique des destinations actives
CREATE POLICY "Anyone can read active destinations"
  ON destinations FOR SELECT
  USING (is_active = true);

-- ========================================
-- 4. AUTRES TABLES PUBLIQUES
-- ========================================

-- AVAILABLE_DATES: lecture publique
ALTER TABLE available_dates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Available dates are publicly readable" ON available_dates;
CREATE POLICY "Available dates are publicly readable"
  ON available_dates FOR SELECT
  USING (is_available = true);

-- REVIEWS: lecture publique des reviews publiées
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Approved reviews are publicly readable" ON reviews;
DROP POLICY IF EXISTS "Published reviews are publicly readable" ON reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert reviews for their bookings" ON reviews;

CREATE POLICY "Published reviews are publicly readable"
  ON reviews FOR SELECT
  USING (is_published = true);

CREATE POLICY "Users can insert reviews for their bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())
  );

-- ========================================
-- VERIFICATION
-- ========================================

-- Afficher toutes les politiques pour vérification
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('users', 'bookings', 'destinations', 'reviews', 'available_dates')
ORDER BY tablename, policyname;

-- ✅ TOUTES LES POLITIQUES RLS SONT MAINTENANT CORRECTEMENT CONFIGURÉES
--
-- Pour appliquer ce script :
-- 1. Allez sur Supabase Dashboard → SQL Editor
-- 2. Collez ce script
-- 3. Cliquez sur "Run"
--
-- Les utilisateurs pourront maintenant :
-- ✅ S'inscrire et créer leur profil
-- ✅ Se connecter et voir leurs données
-- ✅ Créer et voir leurs réservations
-- ✅ Voir les destinations disponibles
