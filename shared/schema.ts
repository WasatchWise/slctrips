import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
  real,
  serial,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Valid destination categories matching authentic Supabase data
export const DESTINATION_CATEGORIES = [
  "Downtown & Nearby",
  "Less than 90 Minutes",
  "Less than 3 Hours",
  "Less than 5 Hours",
  "Less than 8 Hours",
  "Less than 12 Hours",
  "A little bit farther"
] as const;

export type DestinationCategory = typeof DESTINATION_CATEGORIES[number];

// Destinations table - matches actual PostgreSQL schema
export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  externalId: varchar("external_id", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  category: varchar("category", { length: 100 }),
  subcategory: varchar("subcategory", { length: 100 }),
  driveTime: integer("drive_time"),
  driveTimeText: varchar("drive_time_text", { length: 50 }),
  distance: varchar("distance", { length: 50 }),
  address: text("address"),
  coordinates: jsonb("coordinates").$type<{ lat: number; lng: number }>(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  phone: varchar("phone", { length: 20 }),
  website: varchar("website", { length: 500 }),
  county: varchar("county", { length: 100 }),
  region: varchar("region", { length: 100 }),
  // Note: description field does not exist in authentic Supabase source
  // Using only authentic fields: id, name, slug, latitude, longitude, county, region, category, subcategory, is_verified
  highlights: text("highlights").array(),
  hours: jsonb("hours"),
  pricing: jsonb("pricing"),
  tags: text("tags").array(),
  activities: text("activities").array(),
  seasonality: varchar("seasonality"),
  timeNeeded: varchar("time_needed"),
  difficulty: varchar("difficulty"),
  accessibility: varchar("accessibility"),
  bestTimeToVisit: varchar("best_time_to_visit"),
  nearbyAttractions: text("nearby_attractions").array(),
  packingList: text("packing_list").array(),
  localTips: text("local_tips").array(),
  olympicVenue: boolean("olympic_venue").default(false),
  subscriptionTier: varchar("subscription_tier"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  placesData: jsonb("places_data"),
  tiktokVideoId: varchar("tiktok_video_id"),
  videoFilename: varchar("video_filename"),
  photos: jsonb("photos").$type<Array<{
    url: string;
    caption?: string;
    source?: string;
  }>>(),
  vibeDescriptors: text("vibe_descriptors").array(),
  isOlympicVenue: boolean("is_olympic_venue").default(false),
  crowdLevel: varchar("crowd_level"),
  indoorOutdoor: varchar("indoor_outdoor"),
  petFriendly: boolean("pet_friendly"),
  // Enhanced fields for marketplace integration
  recommendedGear: jsonb("recommended_gear").$type<Array<{
    id: string;
    name: string;
    category: string;
    affiliateLink: string;
    imageUrl?: string;
    description?: string;
  }>>(),
  recommendedAmazonProducts: jsonb("recommended_amazon_products").$type<Array<{
    id: string;
    name: string;
    asin: string;
    category: string;
    affiliateLink: string;
    imageUrl?: string;
    description?: string;
  }>>(),
  // SEO and content fields
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDescription: text("meta_description"),
  contentQualityScore: real("content_quality_score").default(0.75),
  isVerified: boolean("is_verified").default(false),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  shareCount: integer("share_count").default(0),
  // Source tracking
  source: varchar("source", { length: 100 }).default("Supabase Daniel"),
  aiEnriched: boolean("ai_enriched").default(false),
});

export type Destination = typeof destinations.$inferSelect;
export type InsertDestination = typeof destinations.$inferInsert;

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDestinationInput = z.infer<typeof insertDestinationSchema>;

// User trips table
export const userTrips = pgTable("user_trips", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  notes: text("notes"),
  destinationIds: integer("destination_ids").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UserTrip = typeof userTrips.$inferSelect;
export type InsertUserTrip = typeof userTrips.$inferInsert;

export const insertUserTripSchema = createInsertSchema(userTrips).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUserTripInput = z.infer<typeof insertUserTripSchema>;

// TripKit votes table for ranked choice voting
export const kitInterest = pgTable("kit_interest", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  sessionId: varchar("session_id", { length: 255 }),
  rankedKits: jsonb("ranked_kits").$type<string[]>().notNull(),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type KitInterest = typeof kitInterest.$inferSelect;
export type InsertKitInterest = typeof kitInterest.$inferInsert;

export const insertKitInterestSchema = createInsertSchema(kitInterest).omit({
  id: true,
  createdAt: true,
});
export type InsertKitInterestInput = z.infer<typeof insertKitInterestSchema>;

// TripKit votes aggregation for analytics
export const kitVotes = pgTable("kit_votes", {
  id: serial("id").primaryKey(),
  kitName: varchar("kit_name", { length: 255 }).notNull(),
  position: integer("position").notNull(), // 1-5 ranking position
  votes: integer("votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type KitVotes = typeof kitVotes.$inferSelect;
export type InsertKitVotes = typeof kitVotes.$inferInsert;

// Kit preferences for ranked choice voting
export const kitPreferences = pgTable("kit_preferences", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  kitName: varchar("kit_name", { length: 255 }).notNull(),
  ranking: integer("ranking").notNull(), // 1-3 for ranked choice
  createdAt: timestamp("created_at").defaultNow(),
});

export type KitPreference = typeof kitPreferences.$inferSelect;
export type InsertKitPreference = typeof kitPreferences.$inferInsert;

// Kit signups for notifications
export const kitSignups = pgTable("kit_signups", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  kitName: varchar("kit_name", { length: 255 }).notNull(),
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type KitSignup = typeof kitSignups.$inferSelect;
export type InsertKitSignup = typeof kitSignups.$inferInsert;

// Kit analytics for tracking
export const kitAnalytics = pgTable("kit_analytics", {
  id: serial("id").primaryKey(),
  kitName: varchar("kit_name", { length: 255 }).notNull(),
  metric: varchar("metric", { length: 100 }).notNull(), // 'signups', 'votes', etc.
  value: integer("value").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  kitMetricIdx: index("kit_metric_idx").on(table.kitName, table.metric),
}));

export type KitAnalytics = typeof kitAnalytics.$inferSelect;
export type InsertKitAnalytics = typeof kitAnalytics.$inferInsert;

// Business submissions table
export const businessSubmissions = pgTable("business_submissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  address: text("address"),
  website: varchar("website", { length: 500 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull(),
  description: text("description").notNull(),
  highlights: text("highlights"),
  hours: varchar("hours", { length: 200 }),
  pricing: varchar("pricing", { length: 100 }),
  seasonality: text("seasonality"),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  businessRole: varchar("business_role", { length: 100 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  reviewNotes: text("review_notes"),
  reviewedBy: varchar("reviewed_by", { length: 255 }),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type BusinessSubmission = typeof businessSubmissions.$inferSelect;
export type InsertBusinessSubmission = typeof businessSubmissions.$inferInsert;

export const insertBusinessSubmissionSchema = createInsertSchema(businessSubmissions).omit({
  id: true,
  status: true,
  reviewNotes: true,
  reviewedBy: true,
  reviewedAt: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBusinessSubmissionInput = z.infer<typeof insertBusinessSubmissionSchema>;

// Destination analytics table for tracking clicks and views
export const destinationAnalytics = pgTable("destination_analytics", {
  id: serial("id").primaryKey(),
  destinationId: integer("destination_id").notNull(),
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'view', 'click', 'details_view'
  userAgent: text("user_agent"),
  ipAddress: varchar("ip_address", { length: 45 }),
  referrer: text("referrer"),
  sessionId: varchar("session_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export type DestinationAnalytics = typeof destinationAnalytics.$inferSelect;
export type InsertDestinationAnalytics = typeof destinationAnalytics.$inferInsert;

export const insertDestinationAnalyticsSchema = createInsertSchema(destinationAnalytics).omit({
  id: true,
  createdAt: true,
});
export type InsertDestinationAnalyticsInput = z.infer<typeof insertDestinationAnalyticsSchema>;

// Affiliate Products table for Utah-based merchant integration
export const affiliateProducts = pgTable("affiliate_products", {
  id: text("id").primaryKey(), // UUID
  merchantName: text("merchant_name").notNull(),
  productName: text("product_name").notNull(),
  category: text("category").notNull(),
  affiliateLink: text("affiliate_link").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  network: text("network").notNull(), // 'Awin', 'AvantLink', 'Impact', 'Partnerize'
  utahBased: boolean("utah_based").default(false),
  tags: text("tags").array(),
  tripkitMatch: text("tripkit_match").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AffiliateProduct = typeof affiliateProducts.$inferSelect;
export type InsertAffiliateProduct = typeof affiliateProducts.$inferInsert;

export const insertAffiliateProductSchema = createInsertSchema(affiliateProducts).omit({
  id: true,
  createdAt: true,
});
export type InsertAffiliateProductInput = z.infer<typeof insertAffiliateProductSchema>;

// Amazon Affiliate Products table for Amazon Associates integration
export const amazonAffiliateProducts = pgTable("amazon_affiliate_products", {
  id: text("id").primaryKey(), // UUID
  productName: text("product_name").notNull(),
  asin: text("asin").notNull(), // Amazon product ID
  category: text("category").notNull(),
  affiliateLink: text("affiliate_link").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  tripkitMatch: text("tripkit_match").array(),
  destinationMatch: text("destination_match").array(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type AmazonAffiliateProduct = typeof amazonAffiliateProducts.$inferSelect;
export type InsertAmazonAffiliateProduct = typeof amazonAffiliateProducts.$inferInsert;

export const insertAmazonAffiliateProductSchema = createInsertSchema(amazonAffiliateProducts).omit({
  id: true,
  createdAt: true,
});
export type InsertAmazonAffiliateProductInput = z.infer<typeof insertAmazonAffiliateProductSchema>;