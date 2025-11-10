-- =============================================
-- CORRECTION COMPLÈTE RLS + AUTO-CRÉATION PROFILS
-- =============================================
-- Ce script corrige :
-- 1. RLS manquant sur 4 tables
-- 2. Auto-création des profils utilisateurs via trigger
-- 3. Synchronisation des utilisateurs existants
-- =============================================

-- ========================================
-- PARTIE 1 : ACTIVER RLS SUR LES TABLES MANQUANTES
-- ========================================

-- 1. BOOKING_OPTIONS
ALTER TABLE booking_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view booking options for their bookings" ON booking_options;
DROP POLICY IF EXISTS "Anyone can insert booking options" ON booking_options;

CREATE POLICY "Users can view booking options for their bookings"
  ON booking_options FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE user_id = auth.uid()
      OR email = (auth.jwt() ->> 'email')::text
    )
  );

CREATE POLICY "Anyone can insert booking options"
  ON booking_options FOR INSERT
  WITH CHECK (true);

-- 2. REFERRALS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their referrals" ON referrals;
DROP POLICY IF EXISTS "Users can create referrals" ON referrals;

CREATE POLICY "Users can view their referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (
    referrer_id = auth.uid()
    OR referee_id = auth.uid()
    OR referee_email = (auth.jwt() ->> 'email')::text
  );

CREATE POLICY "Users can create referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (referrer_id = auth.uid());

-- 3. USER_CREDITS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own credits" ON user_credits;

CREATE POLICY "Users can view their own credits"
  ON user_credits FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 4. QUESTIONNAIRE_RESPONSES
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view questionnaire for their bookings" ON questionnaire_responses;
DROP POLICY IF EXISTS "Anyone can insert questionnaire responses" ON questionnaire_responses;

CREATE POLICY "Users can view questionnaire for their bookings"
  ON questionnaire_responses FOR SELECT
  TO authenticated
  USING (
    booking_id IN (
      SELECT id FROM bookings
      WHERE user_id = auth.uid()
      OR email = (auth.jwt() ->> 'email')::text
    )
  );

CREATE POLICY "Anyone can insert questionnaire responses"
  ON questionnaire_responses FOR INSERT
  TO public
  WITH CHECK (true);

-- ========================================
-- CORRECTION SUPPLÉMENTAIRE : BOOKINGS RLS
-- ========================================

-- Corriger la politique de création de réservations
-- pour permettre aux utilisateurs anonymes ET authentifiés
DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

-- ========================================
-- PARTIE 2 : TRIGGER AUTO-CRÉATION PROFIL UTILISATEUR
-- ========================================

-- Cette fonction crée automatiquement un profil dans public.users
-- chaque fois qu'un utilisateur s'inscrit dans auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Créer le trigger qui s'exécute après chaque inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========================================
-- PARTIE 3 : SYNCHRONISER LES UTILISATEURS EXISTANTS
-- ========================================

-- Créer les profils manquants pour les utilisateurs déjà inscrits
INSERT INTO public.users (id, email, first_name, last_name)
SELECT
  au.id,
  au.email,
  au.raw_user_meta_data->>'first_name' as first_name,
  au.raw_user_meta_data->>'last_name' as last_name
FROM auth.users au
WHERE au.id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- PARTIE 4 : SIMPLIFIER LA POLITIQUE RLS USERS
-- ========================================

-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Users can insert own profile during signup" ON users;

-- Créer une politique plus permissive pour le trigger
-- (Le trigger utilise SECURITY DEFINER donc il peut insérer)
-- On garde juste les politiques de lecture/modification
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
-- VÉRIFICATION FINALE
-- ========================================

-- Vérifier que tous les utilisateurs auth ont un profil
SELECT
  COUNT(DISTINCT au.id) as total_auth_users,
  COUNT(DISTINCT pu.id) as total_profile_users,
  COUNT(DISTINCT au.id) - COUNT(DISTINCT pu.id) as missing_profiles
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id;

-- Afficher les utilisateurs synchronisés
SELECT
  pu.email,
  pu.first_name,
  pu.last_name,
  pu.created_at
FROM public.users pu
ORDER BY pu.created_at DESC;

-- ✅ CORRECTIONS TERMINÉES !
--
-- Ce qui a été fait :
-- 1. ✅ RLS activé sur booking_options, referrals, user_credits, questionnaire_responses
-- 2. ✅ Trigger automatique créé pour les nouveaux utilisateurs
-- 3. ✅ Profils créés pour les utilisateurs existants
-- 4. ✅ Politique RLS simplifiée pour users
--
-- Maintenant :
-- - Les nouveaux utilisateurs auront automatiquement un profil dans public.users
-- - Les anciens utilisateurs ont été synchronisés
-- - Toutes les tables ont RLS activé ✅
