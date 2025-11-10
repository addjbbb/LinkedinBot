-- FIX-USER-TRIGGER-PHONE-REFERRAL.sql
-- Mise à jour du trigger pour inclure le téléphone et le code de parrainage

-- Supprimer et recréer la fonction du trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, phone, my_referral_code)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'my_referral_code'
  );
  RETURN NEW;
END;
$$;

-- Le trigger existe déjà, pas besoin de le recréer
-- Vérification
SELECT proname, prosrc
FROM pg_proc
WHERE proname = 'handle_new_user';

-- Afficher un user existant pour vérifier la structure
SELECT id, email, first_name, last_name, phone, my_referral_code, created_at
FROM users
LIMIT 1;
