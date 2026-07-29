-- Update existing properties with real image URLs
UPDATE properties SET 
  images = ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop'],
  broker_photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
WHERE title = 'Prime Residential Land in Bole';

UPDATE properties SET 
  images = ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'],
  broker_photo = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
WHERE title = 'Commercial Land in Kazanchis';

UPDATE properties SET 
  images = ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  broker_photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
WHERE title = 'Agricultural Land in Bishoftu';

-- Update brokers with real image URLs
UPDATE brokers SET 
  profile_photo = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'
WHERE email = 'john@example.com';

UPDATE brokers SET 
  profile_photo = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'
WHERE email = 'jane@example.com';
