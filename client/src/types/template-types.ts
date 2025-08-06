// SLCTrips Template System Types
// Defines TypeScript interfaces for destination templates

export interface Destination {
  id: string;
  name: string;
  description?: string;
  description_short?: string;
  description_long?: string;
  category: string;
  subcategory?: string;
  driveTime: number;
  county: string;
  region: string;
  image_url?: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  insider_story?: string;
  pro_tip?: string;
  venue_type?: string;
  ticketing_available?: boolean;
  ticket_price?: string;
  vip_available?: boolean;
  vip_price?: string;
  upcoming_events?: Event[];
  nearby?: NearbyPlace[];
  // Additional fields for cross-category integration
  cross_category_connections?: CrossCategoryConnection[];
  social_hashtags?: string[];
  partnership_affiliates?: string[];
}

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
}

export interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}

export interface WeatherData {
  current_temp: number;
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