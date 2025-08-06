/**
 * Zod validation schema for BRAINS destination data
 * Ensures type safety and data integrity for all destination pages
 */

import { z } from "zod";

const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const HoursSchema = z.record(z.string()).optional();
const PricingSchema = z.record(z.union([z.string(), z.number()])).optional();

export const DestinationSchema = z.object({
  id: z.number(),
  external_id: z.string(),
  name: z.string(),
  category: z.string(),
  drive_time: z.number(),
  drive_time_text: z.string().nullable(),
  distance: z.string().nullable(),
  address: z.string().nullable(),
  coordinates: CoordinatesSchema.nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  description: z.string().nullable(),
  highlights: z.array(z.string()).nullable(),
  hours: HoursSchema.nullable(),
  pricing: PricingSchema.nullable(),
  tags: z.array(z.string()).nullable(),
  activities: z.array(z.string()).nullable(),
  seasonality: z.string().nullable(),
  time_needed: z.string().nullable(),
  difficulty: z.string().nullable(),
  accessibility: z.string().nullable(),
  best_time_to_visit: z.string().nullable(),
  nearby_attractions: z.array(z.string()).nullable(),
  packing_list: z.array(z.string()).nullable(),
  local_tips: z.array(z.string()).nullable(),
  olympic_venue: z.boolean().nullable(),
  subscription_tier: z.string(),
  created_at: z.union([z.string(), z.date()]).nullable(),
  updated_at: z.union([z.string(), z.date()]).nullable(),
  places_data: z.any().nullable(),
  tiktok_video_id: z.string().nullable(),
  video_filename: z.string().nullable(),
  photos: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    source: z.string().optional(),
    verified: z.boolean().optional(),
  })).nullable(),
  vibe_descriptors: z.array(z.string()).nullable(),
  is_olympic_venue: z.boolean().nullable(),
  crowd_level: z.string().nullable(),
  indoor_outdoor: z.string().nullable(),
  pet_friendly: z.boolean().nullable(),
  rating: z.number().nullable(),
  is_favorite: z.boolean().nullable(),
  public_transit: z.any().nullable(),
  family_friendly: z.string().nullable(),
  duration: z.string().nullable(),
  vibe: z.string().nullable(),
  local_lore: z.string().nullable(),
  data_source: z.string().nullable(),
});

export type Destination = z.infer<typeof DestinationSchema>;

export interface ValidationError {
  field: string;
  message: string;
  type: 'missing' | 'invalid' | 'malformed';
}

/**
 * Validates a destination object and returns validation errors
 */
export function validateDestination(data: any): {
  destination: Destination | null;
  errors: ValidationError[];
} {
  const result = DestinationSchema.safeParse(data);
  
  if (result.success) {
    // Check for critical missing fields that should trigger data issue banner
    const errors: ValidationError[] = [];
    
    if (!result.data.coordinates?.lat || !result.data.coordinates?.lng) {
      errors.push({
        field: 'coordinates',
        message: 'Missing latitude or longitude',
        type: 'missing'
      });
    }
    
    if (!result.data.description) {
      errors.push({
        field: 'description',
        message: 'Missing description',
        type: 'missing'
      });
    }
    
    if (!result.data.category) {
      errors.push({
        field: 'category',
        message: 'Missing region/category',
        type: 'missing'
      });
    }
    
    return {
      destination: result.data,
      errors
    };
  }
  
  // Parse Zod errors into our format
  const errors: ValidationError[] = result.error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    type: 'invalid'
  }));
  
  return {
    destination: null,
    errors
  };
}

/**
 * Type guard to check if destination has all required fields for rendering
 */
export function hasRequiredFields(destination: Destination): boolean {
  return !!(
    destination.name &&
    destination.coordinates?.lat &&
    destination.coordinates?.lng &&
    destination.description &&
    destination.category
  );
}

/**
 * Get region name from category for display
 */
export function getRegionFromCategory(category: string): string {
  const regionMap: Record<string, string> = {
    "30 MIN": "Wasatch Front",
    "1-2 HRS": "Northern Utah", 
    "WEEKEND": "Central Utah",
    "ROAD TRIPS": "Greater Utah",
    "STATE PARKS": "Utah State Parks",
    "NATIONAL": "National Parks",
    "Downtown & Nearby": "Salt Lake Valley",
    "Less than 3 Hours": "Northern Utah",
    "Less than 5 Hours": "Central Utah",
    "Less than 8 Hours": "Southern Utah",
    "Less than 90 Minutes": "Wasatch Front",
    "Less than 12 Hours": "Greater Southwest"
  };
  
  return regionMap[category] || "Utah";
}