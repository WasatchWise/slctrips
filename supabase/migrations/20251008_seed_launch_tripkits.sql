-- Seed 10 Launch TripKits for SLCTrips
-- TK-000 and TK-001 already exist, adding 8 more

-- TKE-001: Utah Brewery Trail
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  'Utah Brewery Trail',
  'utah-brewery-trail',
  'Craft beer adventures across the Beehive State',
  'A comprehensive guide to Utah''s thriving craft beer scene. Explore 18 breweries from Salt Lake City to Moab, featuring tasting notes, food pairings, brewery tours, and optimal driving routes. Discover flagship brews, limited releases, and the stories behind Utah''s unique brewing culture.',
  'Normally $14.99 - Launch Special $9.99',
  'paid',
  'food-and-drink',
  ARRAY['UT'],
  9.99,
  'plus',
  18,
  'active',
  true,
  'https://placehold.co/1200x630/F4B441/0D2A40?text=Utah+Brewery+Trail',
  ARRAY['18 craft breweries', 'Tasting notes & recommendations', 'Food pairing guides', 'Brewery tour schedules', 'Designated driver routes', 'Local beer history', 'Interactive brewery map', 'Printable tasting journal'],
  'Utah Brewery Trail TripKit - Craft Beer Guide',
  'Explore Utah''s best craft breweries with our curated TripKit. 18 breweries, tasting notes, food pairings, and optimized routes. Perfect for beer enthusiasts and social groups.',
  ARRAY['utah breweries', 'craft beer utah', 'brewery tour', 'salt lake breweries', 'utah beer guide', 'beer tourism'],
  ARRAY['Beer enthusiasts', 'Social groups', 'Tourists', 'Weekend adventurers']
);

-- TKE-002: 25 Under 25
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  '25 Under 25',
  '25-under-25',
  'Epic Utah adventures for $25 or less',
  'Budget-friendly adventures that prove you don''t need deep pockets to explore Utah. 25 incredible destinations with entrance fees under $25, including state parks, hidden trails, free museums, and stunning viewpoints. Perfect for students, families, and frugal travelers.',
  'Ultimate budget travel guide - $7.99',
  'paid',
  'budget-travel',
  ARRAY['UT'],
  7.99,
  'basic',
  25,
  'active',
  true,
  'https://placehold.co/1200x630/2F6B3C/FFFFFF?text=25+Under+25',
  ARRAY['25 destinations under $25', 'Total cost breakdown', 'Free parking locations', 'Budget-friendly food tips', 'Student discounts', 'Family-friendly options', 'Public transit accessibility', 'Money-saving hacks'],
  '25 Under 25 - Budget Utah Adventures TripKit',
  'Explore 25 amazing Utah destinations for $25 or less. Perfect for students, families, and budget travelers. State parks, trails, museums, and viewpoints that won''t break the bank.',
  ARRAY['budget travel utah', 'cheap utah adventures', 'free things to do utah', 'utah on a budget', 'affordable travel'],
  ARRAY['Students', 'Budget travelers', 'Families', 'Young adults']
);

-- TKE-003: Utah Golf Guide
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  'Utah Golf Guide',
  'utah-golf-guide',
  'Tee off at Utah''s most scenic courses',
  'The complete guide to golfing in Utah. 22 premier courses from championship layouts to hidden gem municipals. Includes course ratings, difficulty levels, signature holes, elevation challenges, booking tips, and the best times to play. Features desert courses, mountain layouts, and high-altitude play strategies.',
  'Complete course guide - $9.99',
  'paid',
  'golf',
  ARRAY['UT'],
  9.99,
  'plus',
  22,
  'active',
  true,
  'https://placehold.co/1200x630/2F6B3C/F4B441?text=Utah+Golf+Guide',
  ARRAY['22 premier golf courses', 'Course ratings & reviews', 'Signature hole guides', 'Elevation play strategies', 'Booking & tee time tips', 'High-altitude adjustments', 'Pro shop recommendations', 'Seasonal pricing guide'],
  'Utah Golf Guide TripKit - Best Golf Courses',
  'Discover Utah''s 22 best golf courses. Championship layouts, mountain courses, desert gems. Complete guide with ratings, tips, and booking info for every skill level.',
  ARRAY['utah golf', 'golf courses utah', 'park city golf', 'st george golf', 'utah golf vacation', 'mountain golf'],
  ARRAY['Golfers', 'Sports enthusiasts', 'Tourists', 'Retirees']
);

-- TKE-004: Coffee Culture • Utah
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  'Coffee Culture • Utah',
  'coffee-culture-utah',
  'Specialty coffee & local roasters worth the drive',
  'A caffeinated journey through Utah''s thriving specialty coffee scene. 15 independent coffee shops and roasters, from third-wave espresso bars to mountain-town hideaways. Includes roast profiles, signature drinks, pastry pairings, and the best laptop-friendly spots with strong WiFi.',
  'Coffee lover''s essential guide - $7.99',
  'paid',
  'food-and-drink',
  ARRAY['UT'],
  7.99,
  'basic',
  15,
  'active',
  true,
  'https://placehold.co/1200x630/0D2A40/F7F0E8?text=Coffee+Culture',
  ARRAY['15 specialty coffee shops', 'Roast profiles & tasting notes', 'Signature drink recommendations', 'Pastry & food pairings', 'Laptop-friendly ratings', 'WiFi & outlet availability', 'Instagram-worthy interiors', 'Local roaster profiles'],
  'Coffee Culture Utah TripKit - Best Coffee Shops',
  'Discover Utah''s best specialty coffee shops and roasters. 15 curated cafes with tasting notes, signature drinks, and laptop-friendly vibes. Perfect for coffee enthusiasts and remote workers.',
  ARRAY['utah coffee shops', 'specialty coffee utah', 'best coffee salt lake', 'coffee roasters utah', 'cafe guide'],
  ARRAY['Coffee enthusiasts', 'Remote workers', 'Digital nomads', 'Urban explorers']
);

-- TKS-001: Haunted Highway • Salt Lake to Hell
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  'Haunted Highway • Salt Lake to Hell',
  'haunted-highway',
  'A paranormal road trip through Utah''s darkest legends',
  'Drive the most haunted stretch of highway in the American West. 12 spine-chilling stops from Salt Lake City to the eerie ruins of Hell, featuring ghost towns, haunted hotels, murder sites, and unexplained phenomena. Includes historical accounts, paranormal investigation tips, and optimal night-time routes. Best experienced September-October.',
  'Seasonal special - Available Sept-Oct - $9.99',
  'seasonal',
  'paranormal',
  ARRAY['UT'],
  9.99,
  'plus',
  12,
  'active',
  true,
  'https://placehold.co/1200x630/B33C1A/0D2A40?text=Haunted+Highway',
  ARRAY['12 haunted locations', 'Historical murder & mystery accounts', 'Paranormal investigation tips', 'Night photography guides', 'Best time to visit (seasonal)', 'Ghost hunting equipment list', 'Safety protocols', 'Local legend interviews'],
  'Haunted Highway TripKit - Paranormal Road Trip Utah',
  'Drive Utah''s most haunted highway from Salt Lake to Hell. 12 paranormal stops, ghost towns, haunted hotels, and dark legends. Perfect for Halloween and thrill-seekers.',
  ARRAY['haunted utah', 'paranormal utah', 'ghost towns utah', 'halloween utah', 'spooky road trip', 'utah mysteries'],
  ARRAY['Paranormal enthusiasts', 'Halloween seekers', 'Thrill-seekers', 'History buffs']
);

-- TKS-002: Ski Utah • Complete
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  'Ski Utah • Complete',
  'ski-utah-complete',
  'Every resort, every run, one ultimate guide',
  'The definitive guide to skiing and snowboarding in Utah. All 15 major resorts from Park City to Brian Head, featuring trail maps, difficulty ratings, snow reports, lift ticket strategies, lodging recommendations, and the best après-ski spots. Includes powder hunting tips, beginner zones, and expert-only terrain guides.',
  'Complete resort guide - Premium $11.99',
  'seasonal',
  'winter-sports',
  ARRAY['UT'],
  11.99,
  'pro',
  15,
  'active',
  true,
  'https://placehold.co/1200x630/0085C7/FFFFFF?text=Ski+Utah+Complete',
  ARRAY['All 15 Utah ski resorts', 'Trail difficulty breakdowns', 'Lift ticket pricing strategies', 'Powder hunting guides', 'Beginner-friendly zones', 'Expert terrain maps', 'Lodging & accommodation tips', 'Après-ski recommendations', 'Equipment rental locations', 'Real-time snow report links'],
  'Ski Utah Complete TripKit - All Resorts Guide',
  'The ultimate Utah skiing guide. All 15 resorts, trail maps, powder tips, lift strategies, and lodging. Perfect for powder seekers, families, and ski vacationers. Winter 2025.',
  ARRAY['ski utah', 'utah ski resorts', 'park city skiing', 'powder skiing', 'utah snowboarding', 'ski vacation utah'],
  ARRAY['Skiers', 'Snowboarders', 'Winter tourists', 'Families', 'Powder seekers']
);

-- TK-002: Utah's Movie Madness
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  'Utah''s Movie Madness',
  'movie-madness',
  'Film locations where Hollywood met the Wild West',
  'Explore 30+ iconic filming locations across Utah. From classic Westerns to modern blockbusters, visit the exact spots where Butch Cassidy, Forrest Gump, Thelma & Louise, and dozens more were filmed. Includes scene comparisons, behind-the-scenes stories, and photo recreation guides.',
  'Normally $9.99 - Educational discount available',
  'free',
  'film-tourism',
  ARRAY['UT'],
  0,
  'free',
  32,
  'active',
  true,
  'https://placehold.co/1200x630/F4B441/0D2A40?text=Movie+Madness',
  ARRAY['30+ film locations', 'Scene-by-scene comparisons', 'Behind-the-scenes stories', 'Photo recreation guides', 'Film trivia & Easter eggs', 'Director commentary', 'Accessibility ratings', 'Best photo angles'],
  'Utah Movie Madness TripKit - Film Locations Guide',
  'Visit 30+ iconic movie filming locations in Utah. From Westerns to blockbusters - Butch Cassidy, Forrest Gump, Thelma & Louise, and more. Free educational guide.',
  ARRAY['utah film locations', 'movie locations utah', 'western movies utah', 'hollywood utah', 'film tourism'],
  ARRAY['Film enthusiasts', 'Photographers', 'Tourists', 'Families', 'Educators']
);

-- TK-003: Utah's Morbid Misdeeds
INSERT INTO tripkits (
  id, name, slug, tagline, description, value_proposition,
  collection_type, primary_theme, states_covered, price, tier,
  destination_count, status, featured, cover_image_url,
  features, meta_title, meta_description, keywords, target_audience
) VALUES (
  gen_random_uuid(),
  'Utah''s Morbid Misdeeds',
  'morbid-misdeeds',
  'True crime locations & dark history of the Beehive State',
  'A sobering journey through Utah''s criminal history. Visit 20+ sites of famous murders, notorious criminals, historical executions, and unsolved mysteries. Includes Ted Bundy''s hunting grounds, the Mountain Meadows Massacre, polygamy cult compounds, and modern cold cases. Respectfully curated with historical context and victim remembrance.',
  'True crime historical guide - $9.99',
  'paid',
  'true-crime',
  ARRAY['UT'],
  9.99,
  'plus',
  24,
  'active',
  false,
  'https://placehold.co/1200x630/0D2A40/B33C1A?text=Morbid+Misdeeds',
  ARRAY['24 true crime locations', 'Historical crime accounts', 'Victim memorials', 'Unsolved mysteries', 'Legal & ethical context', 'Respectful visitation guidelines', 'Archival photos & documents', 'Podcast episode recommendations'],
  'Utah Morbid Misdeeds TripKit - True Crime History',
  'Explore 24 true crime and dark history sites across Utah. Ted Bundy, Mountain Meadows, unsolved mysteries. Respectfully curated with historical context. For mature audiences.',
  ARRAY['utah true crime', 'ted bundy utah', 'utah murders', 'dark history utah', 'crime tourism', 'unsolved mysteries'],
  ARRAY['True crime enthusiasts', 'History buffs', 'Podcast listeners', 'Mature audiences']
);

-- Note: TK-000 (Rise of the Guardians) and TK-001 (Utah's Hidden Mysteries) already exist
-- This migration adds 8 new TripKits for a total of 10 active kits
