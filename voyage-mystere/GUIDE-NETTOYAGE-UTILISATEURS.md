# 🧹 Guide de Nettoyage des Anciens Utilisateurs

## Problème Identifié

Vous pouvez vous connecter avec d'anciens utilisateurs car **Supabase sépare deux choses** :

1. **`auth.users`** - Table système pour l'authentification (ne se supprime PAS avec DROP TABLE)
2. **`public.users`** - Votre table personnalisée (se supprime avec DROP TABLE)

Quand vous avez recréé les tables, vous avez supprimé `public.users` mais pas `auth.users` !

---

## Solution Recommandée (Interface Supabase)

### Option 1 : Supprimer les utilisateurs manuellement (RECOMMANDÉ)

**C'est la méthode la plus sûre !**

1. Allez sur [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Cliquez sur **Authentication** dans le menu latéral
4. Cliquez sur **Users**
5. Pour chaque utilisateur :
   - Cliquez sur les 3 points `⋮` à droite
   - Cliquez sur **Delete user**
   - Confirmez la suppression

**Avantage** : Sûr, visuel, pas de risque d'erreur

---

### Option 2 : Script SQL Complet (AVANCÉ)

⚠️ **ATTENTION** : Ce script supprime **TOUT** !

**Fichier** : `database/RESET-COMPLET-AUTH-TABLES.sql`

**Ce qu'il fait** :
1. ✅ Supprime tous les utilisateurs de `auth.users`
2. ✅ Supprime toutes vos tables
3. ✅ Recrée toutes les tables avec les bonnes politiques RLS
4. ✅ Insère les 3 destinations par défaut
5. ✅ Crée l'admin par défaut

**Comment l'utiliser** :

1. Allez sur **Supabase Dashboard** → **SQL Editor**
2. Copiez **tout** le contenu de `database/RESET-COMPLET-AUTH-TABLES.sql`
3. Collez dans l'éditeur
4. Cliquez sur **Run**
5. Attendez la fin de l'exécution

**Résultat** :
- Base de données complètement vierge
- 0 utilisateurs
- 3 destinations
- 1 admin (admin@voyage-mystere.fr / admin123)

---

## Après le Nettoyage

### Testez la création d'un nouveau compte :

1. Allez sur `/auth/inscription`
2. Créez un compte avec :
   - Prénom : Test
   - Nom : Nouveau
   - Email : **nouveau@example.com** (un email que vous n'avez JAMAIS utilisé)
   - Mot de passe : Test123!

3. Vérifiez que ça fonctionne :
   - ✅ Pas d'erreur RLS
   - ✅ Redirection vers Mon Compte
   - ✅ Email visible dans Supabase Auth → Users

---

## Vérification dans Supabase

### 1. Vérifier les utilisateurs Auth

**Supabase Dashboard** → **Authentication** → **Users**

- Devrait être vide après le nettoyage
- Devrait afficher uniquement les nouveaux comptes après inscription

### 2. Vérifier la table users

**Supabase Dashboard** → **Table Editor** → **users**

- Devrait correspondre aux utilisateurs dans Auth
- Chaque utilisateur Auth doit avoir un profil dans `public.users`

---

## Pourquoi Ce Problème Arrive ?

```
┌─────────────────────────────────────────────┐
│         ARCHITECTURE SUPABASE               │
├─────────────────────────────────────────────┤
│                                             │
│  auth.users (Table système)                │
│  ├─ Gérée par Supabase Auth                │
│  ├─ Contient email, password, etc.         │
│  └─ NE SE SUPPRIME PAS avec DROP TABLE     │
│                                             │
│  public.users (Votre table)                │
│  ├─ Table que vous créez                   │
│  ├─ Contient first_name, last_name, etc.   │
│  ├─ Référence auth.users via foreign key   │
│  └─ SE SUPPRIME avec DROP TABLE ❌         │
│                                             │
└─────────────────────────────────────────────┘
```

**Quand vous faites `DROP TABLE users`** :
- ❌ `public.users` est supprimée
- ✅ `auth.users` reste intacte !

**Résultat** :
- Les anciens utilisateurs peuvent toujours se connecter
- Mais leur profil dans `public.users` n'existe plus
- Ça crée des incohérences

---

## Solution de Synchronisation

Si vous voulez garder les anciens utilisateurs Auth mais créer leurs profils manquants :

```sql
-- Créer des profils pour les utilisateurs Auth existants
INSERT INTO public.users (id, email, first_name, last_name)
SELECT
  id,
  email,
  raw_user_meta_data->>'first_name' as first_name,
  raw_user_meta_data->>'last_name' as last_name
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
```

---

## Recommandation Finale

Pour un environnement propre en développement :

1. ✅ Utilisez `RESET-COMPLET-AUTH-TABLES.sql`
2. ✅ Testez avec de nouveaux comptes
3. ✅ Vérifiez que tout fonctionne
4. ✅ Passez en production

Pour la production :
- ⚠️ NE JAMAIS supprimer auth.users !
- ✅ Toujours synchroniser `auth.users` ↔ `public.users`
- ✅ Utiliser des migrations au lieu de DROP TABLE

---

## Checklist Après Nettoyage

- [ ] Script SQL exécuté sans erreur
- [ ] Onglet Auth → Users est vide
- [ ] Table public.users est vide
- [ ] 3 destinations existent
- [ ] 1 admin existe (admin@voyage-mystere.fr)
- [ ] Nouvelle inscription fonctionne
- [ ] Le profil apparaît dans public.users
- [ ] Login/logout fonctionnent
- [ ] Dashboard admin accessible

---

**Une fois le nettoyage effectué, votre base sera parfaitement synchronisée et prête pour le lancement ! 🚀**
