-- =============================================
-- FIX ADMIN PASSWORD
-- =============================================
-- Ce script met à jour le password de l'admin existant
-- avec le hash bcrypt correct pour "admin123"

-- Option 1: Mettre à jour le password de l'admin existant
UPDATE admins
SET password_hash = '$2a$10$GUo6ZUxLg4lG.g6e75m2vew2kBVLI5EQDt2mCkBdYHZA6GkLYKqZu'
WHERE email = 'admin@voyage-mystere.fr';

-- Option 2: Si vous préférez supprimer et recréer
-- DELETE FROM admins WHERE email = 'admin@voyage-mystere.fr';
--
-- INSERT INTO admins (email, password_hash, first_name, last_name, role)
-- VALUES (
--   'admin@voyage-mystere.fr',
--   '$2a$10$GUo6ZUxLg4lG.g6e75m2vew2kBVLI5EQDt2mCkBdYHZA6GkLYKqZu',
--   'Admin',
--   'Voyage Mystère',
--   'super_admin'
-- );

-- ✅ Password updated successfully!
-- You can now login with: admin@voyage-mystere.fr / admin123
