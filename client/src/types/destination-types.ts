/**
 * Unified Destination Types for SLCTrips
 * Resolves conflicts between different type definitions
 */

// Core destination interface that matches database structure
export interface Destination {
  // Core required fields (minimal set for runtime safety)
  id: number;
  name: string;

  // Core fields that should usually be present but may be missing
  external_id?: string;
  category?: string;
  drive_time?: number;
  county?: string;
  region?: string;

  // Location fields
  address?: string | null;
  address_full?: string;
  coordinates?: {
    lat: number;
    lng: number;
  } | null;
  latitude?: number; // Helper field for compatibility
  longitude?: number; // Helper field for compatibility

  // Category aliases for compatibility
  primaryCategory?: string; // Alias for category
  subcategory?: string;
  subcategories?: string[]; // Array version

  // Time/distance fields
  drive_time_text?: string | null;
  distance?: string | null;
  driveTime?: number; // Alias for drive_time
  drive_minutes?: number;
  drive_distance?: string;
  drive_duration?: string;

  // Description fields
  description?: string;
  description_short?: string;
  description_long?: string;
  essential_description?: string;

  // Image fields
  image_url?: string;
  images?: string[]; // Array of image URLs
  photo_url?: string;
  photos?: string[];
  photoUrl?: string; // legacy compatibility
  cover_photo_url?: string;
  cover_photo_alt_text?: string;
  media_gallery?: any[];

  // Contact & web fields
  phone?: string;
  destination_phone?: string;
  website?: string;
  destination_url?: string;
  reservation_url?: string;

  // Ratings & reviews
  rating?: number;
  google_rating?: number;
  google_rating_count?: number;
  reviews_count?: number;

  // Hours & timing
  hours?: string | any;
  holiday_schedule?: any;
  best_time_of_day?: string;
  recommended_arrival_time?: string;
  recommended_after_work_arrival?: string;
  time_needed_minutes?: number;
  prep_time_minutes?: number;

  // Pricing & tickets
  pricing?: Record<string, any> | null;
  price_range?: string;
  admission_details?: any;
  ticketing_available?: boolean;
  ticket_price?: string;
  vip_available?: boolean;
  vip_price?: string;
  green_fees?: any;
  is_free?: boolean;

  // Family & accessibility
  family_friendly?: boolean;
  family_amenities?: any[];
  family_itineraries?: any[];
  is_stroller_friendly?: boolean;
  has_changing_tables?: boolean;
  has_nursing_area?: boolean;
  has_restrooms?: boolean;
  has_water_fountains?: boolean;
  restroom_locations?: any[];
  min_age?: number;
  max_age?: number;
  educational_age_groups?: string[];
  kid_quotes?: string[];
  parent_tips?: string[];

  // Weather & season
  is_weather_dependent?: boolean;
  weather_condition?: string;
  weather_forecast?: any;
  weather_impact?: string;
  weather_notes_for_families?: string;
  current_weather?: string;
  current_temp?: number;
  best_seasons?: string[];
  worst_seasons?: string[];
  season?: string;
  season_start?: string;
  season_end?: string;
  seasonal_description?: string;
  seasonal_offerings?: any[];
  is_seasonal?: boolean;

  // Outdoor/activity specific
  difficulty_level?: string;
  trail_difficulty?: string;
  trail_distance?: string | number;
  trail_duration?: string;
  trail_elevation?: number;
  trail_features?: string[];
  elevation?: number;
  essential_gear?: string[];
  recommended_gear?: string[];
  recommended_group_size?: number;
  equipment_rental?: boolean;
  is_outdoor?: boolean;
  is_indoor?: boolean;

  // Golf specific
  course_type?: string;
  holes?: number;
  par?: number;
  yardage?: number;
  has_driving_range?: boolean;
  has_pro_shop?: boolean;
  has_golf_carts?: boolean;
  has_golf_lessons?: boolean;
  has_food_options?: boolean;
  golf_activities?: any[];
  golf_phone?: string;
  recommended_golf_gear?: string[];

  // Food/drink specific
  cuisine_type?: string;
  featured_items?: any[];
  dietary_options?: string[];
  allergen_info?: any;
  happy_hour?: boolean;
  happy_hour_specials?: any[];
  late_night_menu?: boolean;
  average_wait?: number;
  peak_times?: string[];
  beer_list?: any[];
  brewery_tours?: boolean;
  brewing_process?: any;
  farm_partners?: any[];

  // Arts/culture specific
  art_culture?: any;
  art_access?: any;
  art_age?: any;
  media_appearances?: any[];

  // Events
  upcoming_events?: Event[];
  celestial_events?: any[];
  crowd_calendar?: any;
  crowd_level?: string;

  // Outdoor adventure specific
  climbing_type?: string;
  climbing_grade?: string;
  canyon_depth?: number;
  canyon_width?: number;
  canyon_difficulty?: string;
  bolt_count?: number;
  ferrata_elevation?: number;
  ferrata_length?: number;
  ferrata_rating?: string;
  fishing_season?: string;
  fishing_license_required?: boolean;
  fishing_technique?: string;
  fishing_best_time?: string;
  fish_species?: string[];
  recommended_bait?: string;
  water_type?: string;
  water_temperature?: number;
  water_activities?: string[];
  water_available?: boolean;
  spring_temperature?: number;
  spring_depth?: number;
  spring_access?: string;
  snow_conditions?: any;
  snow_depth?: number;
  winter_activities?: string[];
  winter_season?: string;
  winter_temp?: number;
  bike_trail_type?: string;
  bike_technical_level?: string;
  bike_features?: string[];
  bike_elevation?: number;
  route_description?: string;
  route_height?: number;
  road_type?: string;
  viewpoints?: any[];
  wildlife_species?: string[];
  wildlife_season?: string;
  wildlife_best_time?: string;
  stargazing_best_time?: string;
  dark_sky_rating?: number;
  current_sunset_time?: string;
  visibility?: string;
  wind_speed?: number;
  wind_direction?: string;
  flash_flood_risk?: string;
  permit_required?: boolean;
  ranger_contact?: string;

  // Seasonal/nature specific
  current_blooms?: string[];
  bloom_percentage?: number;
  peak_percentage?: number;
  peak_dates?: string[];
  peak_color_forecast?: any;
  color_percentage?: number;

  // Camping/outdoor
  camping_capacity?: number;
  site_elevation?: number;
  shade_availability?: string;

  // Birthday/party specific
  birthday_packages?: any[];
  birthday_pricing?: any;
  birthday_capacity?: number;
  birthday_amenities?: any[];
  birthday_reservation_link?: string;

  // Playground specific
  playground_features?: string[];
  playground_surface?: string;

  // Educational
  educational_subjects?: string[];
  curricular_connections?: any;

  // Secret/hidden features
  secret_access_details?: string;
  secret_coordinates?: any;
  secret_landmarks?: string[];
  secret_parking?: string;
  exclusivity_level?: string;
  verified_by_locals?: boolean;

  // AR/tech features
  ar_experience_available?: boolean;
  ar_experience_id?: string;
  ar_preview?: string;

  // Other features
  venue_type?: string;
  insider_story?: string;
  pro_tip?: string;
  pro_tips?: string[];
  local_tips?: string[];
  story_source?: string;
  history?: string;
  highlights?: string[];
  activities?: any[];
  tags?: string[];
  key_photo_spots?: any[];
  parking_tips?: string;
  owner_bio?: string;
  recommended_time_blocks?: any[];
  quick_checklist?: string[];
  clothing_optional?: boolean;
  current_status?: string;
  is_currently_active?: boolean;

  // Olympic/venue specific
  olympic_venue?: boolean;
  isOlympicVenue?: boolean;

  // Relationships
  nearby?: NearbyPlace[];
  cross_category_connections?: CrossCategoryConnection[];

  // Metadata
  social_hashtags?: string[];
  partnership_affiliates?: string[];
  subscription_tier?: SubscriptionTier;
  subscriptionTier?: SubscriptionTier; // Alias
  premium_only?: boolean;
  created_at?: string;
  updated_at?: string;
  google_place_id?: string;
  places_data?: any;
  uuid?: string;
  slug?: string;
  is_accessible?: boolean;
}

export type SubscriptionTier = 'free' | 'premium' | 'olympic';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  ticket_price?: string;
  description?: string;
  venue?: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: string;
  distance: number; // in minutes
  address?: string;
  description?: string;
}

export interface CrossCategoryConnection {
  primary_category: string;
  connected_category: string;
  connection_type: string;
  connection_reason: string;
  distance_km: number;
  combined_time_estimate: string;
}

export interface DestinationTemplateProps {
  destination: Destination;
  subcategory?: string;
  templateType?: string;
  strategicRole?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// Cultural Heritage Template Props
export interface CulturalHeritageTemplateProps {
  destination: Destination;
  subcategory: string;
  strategicRole: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}

export interface WeatherData {
  temperature: number; // Current temperature
  current_temp: number; // Legacy compatibility
  conditions: string;
  recommendation: string;
  recommendation_class: string;
}

export interface CrossCategoryRecommendation {
  combo_name: string;
  categories_involved: string[];
  suggested_itinerary: string;
  total_time: string;
  difficulty_level: string;
}

// Component prop interfaces
export interface HeroSectionProps {
  destination: Destination;
  templateType: string;
}

export interface InsiderStoryProps {
  destination: Destination;
}

export interface WeatherWidgetProps {
  destination: Destination;
  weather?: WeatherData;
}

export interface CrossCategoryRecommendationsProps {
  destination: Destination;
  recommendations?: CrossCategoryRecommendation[];
}

export interface SocialShareProps {
  destination: Destination;
  contentType: string;
}

// Template-specific interfaces
export interface VenueProps {
  venue: Destination;
  isInteractive?: boolean;
}

export interface EventScheduleProps {
  events?: Event[];
}

export interface TicketInfoProps {
  venue: Destination;
}

export interface EveningAddOnsProps {
  nearby?: NearbyPlace[];
}

// Analytics and admin interfaces
export interface AnalyticsData {
  totalDestinations?: number;
  destinationsWithUrls?: number;
  destinationsWithoutUrls?: number;
  destinationsWithPhotos?: number;
  destinationsNeedingPhotos?: number;
  popularDestinations?: Destination[];
  kitStats?: any;
  totalSignups?: number;
  totalVotes?: number;
}

// Legacy compatibility exports
export type LegacyDestination = Destination;