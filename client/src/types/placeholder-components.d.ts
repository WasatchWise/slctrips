/**
 * Type definitions for placeholder components used across templates
 * These provide TypeScript safety without requiring full implementations
 */

import { Destination } from './destination-types';

// Common component prop types
export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
  location?: {
    name: string;
    address?: string | null;
    lat?: number;
    lng?: number;
  };
}

export interface StructuredDataDestination {
  id: number;
  name: string;
  description?: string | null;
  category: string;
  photos?: string[];
  address?: string | null;
  coordinates?: { lat: number; lng: number } | null;
  phone?: string | null;
  pricing?: string | null;
  subscriptionTier?: string;
  hours?: string | null;
  rating?: number | null;
  isOlympicVenue?: boolean;
}

export interface StructuredDataProps {
  destination: StructuredDataDestination;
}

// Re-export commonly used component types
export type { Destination };
