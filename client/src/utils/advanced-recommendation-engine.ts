import { Destination } from '../types/destination-types';

// Advanced recommendation types
interface RecommendationContext {
  currentDestination: Destination;
  currentTime: Date;
  userPreferences?: UserPreferences;
  weather?: WeatherData;
  previousVisits?: string[];
  currentItinerary?: string[];
}

interface UserPreferences {
  favoriteCategories?: string[];
  preferredDifficulty?: string;
  maxDriveTime?: number;
  groupSize?: number;
  budget?: 'low' | 'medium' | 'high';
  accessibility?: boolean;
  familyFriendly?: boolean;
}

interface WeatherData {
  temperature: number;
  condition: string;
  precipitation: number;
  windSpeed: number;
  visibility: number;
}

interface RecommendationResult {
  destination: Destination;
  score: number;
  primaryFactor: string;
  complementaryFactor: string;
  timeRelevance: number; // 0-1 score
  proximityFactor: number; // Distance in miles
  suggestedOrder: 'before' | 'after' | 'same-day';
  explanation: string;
}

// Advanced recommendation algorithm
export async function getSmartRecommendations(
  context: RecommendationContext,
  options: {
    limit?: number;
    maxDistance?: number;
    mustIncludeCategories?: string[];
    excludeCategories?: string[];
    timeWindow?: [Date, Date]; // Min and max times for recommendations
  }
): Promise<RecommendationResult[]> {
  // Get all potential destinations
  const currentLat = context.currentDestination.latitude ?? context.currentDestination.coordinates?.lat;
  const currentLng = context.currentDestination.longitude ?? context.currentDestination.coordinates?.lng;

  if (!currentLat || !currentLng) {
    return []; // Can't recommend without coordinates
  }

  const allDestinations = await fetchDestinations(
    currentLat,
    currentLng,
    options.maxDistance || 50
  );
  
  // Filter destinations
  const filteredDestinations = allDestinations.filter(dest =>
    // Exclude current destination
    dest.id !== context.currentDestination.id &&
    // Exclude previously visited if provided
    !(context.previousVisits?.includes(String(dest.id))) &&
    // Exclude destinations already in itinerary if provided
    !(context.currentItinerary?.includes(String(dest.id))) &&
    // Category filtering
    (options.mustIncludeCategories
      ? options.mustIncludeCategories.some(cat =>
          (dest.primaryCategory ?? dest.category) === cat || dest.subcategories?.includes(cat) || false
        )
      : true) &&
    (options.excludeCategories
      ? !options.excludeCategories.some(cat =>
          (dest.primaryCategory ?? dest.category) === cat || dest.subcategories?.includes(cat) || false
        )
      : true)
  );
  
  // Calculate scores for each destination
  const scoredDestinations: RecommendationResult[] = filteredDestinations.map(dest => {
    // Time complementary score (0-1)
    const timeComplementaryScore = calculateTimeComplementary(
      context.currentDestination, 
      dest,
      context.currentTime
    );
    
    // Proximity score (inversely proportional to distance)
    const destLat = dest.latitude ?? dest.coordinates?.lat;
    const destLng = dest.longitude ?? dest.coordinates?.lng;
    const distance = (currentLat && currentLng && destLat && destLng)
      ? calculateDistance(currentLat, currentLng, destLat, destLng)
      : 999; // Large distance if coordinates missing
    const proximityScore = 1 - Math.min(distance / (options.maxDistance || 50), 1);
    
    // Category complementary score (0-1)
    const categoryScore = calculateCategoryComplementary(
      context.currentDestination,
      dest,
      context.userPreferences
    );
    
    // Weather appropriateness (0-1)
    const weatherScore = calculateWeatherFit(
      dest,
      context.weather
    );
    
    // User preference match (0-1)
    const preferenceScore = calculatePreferenceMatch(
      dest,
      context.userPreferences
    );
    
    // Calculate final weighted score
    const finalScore = (
      (timeComplementaryScore * 0.3) +
      (proximityScore * 0.2) +
      (categoryScore * 0.2) +
      (weatherScore * 0.15) +
      (preferenceScore * 0.15)
    );
    
    // Determine primary factor
    const factors = [
      { name: 'time', score: timeComplementaryScore },
      { name: 'proximity', score: proximityScore },
      { name: 'category', score: categoryScore },
      { name: 'weather', score: weatherScore },
      { name: 'preference', score: preferenceScore }
    ].sort((a, b) => b.score - a.score);
    
    // Determine suggested order
    const suggestedOrder = determineSuggestedOrder(
      context.currentDestination,
      dest,
      context.currentTime
    );
    
    // Generate human-readable explanation
    const explanation = generateExplanation(
      dest,
      context.currentDestination,
      factors[0].name,
      factors[1].name,
      distance,
      suggestedOrder
    );
    
    return {
      destination: dest,
      score: finalScore,
      primaryFactor: factors[0].name,
      complementaryFactor: factors[1].name,
      timeRelevance: timeComplementaryScore,
      proximityFactor: distance,
      suggestedOrder,
      explanation
    };
  });
  
  // Sort by score and limit
  const sortedRecommendations = scoredDestinations
    .sort((a, b) => b.score - a.score)
    .slice(0, options.limit || 3);
  
  return sortedRecommendations;
}

// Helper function to determine if destinations are time-complementary
function calculateTimeComplementary(
  current: Destination,
  candidate: Destination,
  currentTime: Date
): number {
  const hour = currentTime.getHours();
  const isEvening = hour >= 17;
  const isMorning = hour <= 11;
  
  // Evening to morning transition score
  if (isEvening && candidate.best_time_of_day === 'morning') {
    return 0.9; // High score for "do this tomorrow morning" suggestions
  }

  // Morning to evening transition score
  if (isMorning && candidate.best_time_of_day === 'evening') {
    return 0.7; // Good score for planning ahead
  }

  // Ideal duration sequence (short → long or long → short)
  const currentDuration = current.time_needed_minutes ?? 60;
  const candidateDuration = candidate.time_needed_minutes ?? 60;
  
  // Prefer shorter activities after longer ones
  if (currentDuration > 120 && candidateDuration < 60) {
    return 0.8; // Wind down after a big activity
  }
  
  // Prefer longer, main activities after short ones
  if (currentDuration < 60 && candidateDuration > 120) {
    return 0.75; // Build up to main activity
  }
  
  // If both are outdoor and weather-dependent, lower the score
  if (current.is_weather_dependent && candidate.is_weather_dependent) {
    return 0.3; // Weather could impact both - diversify
  }
  
  // Indoor/outdoor diversity
  if (current.is_indoor !== candidate.is_indoor) {
    return 0.7; // Good to mix indoor/outdoor
  }
  
  return 0.5; // Default - neutral time compatibility
}

// Helper for category complementary calculation
function calculateCategoryComplementary(
  current: Destination,
  candidate: Destination,
  userPreferences?: UserPreferences
): number {
  const currentCat = current.primaryCategory ?? current.category;
  const candidateCat = candidate.primaryCategory ?? candidate.category;

  // Same primary category - not diverse enough
  if (currentCat === candidateCat) {
    return 0.3;
  }

  // Perfect category pairs (data-driven combinations)
  const perfectPairs: Record<string, string[]> = {
    'outdoor-adventure': ['food-drink', 'quick-escapes'],
    'cultural-heritage': ['food-drink', 'seasonal-events'],
    'food-drink': ['arts-entertainment', 'cultural-heritage'],
    'arts-entertainment': ['food-drink', 'quick-escapes'],
    'seasonal-events': ['cultural-heritage', 'food-drink'],
    'hidden-gems': ['outdoor-adventure', 'cultural-heritage'],
    'quick-escapes': ['food-drink', 'arts-entertainment'],
    'youth-family': ['food-drink', 'quick-escapes']
  };

  // Check if they form a perfect pair
  if (currentCat && candidateCat && perfectPairs[currentCat]?.includes(candidateCat)) {
    return 0.9;
  }

  // Check if they match user preferences
  if (candidateCat && userPreferences?.favoriteCategories?.includes(candidateCat)) {
    return 0.8;
  }
  
  // If they share at least one subcategory tag - somewhat related
  const currentTags = current.subcategories || [];
  const candidateTags = candidate.subcategories || [];
  const sharedTags = currentTags.filter(tag => candidateTags.includes(tag));
  
  if (sharedTags.length > 0) {
    return 0.6;
  }
  
  return 0.5; // Default - neutral category compatibility
}

// Function to determine suggested ordering
function determineSuggestedOrder(
  current: Destination,
  candidate: Destination,
  currentTime: Date
): 'before' | 'after' | 'same-day' {
  const hour = currentTime.getHours();
  const currentDuration = current.average_duration_minutes || 60;
  const minutesRemaining = (24 - hour) * 60 - currentDuration;
  
  // If candidate duration fits in remaining day
  if ((candidate.average_duration_minutes || 60) <= minutesRemaining) {
    return 'after';
  }
  
  // If early enough and candidate is shorter
  if (hour < 10 && (candidate.average_duration_minutes || 60) < currentDuration) {
    return 'before';
  }
  
  return 'same-day';
}

// Generate human-readable explanation
function generateExplanation(
  destination: Destination,
  currentDestination: Destination,
  primaryFactor: string,
  secondaryFactor: string,
  distance: number,
  suggestedOrder: 'before' | 'after' | 'same-day'
): string {
  const distanceText = distance < 1 
    ? 'Just steps away' 
    : `${Math.round(distance)} miles away`;
  
  let timeText = '';
  switch(suggestedOrder) {
    case 'before':
      timeText = 'Visit this before';
      break;
    case 'after':
      timeText = 'Great to visit after';
      break;
    case 'same-day':
      timeText = 'Pairs well with';
      break;
  }
  
  // Factor-based explanation
  let factorText = '';
  switch(primaryFactor) {
    case 'time':
      factorText = `Perfect timing to visit ${suggestedOrder} ${currentDestination.name}`;
      break;
    case 'proximity':
      factorText = `${distanceText} from ${currentDestination.name}`;
      break;
    case 'category':
      factorText = `${secondaryFactor === 'time' ? timeText : ''} for a complementary experience`;
      break;
    case 'weather':
      factorText = `Great ${destination.is_indoor ? 'indoor' : 'outdoor'} option to pair with ${currentDestination.name}`;
      break;
    case 'preference':
      factorText = 'Matches your interests';
      break;
  }
  
  return `${factorText}. ${timeText} ${currentDestination.name}.`;
}

// Calculate weather appropriateness
function calculateWeatherFit(
  destination: Destination, 
  currentWeather?: WeatherData
): number {
  if (!currentWeather) return 0.5; // Neutral if weather unknown
  
  // Simple weather appropriateness logic
  if (destination.is_indoor && ['rain', 'snow', 'storm'].includes(currentWeather.condition)) {
    return 1.0; // Indoor activities score high in bad weather
  }
  
  if (!destination.is_indoor && ['clear', 'partly-cloudy'].includes(currentWeather.condition)) {
    return 1.0; // Outdoor activities score high in good weather
  }
  
  // Water-based activities in hot weather
  if (destination.subcategories?.includes('water') && currentWeather.temperature > 80) {
    return 1.0;
  }
  
  // Winter activities in cold weather
  if (destination.subcategories?.includes('winter') && currentWeather.temperature < 40) {
    return 1.0;
  }
  
  return 0.5; // Default neutral score
}

// Calculate preference match
function calculatePreferenceMatch(
  destination: Destination,
  userPreferences?: UserPreferences
): number {
  if (!userPreferences) return 0.5;
  
  let score = 0.5;
  
  // Category preference
  if (userPreferences.favoriteCategories?.includes(destination.primaryCategory)) {
    score += 0.2;
  }
  
  // Difficulty preference
  if (userPreferences.preferredDifficulty && 
      destination.difficulty_level === userPreferences.preferredDifficulty) {
    score += 0.1;
  }
  
  // Drive time preference
  if (userPreferences.maxDriveTime && 
      destination.driveTime <= userPreferences.maxDriveTime) {
    score += 0.1;
  }
  
  // Family friendly preference
  if (userPreferences.familyFriendly && destination.family_friendly) {
    score += 0.1;
  }
  
  // Accessibility preference
  if (userPreferences.accessibility && destination.is_accessible) {
    score += 0.1;
  }
  
  return Math.min(score, 1.0);
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

// Fetch destinations from API/database
async function fetchDestinations(
  latitude: number, 
  longitude: number, 
  maxDistance: number
): Promise<Destination[]> {
  try {
    const response = await fetch(`/api/destinations?lat=${latitude}&lng=${longitude}&maxDistance=${maxDistance}`);
    const data = await response.json();
    return data.destinations || [];
  } catch (_error) {
    // console.error('Error fetching destinations:', error);
    return [];
  }
}

// Specialized recommendation functions for different use cases
export async function getLunchBreakRecommendations(
  currentDestination: Destination,
  currentTime: Date,
  maxDriveTime: number = 15
): Promise<RecommendationResult[]> {
  return getSmartRecommendations(
    { currentDestination, currentTime },
    {
      limit: 3,
      maxDistance: maxDriveTime,
      mustIncludeCategories: ['food-drink', 'quick-escapes'],
      excludeCategories: ['outdoor-adventure', 'backcountry-camping']
    }
  );
}

export async function getEveningRecommendations(
  currentDestination: Destination,
  currentTime: Date,
  maxDriveTime: number = 20
): Promise<RecommendationResult[]> {
  return getSmartRecommendations(
    { currentDestination, currentTime },
    {
      limit: 3,
      maxDistance: maxDriveTime,
      mustIncludeCategories: ['arts-entertainment', 'food-drink', 'nightlife'],
      excludeCategories: ['outdoor-adventure', 'hiking-trail']
    }
  );
}

export async function getWeekendRecommendations(
  currentDestination: Destination,
  currentTime: Date,
  maxDriveTime: number = 50
): Promise<RecommendationResult[]> {
  return getSmartRecommendations(
    { currentDestination, currentTime },
    {
      limit: 5,
      maxDistance: maxDriveTime,
      excludeCategories: ['quick-escapes', 'lunch-break']
    }
  );
}

export async function getFamilyRecommendations(
  currentDestination: Destination,
  currentTime: Date,
  maxDriveTime: number = 30
): Promise<RecommendationResult[]> {
  return getSmartRecommendations(
    { currentDestination, currentTime },
    {
      limit: 3,
      maxDistance: maxDriveTime,
      mustIncludeCategories: ['youth-family', 'food-drink'],
      excludeCategories: ['backcountry-camping', 'climbing-route']
    }
  );
}

// Export types for use in other modules
export type {
  RecommendationContext,
  RecommendationResult,
  UserPreferences,
  WeatherData
}; 