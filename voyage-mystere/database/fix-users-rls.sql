-- =============================================
-- FIX USER REGISTRATION RLS POLICIES
-- =============================================
-- Ce script corrige les politiques RLS pour permettre
-- l'inscription des utilisateurs

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Enable RLS (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow users to insert their own profile during signup
-- Cette politique permet à un utilisateur nouvellement inscrit
-- de créer son profil dans la table users
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy 2: Allow users to view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Policy 3: Allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- ✅ RLS policies updated successfully!
--
-- Users can now:
-- 1. Create their profile during signup (INSERT their own row)
-- 2. View their own profile (SELECT)
-- 3. Update their own profile (UPDATE)
--
-- Test signup at: /auth/inscription
