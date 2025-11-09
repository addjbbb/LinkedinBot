-- ============================================
-- VOYAGE MYSTÈRE SEED DATA
-- ============================================
-- Sample data for testing and development
-- ============================================

-- ============================================
-- DESTINATIONS
-- ============================================

INSERT INTO destinations (name, theme, region, country, description, accommodation_name, accommodation_type, activities, min_price, max_capacity, is_active) VALUES
  -- Romantique destinations
  (
    'Château Renaissance en Vallée de la Loire',
    'romantique',
    'Pays de la Loire',
    'France',
    'Un château du XVIe siècle au cœur de la vallée de la Loire, entouré de jardins à la française.',
    'Château de Beauregard',
    'château',
    ARRAY['Visite guidée du château', 'Dîner gastronomique aux chandelles', 'Spa privatisé', 'Balade dans les jardins'],
    890,
    8,
    true
  ),
  (
    'Villa Provençale avec Vue Mer',
    'romantique',
    'Provence-Alpes-Côte d''Azur',
    'France',
    'Villa d''exception avec piscine privée et vue panoramique sur la Méditerranée.',
    'Villa Azure',
    'villa',
    ARRAY['Massage en duo', 'Dîner privé par un chef', 'Excursion en yacht', 'Dégustation de vins'],
    1090,
    6,
    true
  ),

  -- Nature destinations
  (
    'Cabane Perchée dans les Vosges',
    'nature',
    'Grand Est',
    'France',
    'Cabane écologique perchée à 12 mètres de hauteur, au cœur de la forêt vosgienne.',
    'Les Cabanes d''Alsace',
    'cabane',
    ARRAY['Randonnée guidée', 'Observation des étoiles', 'Parcours accrobranche', 'Petit-déjeuner dans la canopée'],
    750,
    10,
    true
  ),
  (
    'Refuge de Montagne dans les Alpes',
    'nature',
    'Auvergne-Rhône-Alpes',
    'France',
    'Refuge authentique accessible en randonnée, panorama exceptionnel sur le Mont Blanc.',
    'Refuge des Sommets',
    'refuge',
    ARRAY['Randonnée en haute montagne', 'Via ferrata', 'Soirée contes montagnards', 'Lever de soleil au sommet'],
    850,
    12,
    true
  ),

  -- Urbain destinations
  (
    'Loft Design à Lyon',
    'urbain',
    'Auvergne-Rhône-Alpes',
    'France',
    'Loft contemporain dans le quartier de la Confluence, rooftop avec vue sur les deux fleuves.',
    'Hotel MOB Lyon',
    'boutique',
    ARRAY['Food tour des bouchons lyonnais', 'Visite street art guidée', 'Atelier cuisine avec chef', 'Soirée bar à cocktails'],
    820,
    15,
    true
  ),
  (
    'Appartement Haussmannien à Paris',
    'urbain',
    'Île-de-France',
    'France',
    'Appartement d''époque rénové dans le Marais, avec accès à des expériences parisiennes secrètes.',
    'Le Secret Parisien',
    'appartement',
    ARRAY['Visite musée privée', 'Cours de pâtisserie française', 'Soirée cabaret', 'Tour gastronomique'],
    950,
    10,
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- AVAILABLE DATES (Next 6 months)
-- ============================================

-- Generate available dates for each theme for the next 6 months (excluding Mondays and Tuesdays)
DO $$
DECLARE
  current_date DATE := CURRENT_DATE;
  end_date DATE := CURRENT_DATE + INTERVAL '6 months';
  theme_name VARCHAR;
BEGIN
  FOREACH theme_name IN ARRAY ARRAY['romantique', 'nature', 'urbain']
  LOOP
    WHILE current_date <= end_date LOOP
      -- Skip Mondays (1) and Tuesdays (2)
      IF EXTRACT(DOW FROM current_date) NOT IN (1, 2) THEN
        INSERT INTO available_dates (theme, date, is_available, max_bookings, current_bookings)
        VALUES (theme_name, current_date, true, 10, 0)
        ON CONFLICT (theme, date) DO NOTHING;
      END IF;
      current_date := current_date + INTERVAL '1 day';
    END LOOP;
    current_date := CURRENT_DATE; -- Reset for next theme
  END LOOP;
END $$;

-- ============================================
-- SAMPLE USERS (for testing)
-- ============================================

INSERT INTO users (email, first_name, last_name, phone) VALUES
  ('test@example.com', 'Jean', 'Dupont', '0612345678'),
  ('marie@example.com', 'Marie', 'Martin', '0623456789'),
  ('sophie@example.com', 'Sophie', 'Bernard', '0634567890')
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- SAMPLE BOOKINGS (for testing)
-- ============================================

-- Insert a sample completed booking with review
DO $$
DECLARE
  user_id UUID;
  booking_id UUID;
  destination_id UUID;
BEGIN
  -- Get test user
  SELECT id INTO user_id FROM users WHERE email = 'test@example.com' LIMIT 1;

  -- Get a destination
  SELECT id INTO destination_id FROM destinations WHERE theme = 'romantique' LIMIT 1;

  -- Create a completed booking
  INSERT INTO bookings (
    booking_number,
    user_id,
    theme,
    start_date,
    end_date,
    num_guests,
    total_price,
    status,
    destination_id,
    reveal_code,
    box_shipped_at,
    code_sent_at
  ) VALUES (
    generate_booking_number(),
    user_id,
    'romantique',
    CURRENT_DATE - INTERVAL '30 days',
    CURRENT_DATE - INTERVAL '28 days',
    2,
    890.00,
    'completed',
    destination_id,
    generate_reveal_code(),
    CURRENT_DATE - INTERVAL '40 days',
    CURRENT_DATE - INTERVAL '32 days'
  ) RETURNING id INTO booking_id;

  -- Add a review
  INSERT INTO reviews (
    booking_id,
    user_id,
    rating,
    title,
    comment,
    destination_revealed,
    is_published
  ) VALUES (
    booking_id,
    user_id,
    5,
    'Une expérience magique !',
    'Le mystère était parfaitement maintenu jusqu''au bout. La destination était magnifique et tout était parfaitement organisé. Nous avons adoré chaque instant !',
    'Château Renaissance en Vallée de la Loire',
    true
  );
END $$;

-- ============================================
-- SAMPLE PUBLISHED REVIEWS (for testimonials page)
-- ============================================

DO $$
DECLARE
  user_id UUID;
BEGIN
  SELECT id INTO user_id FROM users WHERE email = 'marie@example.com' LIMIT 1;

  INSERT INTO reviews (user_id, rating, title, comment, destination_revealed, is_published, created_at) VALUES
    (
      user_id,
      5,
      'Week-end inoubliable',
      'Le concept du voyage mystère est génial ! Nous avons été surpris jusqu''à la fin. L''organisation était impeccable, l''hébergement de qualité, et les activités parfaitement choisies.',
      'Villa Provençale avec Vue Mer',
      true,
      NOW() - INTERVAL '15 days'
    ),
    (
      user_id,
      4,
      'Super expérience',
      'Très belle surprise pour notre anniversaire de mariage. La destination était magnifique et correspondait parfaitement à nos attentes. Seul petit bémol : le temps pluvieux !',
      'Cabane Perchée dans les Vosges',
      true,
      NOW() - INTERVAL '45 days'
    );
END $$;

-- ============================================
-- ANALYTICS DATA
-- ============================================

-- You can add more sample data here for analytics/reporting

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Count destinations by theme
SELECT theme, COUNT(*) as count FROM destinations GROUP BY theme;

-- Count available dates by theme
SELECT theme, COUNT(*) as available_days FROM available_dates WHERE is_available = true GROUP BY theme;

-- Show recent bookings
SELECT booking_number, theme, status, start_date FROM bookings ORDER BY created_at DESC LIMIT 5;

-- Show published reviews
SELECT rating, title FROM reviews WHERE is_published = true ORDER BY created_at DESC;

-- ============================================
-- END OF SEED DATA
-- ============================================

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✓ Seed data inserted successfully!';
  RAISE NOTICE '✓ Destinations: 6 (2 per theme)';
  RAISE NOTICE '✓ Available dates: Next 6 months';
  RAISE NOTICE '✓ Sample users: 3';
  RAISE NOTICE '✓ Sample bookings and reviews added';
  RAISE NOTICE '';
  RAISE NOTICE 'You can now test your application with this data!';
END $$;
