// src/lib/brand.ts
/**
 * Canonical Brand Constants
 * Single source of truth for all SLC Trips branding
 * DO NOT hardcode these strings elsewhere - always import from this file
 */

export const TAGLINE = "From Salt Lake, to Everywhere";
export const DESTINATION_COUNT_STR = "1 Airport * 1000+ Destinations";

// Helper for safe insertion in meta tags and UI
export const brand = {
  tagline: TAGLINE,
  destinations: DESTINATION_COUNT_STR,

  // Pre-split helpers for styling
  taglineParts: {
    prefix: "From Salt Lake",
    suffix: "to Everywhere"
  },

  // SEO-optimized versions
  seo: {
    title: "SLC Trips - Utah's Premier Adventure Guide",
    description: `Discover ${DESTINATION_COUNT_STR} within driving distance of Salt Lake City. ${TAGLINE}.`,
    keywords: ["Utah travel", "Salt Lake City", "2034 Olympics", "Utah destinations", "road trips"]
  },

  // Social media versions
  social: {
    twitter: `${TAGLINE} 🏔️ ${DESTINATION_COUNT_STR}`,
    ogTitle: `SLC Trips - ${TAGLINE}`,
    ogDescription: `Your guide to ${DESTINATION_COUNT_STR} from Salt Lake City`
  }
} as const;

export default brand;
