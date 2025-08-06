// SLCTrips Template System: Developer Handoff v2.0
// Comprehensive 9-Category, 78-Subcategory Framework
// PRIORITY: Subcategory > Name/Description Analysis > Default

export type DestinationTemplateType = 
  | 'outdoor-adventure'      // 🏞️ Primary content workhorse
  | 'food-drink'            // 🍽️ Revenue driver
  | 'cultural-heritage'     // 🏛️ Educational differentiation
  | 'youth-family'          // 🧸 Family market capture
  | 'arts-entertainment'    // 🎭 Evening/event coverage
  | 'movie-media'           // 🎬 Social media viral potential
  | 'hidden-gems'           // 💎 Premium content
  | 'seasonal-events'       // 🎆 Year-round engagement
  | 'quick-escapes';        // ⏱️ Local retention

interface Destination {
  name: string;
  description?: string;
  description_short?: string;
  description_long?: string;
  category: string;
  subcategory?: string;
  driveTime: number;
  county: string;
  region: string;
}

export function detectDestinationTemplate(destination: Destination): DestinationTemplateType {
  const name = destination.name.toLowerCase();
  const description = (destination.description || destination.description_short || destination.description_long || '').toLowerCase();
  const category = destination.category.toLowerCase();
  const subcategory = (destination.subcategory || '').toLowerCase();
  const driveTime = destination.driveTime || 0;

  // PRIORITY 1: SUBCATEGORY-BASED DETECTION (78 subcategories)
  if (subcategory) {
    // 🏞️ 1. OUTDOOR & ADVENTURE (14 subcategories)
    if (
      subcategory === 'day-hikes' ||
      subcategory === 'epic-trails' ||
      subcategory === 'hot-springs' ||
      subcategory === 'rock-climbing' ||
      subcategory === 'canyoneering' ||
      subcategory === 'winter-sports' ||
      subcategory === 'water-sports' ||
      subcategory === 'backcountry' ||
      subcategory === 'fishing' ||
      subcategory === 'mountain-biking' ||
      subcategory === 'off-roading' ||
      subcategory === 'stargazing' ||
      subcategory === 'wildlife-viewing' ||
      subcategory === 'photography-hotspots' ||
      // Legacy subcategories for backward compatibility
      subcategory === 'hiking' ||
      subcategory === 'camping' ||
      subcategory === 'boating' ||
      subcategory === 'swimming' ||
      subcategory === 'biking' ||
      subcategory === 'trail' ||
      subcategory === 'outdoor' ||
      subcategory === 'nature' ||
      subcategory === 'wildlife' ||
      subcategory === 'forest' ||
      subcategory === 'lake' ||
      subcategory === 'river' ||
      subcategory === 'mountain' ||
      subcategory === 'desert' ||
      subcategory === 'national-park' ||
      subcategory === 'state-park'
    ) {
      return 'outdoor-adventure';
    }

    // 🍽️ 2. FOOD & DRINK (12 subcategories)
    if (
      subcategory === 'craft-breweries' ||
      subcategory === 'local-distilleries' ||
      subcategory === 'farm-to-table' ||
      subcategory === 'fine-dining' ||
      subcategory === 'ethnic-international' ||
      subcategory === 'food-trucks' ||
      subcategory === 'coffee-roasters' ||
      subcategory === 'markets' ||
      subcategory === 'date-night-restaurants' ||
      subcategory === 'brunch-spots' ||
      subcategory === 'late-night-eats' ||
      subcategory === 'desserts' ||
      subcategory === 'wine-bars' ||
      // Legacy subcategories for backward compatibility
      subcategory === 'restaurant' ||
      subcategory === 'cafe' ||
      subcategory === 'coffee' ||
      subcategory === 'brewery' ||
      subcategory === 'bar' ||
      subcategory === 'pub' ||
      subcategory === 'diner' ||
      subcategory === 'bistro' ||
      subcategory === 'grill' ||
      subcategory === 'pizzeria' ||
      subcategory === 'bakery' ||
      subcategory === 'food' ||
      subcategory === 'dining' ||
      subcategory === 'cuisine'
    ) {
      return 'food-drink';
    }

    // 🏛️ 3. CULTURAL & HERITAGE (10 subcategories)
    if (
      subcategory === 'pioneer-history' ||
      subcategory === 'indigenous-sites' ||
      subcategory === 'ghost-towns' ||
      subcategory === 'historic-architecture' ||
      subcategory === 'museums' ||
      subcategory === 'local-folklore' ||
      subcategory === 'mining-history' ||
      subcategory === 'railroad-heritage' ||
      subcategory === 'religious-sites' ||
      subcategory === 'cemeteries-memorials' ||
      // Legacy subcategories for backward compatibility
      subcategory === 'gallery' ||
      subcategory === 'historic' ||
      subcategory === 'heritage' ||
      subcategory === 'cultural' ||
      subcategory === 'theater' ||
      subcategory === 'theatre' ||
      subcategory === 'opera' ||
      subcategory === 'symphony' ||
      subcategory === 'library' ||
      subcategory === 'monument' ||
      subcategory === 'memorial' ||
      subcategory === 'fort' ||
      subcategory === 'church' ||
      subcategory === 'cathedral' ||
      subcategory === 'temple' ||
      subcategory === 'art' ||
      subcategory === 'history'
    ) {
      return 'cultural-heritage';
    }

    // 🧸 4. YOUTH & FAMILY (10 subcategories)
    if (
      subcategory === 'playgrounds-parks' ||
      subcategory === 'discovery-centers' ||
      subcategory === 'adventure-parks' ||
      subcategory === 'water-parks' ||
      subcategory === 'mini-golf-arcades' ||
      subcategory === 'petting-zoos' ||
      subcategory === 'educational-experiences' ||
      subcategory === 'birthday-venues' ||
      subcategory === 'rainy-day-activities' ||
      subcategory === 'teen-hangout-spots' ||
      // Legacy subcategories for backward compatibility
      subcategory === 'playground' ||
      subcategory === 'park' ||
      subcategory === 'zoo' ||
      subcategory === 'aquarium' ||
      subcategory === 'family' ||
      subcategory === 'kids' ||
      subcategory === 'children' ||
      subcategory === 'fun' ||
      subcategory === 'play' ||
      subcategory === 'adventure' ||
      subcategory === 'discovery' ||
      subcategory === 'amusement'
    ) {
      return 'youth-family';
    }

    // 🎭 5. ARTS & ENTERTAINMENT (9 subcategories)
    if (
      subcategory === 'live-music-venues' ||
      subcategory === 'theater-performing-arts' ||
      subcategory === 'comedy-clubs' ||
      subcategory === 'art-galleries' ||
      subcategory === 'street-art' ||
      subcategory === 'festivals' ||
      subcategory === 'nightlife' ||
      subcategory === 'sports-games' ||
      subcategory === 'local-markets-fairs'
    ) {
      return 'arts-entertainment';
    }

    // 🎬 6. MOVIE & MEDIA (8 subcategories)
    if (
      subcategory === 'hollywood-filming-locations' ||
      subcategory === 'tv-show-sets' ||
      subcategory === 'documentary-subjects' ||
      subcategory === 'instagram-famous-spots' ||
      subcategory === 'tiktok-viral-locations' ||
      subcategory === 'youtube-creator-hangouts' ||
      subcategory === 'podcast-recording-spots' ||
      subcategory === 'book-literature-connections'
    ) {
      return 'movie-media';
    }

    // 💎 7. HIDDEN GEMS (8 subcategories)
    if (
      subcategory === 'local-secrets' ||
      subcategory === 'off-the-beaten-path' ||
      subcategory === 'insider-knowledge-only' ||
      subcategory === 'recently-discovered' ||
      subcategory === 'locals-only-spots' ||
      subcategory === 'underground-scenes' ||
      subcategory === 'forgotten-places' ||
      subcategory === 'quirky-unusual'
    ) {
      return 'hidden-gems';
    }

    // 🎆 8. SEASONAL & EVENTS (10 subcategories)
    if (
      subcategory === 'spring-wildflowers' ||
      subcategory === 'summer-festivals' ||
      subcategory === 'fall-foliage' ||
      subcategory === 'winter-wonderlands' ||
      subcategory === 'holiday-celebrations' ||
      subcategory === 'annual-traditions' ||
      subcategory === 'weather-dependent-activities' ||
      subcategory === 'limited-time-experiences' ||
      subcategory === 'harvest-agriculture' ||
      subcategory === 'migration-wildlife-seasons' ||
      // Legacy subcategories for backward compatibility
      subcategory === 'ski' ||
      subcategory === 'snowboard' ||
      subcategory === 'winter' ||
      subcategory === 'snow' ||
      subcategory === 'holiday' ||
      subcategory === 'christmas' ||
      subcategory === 'seasonal' ||
      subcategory === 'festival' ||
      subcategory === 'oktoberfest' ||
      subcategory === 'summer' ||
      subcategory === 'spring' ||
      subcategory === 'fall'
    ) {
      return 'seasonal-events';
    }

    // ⏱️ 9. QUICK ESCAPES (9 subcategories)
    if (
      subcategory === 'lunch-break-adventures' ||
      subcategory === 'after-work-spots' ||
      subcategory === 'morning-rituals' ||
      subcategory === 'sunset-chasers' ||
      subcategory === 'urban-oases' ||
      subcategory === '15-minute-escapes' ||
      subcategory === 'commute-detours' ||
      subcategory === 'last-minute-plans' ||
      subcategory === 'no-planning-required' ||
      // Legacy subcategories for backward compatibility
      subcategory === 'local' ||
      subcategory === 'neighborhood' ||
      subcategory === 'nearby' ||
      subcategory === 'quick' ||
      subcategory === 'easy' ||
      subcategory === 'convenient' ||
      subcategory === 'downtown' ||
      subcategory === 'urban'
    ) {
      return 'quick-escapes';
    }
  }

  // PRIORITY 2: NAME/DESCRIPTION ANALYSIS (fallback when subcategory is not available)
  // 🍽️ Food & Drink detection
  if (
    name.includes('restaurant') ||
    name.includes('cafe') ||
    name.includes('coffee') ||
    name.includes('brewery') ||
    name.includes('grill') ||
    name.includes('bistro') ||
    name.includes('bar') ||
    name.includes('tavern') ||
    name.includes('diner') ||
    name.includes('kitchen') ||
    name.includes('eatery') ||
    name.includes('food') ||
    name.includes('pizza') ||
    name.includes('burger') ||
    description.includes('restaurant') ||
    description.includes('dining') ||
    description.includes('cuisine') ||
    description.includes('menu') ||
    description.includes('food')
  ) {
    return 'food-drink';
  }

  // 🏛️ Cultural & Heritage detection
  if (
    name.includes('museum') ||
    name.includes('gallery') ||
    name.includes('historic') ||
    name.includes('heritage') ||
    name.includes('cultural') ||
    name.includes('center') ||
    name.includes('hall') ||
    name.includes('theater') ||
    name.includes('theatre') ||
    name.includes('opera') ||
    name.includes('symphony') ||
    name.includes('library') ||
    name.includes('monument') ||
    name.includes('memorial') ||
    name.includes('fort') ||
    name.includes('church') ||
    name.includes('cathedral') ||
    name.includes('temple') ||
    description.includes('history') ||
    description.includes('culture') ||
    description.includes('museum') ||
    description.includes('historic') ||
    description.includes('heritage') ||
    description.includes('exhibit')
  ) {
    return 'cultural-heritage';
  }

  // 🧸 Youth & Family detection
  if (
    name.includes('playground') ||
    name.includes('park') ||
    name.includes('zoo') ||
    name.includes('aquarium') ||
    name.includes('family') ||
    name.includes('kids') ||
    name.includes('children') ||
    name.includes('fun') ||
    name.includes('play') ||
    name.includes('adventure') ||
    name.includes('discovery') ||
    description.includes('family') ||
    description.includes('kids') ||
    description.includes('children') ||
    description.includes('playground') ||
    description.includes('family-friendly')
  ) {
    return 'youth-family';
  }

  // 🎆 Seasonal & Events detection
  if (
    name.includes('ski') ||
    name.includes('snowboard') ||
    name.includes('winter') ||
    name.includes('snow') ||
    name.includes('holiday') ||
    name.includes('christmas') ||
    name.includes('seasonal') ||
    name.includes('festival') ||
    name.includes('oktoberfest') ||
    description.includes('winter') ||
    description.includes('seasonal') ||
    description.includes('holiday') ||
    description.includes('festival') ||
    description.includes('ski') ||
    description.includes('snow')
  ) {
    return 'seasonal-events';
  }

  // 💎 Hidden Gems detection
  if (
    name.includes('secret') ||
    name.includes('hidden') ||
    name.includes('local') ||
    name.includes('insider') ||
    name.includes('underground') ||
    name.includes('quirky') ||
    name.includes('unusual') ||
    description.includes('secret') ||
    description.includes('hidden') ||
    description.includes('local') ||
    description.includes('insider') ||
    description.includes('underground')
  ) {
    return 'hidden-gems';
  }

  // 🎭 Arts & Entertainment detection
  if (
    name.includes('music') ||
    name.includes('theater') ||
    name.includes('comedy') ||
    name.includes('gallery') ||
    name.includes('art') ||
    name.includes('festival') ||
    name.includes('nightlife') ||
    name.includes('venue') ||
    description.includes('music') ||
    description.includes('art') ||
    description.includes('entertainment') ||
    description.includes('performance')
  ) {
    return 'arts-entertainment';
  }

  // 🎬 Movie & Media detection
  if (
    name.includes('filming') ||
    name.includes('movie') ||
    name.includes('tv') ||
    name.includes('instagram') ||
    name.includes('tiktok') ||
    name.includes('youtube') ||
    name.includes('podcast') ||
    name.includes('famous') ||
    description.includes('filming') ||
    description.includes('movie') ||
    description.includes('tv') ||
    description.includes('instagram') ||
    description.includes('viral')
  ) {
    return 'movie-media';
  }

  // ⏱️ Quick Escapes detection
  if (
    driveTime <= 90 || // 90 minutes or less
    category.includes('downtown') ||
    category.includes('nearby') ||
    name.includes('local') ||
    name.includes('neighborhood') ||
    name.includes('nearby') ||
    name.includes('quick') ||
    description.includes('quick') ||
    description.includes('easy') ||
    description.includes('convenient') ||
    description.includes('nearby')
  ) {
    return 'quick-escapes';
  }

  // 🏞️ Outdoor & Adventure - Default for outdoor activities, hiking, nature
  return 'outdoor-adventure';
}

// Helper function to get template display name
export function getTemplateDisplayName(templateType: DestinationTemplateType): string {
  const names: Record<DestinationTemplateType, string> = {
    'outdoor-adventure': '🏞️ Outdoor & Adventure',
    'food-drink': '🍽️ Food & Drink',
    'cultural-heritage': '🏛️ Cultural & Heritage',
    'youth-family': '🧸 Youth & Family',
    'arts-entertainment': '🎭 Arts & Entertainment',
    'movie-media': '🎬 Movie & Media',
    'hidden-gems': '💎 Hidden Gems',
    'seasonal-events': '🎆 Seasonal & Events',
    'quick-escapes': '⏱️ Quick Escapes'
  };
  return names[templateType];
}

// Helper function to get template colors using SLCTrips design tokens
export function getTemplateColors(templateType: DestinationTemplateType): {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
} {
  const colors: Record<DestinationTemplateType, { primary: string; secondary: string; accent: string; gradient: string }> = {
    'outdoor-adventure': {
      primary: '#0087c8', // Great Salt Blue
      secondary: '#1e90ff',
      accent: '#2e8b57', // Sea Green
      gradient: 'from-great-salt-blue to-blue-600'
    },
    'food-drink': {
      primary: '#b33c1a', // Canyon Red
      secondary: '#d4504c',
      accent: '#f4b441', // Pioneer Gold
      gradient: 'from-canyon-red to-red-600'
    },
    'cultural-heritage': {
      primary: '#6a1b9a', // Deep Purple
      secondary: '#8e24aa',
      accent: '#f4b441', // Pioneer Gold
      gradient: 'from-purple-700 to-purple-600'
    },
    'youth-family': {
      primary: '#ff9800', // Burnt Orange
      secondary: '#ffb74d',
      accent: '#4caf50', // Green
      gradient: 'from-orange-500 to-orange-600'
    },
    'arts-entertainment': {
      primary: '#e91e63', // Pink
      secondary: '#f06292',
      accent: '#f4b441', // Pioneer Gold
      gradient: 'from-pink-500 to-pink-600'
    },
    'movie-media': {
      primary: '#9c27b0', // Purple
      secondary: '#ba68c8',
      accent: '#f4b441', // Pioneer Gold
      gradient: 'from-purple-500 to-purple-600'
    },
    'hidden-gems': {
      primary: '#607d8b', // Blue Grey
      secondary: '#78909c',
      accent: '#f4b441', // Pioneer Gold
      gradient: 'from-blue-gray-500 to-blue-gray-600'
    },
    'seasonal-events': {
      primary: '#2196f3', // Blue
      secondary: '#42a5f5',
      accent: '#ffffff', // White
      gradient: 'from-blue-500 to-blue-600'
    },
    'quick-escapes': {
      primary: '#f4b441', // Pioneer Gold
      secondary: '#ffca28',
      accent: '#0087c8', // Great Salt Blue
      gradient: 'from-pioneer-gold to-yellow-500'
    }
  };
  return colors[templateType];
}

// Helper function to get subcategory count for each template
export function getSubcategoryCount(templateType: DestinationTemplateType): number {
  const counts: Record<DestinationTemplateType, number> = {
    'outdoor-adventure': 14,
    'food-drink': 12,
    'cultural-heritage': 10,
    'youth-family': 10,
    'arts-entertainment': 9,
    'movie-media': 8,
    'hidden-gems': 8,
    'seasonal-events': 10,
    'quick-escapes': 9
  };
  return counts[templateType];
}

// Helper function to get template strategic role
export function getTemplateStrategicRole(templateType: DestinationTemplateType): string {
  const roles: Record<DestinationTemplateType, string> = {
    'outdoor-adventure': 'Content workhorse and primary user acquisition driver',
    'food-drink': 'Primary revenue driver through partnerships and affiliate opportunities',
    'cultural-heritage': 'Educational content differentiation and cultural tourism appeal',
    'youth-family': 'Family market capture and repeat visitation driver',
    'arts-entertainment': 'Evening and event-based activity coverage',
    'movie-media': 'Social media engagement and viral content potential',
    'hidden-gems': 'Premium content differentiation and local community building',
    'seasonal-events': 'Timely content and repeat engagement throughout the year',
    'quick-escapes': 'Repeat visitor magnet and local user retention'
  };
  return roles[templateType];
}