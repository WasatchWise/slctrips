/**
 * Mt. Olympus Master Plan Schema Implementation
 * Based on authentic Supabase brains data and strategic framework
 */

import { pgTable, text, uuid, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ================================================
// 1. MT. OLYMPIANS - County Character System
// ================================================
export const counties = pgTable("counties", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(), // "Salt Lake County", "Wasatch County"
  
  // Mt. Olympian Character Details
  avatar_name: text("avatar_name").notNull(), // "Dan", "Luna", "Koda"
  avatar_title: text("avatar_title").notNull(), // "Wasatch Sasquatch", "Alpine Selkie"
  species_type: text("species_type"), // "Wasatch Sasquatch", "Alpine Selkie", "Redrock Runner"
  
  // Powers & Abilities
  core_power: text("core_power").notNull(), // "Path-making & morale aura"
  secondary_skills: text("secondary_skills"), // "Navigation, Local History, Trail Building"
  elemental_affinity: text("elemental_affinity"), // "Earth", "Water", "Fire", "Air"
  
  // Character Personality
  personality_type: text("personality_type"), // "Gentle, endlessly curious"
  core_virtue: text("core_virtue"), // "Wisdom", "Courage", "Compassion"
  shadow_trait: text("shadow_trait"), // "Easily distracted by historical plaques"
  catchphrase: text("catchphrase"), // "Let's see what's around the next bend"
  quirks: text("quirks"), // "Refuses GPS, always pulls out crumpled paper maps"
  
  // Lore & Storytelling
  character_bible: text("character_bible"), // Full character description and backstory
  lore_description: text("lore_description"), // Origin story and mythology
  home_base: text("home_base"), // "Mount Olympus trailhead"
  sacred_object: text("sacred_object"), // "Vintage Polaroid camera"
  
  // Game Mechanics (for SLCTrips GO)
  unlock_tier: text("unlock_tier").default("wanderer"), // "wanderer", "pathfinder", "trailblazer"
  battle_score: integer("battle_score").default(0),
  ar_ability_trigger: text("ar_ability_trigger"), // How to activate in AR mode
  
  // Media Assets
  voice_style: text("voice_style"), // "Warm baritone with light humor"
  image_prompt: text("image_prompt"), // AI art generation prompt
  iconography: text("iconography"), // Symbol or emblem
  cover_photo_url: text("cover_photo_url"),
  
  // Metadata
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// ================================================
// 2. TRIPKITS - Monetization Engine
// ================================================
export const trip_kits = pgTable("trip_kits", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // "Utah's Hollywood Secrets"
  slug: text("slug").notNull().unique(), // "utah-hollywood-secrets"
  
  // Marketing & Sales
  tagline: text("tagline"), // Short hook for social media
  description: text("description").notNull(), // Full description for sales page
  value_proposition: text("value_proposition"), // "Movies & TV filming locations with behind-the-scenes stories"
  
  // Pricing & Monetization
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // 19.99
  tier: text("tier").default("individual"), // "individual", "bundle", "explorer", "commercial"
  
  // Content & Performance
  destination_count: integer("destination_count").default(0), // How many destinations included
  estimated_time: text("estimated_time"), // "Half day", "Full day", "Weekend"
  difficulty_level: text("difficulty_level"), // "Easy", "Moderate", "Challenging"
  
  // Based on viral content performance
  inspiration_source: text("inspiration_source"), // "Hidden Canyon viral video", "Summum Pyramid TikTok"
  performance_notes: text("performance_notes"), // "High conversion potential", "Niche but passionate audience"
  
  // Living Document Features
  last_content_update: timestamp("last_content_update"),
  auto_update_enabled: boolean("auto_update_enabled").default(true),
  seasonal_relevance: text("seasonal_relevance"), // "Year-round", "Summer only", "Winter sports"
  
  // Status & Availability
  status: text("status").default("draft"), // "draft", "live", "archived"
  featured: boolean("featured").default(false),
  
  // Media
  cover_image_url: text("cover_image_url"),
  preview_images: text("preview_images").array(), // Array of preview image URLs
  
  // Metadata
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// ================================================
// 3. ENHANCED DESTINATIONS - Daniel Integration
// ================================================
export const destinations_enhanced = pgTable("destinations_enhanced", {
  id: uuid("id").defaultRandom().primaryKey(),
  external_id: uuid("external_id"), // From Supabase Daniel
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  
  // Core Information
  tagline: text("tagline"),
  description_short: text("description_short"),
  description_long: text("description_long"),
  
  // Geographic Data
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  address_full: text("address_full"),
  county: text("county"),
  region: text("region"),
  
  // Travel Information
  drive_minutes: integer("drive_minutes"),
  distance_miles: decimal("distance_miles", { precision: 5, scale: 2 }),
  
  // Visitor Information
  pet_policy_allowed: boolean("pet_policy_allowed"),
  is_featured: boolean("is_featured").default(false),
  is_family_friendly: boolean("is_family_friendly"),
  is_stroller_friendly: boolean("is_stroller_friendly"),
  has_playground: boolean("has_playground"),
  
  // Parking Information
  parking_no: boolean("parking_no"),
  parking_variable: boolean("parking_variable"),
  parking_limited: boolean("parking_limited"),
  parking_true: boolean("parking_true"),
  is_parking_free: boolean("is_parking_free"),
  
  // Facilities
  has_restrooms: boolean("has_restrooms"),
  has_visitor_center: boolean("has_visitor_center"),
  
  // Seasonal Information
  is_season_spring: boolean("is_season_spring"),
  is_season_summer: boolean("is_season_summer"),
  is_season_fall: boolean("is_season_fall"),
  is_season_winter: boolean("is_season_winter"),
  is_season_all: boolean("is_season_all"),
  
  // Media
  cover_photo_url: text("cover_photo_url"),
  cover_photo_alt_text: text("cover_photo_alt_text"),
  photos: jsonb("photos"), // Array of photo objects with metadata
  
  // Categories (New 6-Category System)
  category_downtown_nearby: boolean("category_downtown_nearby"),
  category_epic_adventures: boolean("category_epic_adventures"),
  category_natural_wonders: boolean("category_natural_wonders"),
  category_ski_country: boolean("category_ski_country"),
  category_national_parks: boolean("category_national_parks"),
  category_ultimate_escapes: boolean("category_ultimate_escapes"),
  
  // Olympic Integration
  is_olympic_venue: boolean("is_olympic_venue").default(false),
  olympic_sport: text("olympic_sport"),
  olympic_year: integer("olympic_year"),
  
  // AI Enhancement Status
  ai_enriched: boolean("ai_enriched").default(false),
  ai_enrichment_date: timestamp("ai_enrichment_date"),
  content_quality_score: decimal("content_quality_score", { precision: 3, scale: 2 }),
  
  // Engagement Metrics
  view_count: integer("view_count").default(0),
  like_count: integer("like_count").default(0),
  share_count: integer("share_count").default(0),
  
  // Metadata
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// ================================================
// 4. VIDEO CONTENT SYSTEM
// ================================================
export const destination_videos = pgTable("destination_videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  destination_id: uuid("destination_id").references(() => destinations_enhanced.id, { onDelete: "cascade" }),
  
  // Video Content
  title: text("title").notNull(),
  description: text("description"),
  duration: integer("duration"), // seconds
  file_url: text("file_url").notNull(),
  thumbnail_url: text("thumbnail_url").notNull(),
  
  // Platform-specific data
  tiktok_url: text("tiktok_url"),
  youtube_url: text("youtube_url"),
  instagram_url: text("instagram_url"),
  
  // Engagement Metrics
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  shares: integer("shares").default(0),
  comments: integer("comments").default(0),
  
  // Performance Tracking
  conversion_rate: decimal("conversion_rate", { precision: 5, scale: 2 }), // Percentage who visited destination after video
  click_through_rate: decimal("click_through_rate", { precision: 5, scale: 2 }), // Percentage who clicked to destination page
  
  // Video Metadata
  tags: text("tags").array(), // Array of tag names for categorization
  featured: boolean("featured").default(false),
  upload_date: timestamp("upload_date").defaultNow(),
  
  // Voiceover Data (SLCTrips Template)
  voiceover_script: text("voiceover_script"), // Full script used
  opening_hook: text("opening_hook"), // "[Just X minutes from SLC airport]"
  content_body: text("content_body"), // Main destination content
  closing_cta: text("closing_cta"), // "[slctrips.com, From Salt Lake to Everywhere]"
  
  // Production Notes
  filming_location: text("filming_location"),
  production_notes: text("production_notes"),
  editor_notes: text("editor_notes"),
  
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow()
});

// ================================================
// 5. JUNCTION TABLES
// ================================================
export const destination_trip_kits = pgTable("destination_trip_kits", {
  id: uuid("id").defaultRandom().primaryKey(),
  destination_id: uuid("destination_id").references(() => destinations_enhanced.id, { onDelete: "cascade" }),
  trip_kit_id: uuid("trip_kit_id").references(() => trip_kits.id, { onDelete: "cascade" }),
  
  // Ordering and presentation
  order_index: integer("order_index").default(0),
  is_featured_in_kit: boolean("is_featured_in_kit").default(false),
  
  // Custom content for this kit
  kit_specific_description: text("kit_specific_description"),
  insider_tips: text("insider_tips"),
  
  created_at: timestamp("created_at").defaultNow()
});

export const county_destinations = pgTable("county_destinations", {
  id: uuid("id").defaultRandom().primaryKey(),
  county_id: uuid("county_id").references(() => counties.id, { onDelete: "cascade" }),
  destination_id: uuid("destination_id").references(() => destinations_enhanced.id, { onDelete: "cascade" }),
  
  // Character relationship
  is_character_favorite: boolean("is_character_favorite").default(false),
  character_story: text("character_story"), // How the Mt. Olympian relates to this destination
  
  created_at: timestamp("created_at").defaultNow()
});

// ================================================
// ZOD SCHEMAS FOR VALIDATION
// ================================================

// Counties
export const insertCountySchema = createInsertSchema(counties).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertTripKitSchema = createInsertSchema(trip_kits).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertDestinationEnhancedSchema = createInsertSchema(destinations_enhanced).omit({
  id: true,
  created_at: true,
  updated_at: true
});

export const insertDestinationVideoSchema = createInsertSchema(destination_videos).omit({
  id: true,
  created_at: true,
  updated_at: true
});

// Type exports
export type County = typeof counties.$inferSelect;
export type InsertCounty = z.infer<typeof insertCountySchema>;

export type TripKit = typeof trip_kits.$inferSelect;
export type InsertTripKit = z.infer<typeof insertTripKitSchema>;

export type DestinationEnhanced = typeof destinations_enhanced.$inferSelect;
export type InsertDestinationEnhanced = z.infer<typeof insertDestinationEnhancedSchema>;

export type DestinationVideo = typeof destination_videos.$inferSelect;
export type InsertDestinationVideo = z.infer<typeof insertDestinationVideoSchema>;