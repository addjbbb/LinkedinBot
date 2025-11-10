-- FIX-QUESTIONNAIRE-SCHEMA.sql
-- Correction du schéma de la table questionnaire_responses pour correspondre à l'API

-- Étape 1: Supprimer l'ancienne table
DROP TABLE IF EXISTS questionnaire_responses CASCADE;

-- Étape 2: Recréer la table avec le bon schéma
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,

  -- Champs du questionnaire
  occasion VARCHAR(100),
  traveler_style TEXT[],
  rhythm VARCHAR(50),
  budget VARCHAR(50),
  dietary_restrictions TEXT[],
  mobility VARCHAR(50),
  phobias TEXT[],
  visited_regions TEXT[],
  max_distance INTEGER,
  transport_preference VARCHAR(50),
  accommodation_type VARCHAR(50),
  preferred_time VARCHAR(50),
  desired_experience TEXT,
  music_preference VARCHAR(100),

  created_at TIMESTAMP DEFAULT NOW()
);

-- Étape 3: Ajouter les index pour performance
CREATE INDEX idx_questionnaire_booking_id ON questionnaire_responses(booking_id);

-- Étape 4: RLS Policies (seulement pour utilisateurs authentifiés)
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;

-- L'utilisateur peut créer un questionnaire pour sa propre réservation
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

-- L'utilisateur peut voir son propre questionnaire
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

-- L'utilisateur peut modifier son propre questionnaire
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

-- Vérification
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'questionnaire_responses'
ORDER BY ordinal_position;

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'questionnaire_responses';
