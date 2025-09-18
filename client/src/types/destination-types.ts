/**
 * Unified Destination Types for SLCTrips
 * Resolves conflicts between different type definitions
 */

// Core destination interface that matches database structure
export interface Destination {
  id: number;
  external_id: string;
  name: string;
  category: string;
  drive_time: number;
  drive_time_text: string | null;
  distance: string | null;
  address: string | null;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  county: string;
  region: string;
  subcategory?: string;
  description?: string;
  description_short?: string;
  description_long?: string;
  image_url?: string;
  photoUrl?: string; // legacy compatibility
  insider_story?: string;
  pro_tip?: string;
  venue_type?: string;
  ticketing_available?: boolean;
  ticket_price?: string;
  vip_available?: boolean;
  vip_price?: string;
  upcoming_events?: Event[];
  nearby?: NearbyPlace[];
  cross_category_connections?: CrossCategoryConnection[];
  social_hashtags?: string[];
  partnership_affiliates?: string[];
  pricing?: Record<string, any> | null;
  subscription_tier?: SubscriptionTier;
  created_at?: string;
  updated_at?: string;
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