import {
  users,
  destinations,
  userTrips,
  kitInterest,
  kitVotes,
  kitPreferences,
  businessSubmissions,
  type User,
  type UpsertUser,
  type Destination,
  type InsertDestination,
  type UserTrip,
  type InsertUserTrip,
  type KitInterest,
  type InsertKitInterest,
  type KitVotes,
  type InsertKitPreference,
  type InsertKitVotes,
  type BusinessSubmission,
  type InsertBusinessSubmission,
} from "../shared/schema";
import { SupabaseStorage } from "./supabase-storage";
import { db } from "./db";
import { eq, and, inArray, desc, asc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Destination operations
  getAllDestinations(): Promise<Destination[]>;
  getDestinationById(id: number | string): Promise<Destination | undefined>;
  getDestinationsByDriveTime(maxMinutes: number): Promise<Destination[]>;
  getDestinationsByCategory(category: string): Promise<Destination[]>;
  getDestinationsByTier(tier: string): Promise<Destination[]>;
  getDestinationsWithFilters(filters: { driveTime?: string; category?: string; tier?: string }): Promise<Destination[]>;
  getOlympicVenues(): Promise<Destination[]>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  updateDestination(id: number, updates: Partial<InsertDestination>): Promise<Destination>;
  
  // User trip operations
  getUserTrips(userId: string): Promise<UserTrip[]>;
  getUserTrip(id: string, userId: string): Promise<UserTrip | undefined>;
  createUserTrip(trip: InsertUserTrip): Promise<UserTrip>;
  updateUserTrip(id: string, trip: Partial<InsertUserTrip>): Promise<UserTrip>;
  deleteUserTrip(id: string, userId: string): Promise<void>;
  
  // Kit interest operations
  createKitInterest(interest: InsertKitInterest): Promise<KitInterest>;
  getKitAnalytics(): Promise<{ kitStats: any[], totalSignups: number, totalVotes: number }>;
  
  // Business submission operations
  createBusinessSubmission(submission: InsertBusinessSubmission): Promise<BusinessSubmission>;
  getAllBusinessSubmissions(): Promise<BusinessSubmission[]>;
  updateBusinessSubmissionStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<BusinessSubmission>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Destination operations
  async getAllDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations).orderBy(asc(destinations.name));
  }

  async getDestinationById(id: number | string): Promise<Destination | undefined> {
    // Handle UUID string or numeric ID
    if (typeof id === 'string' && id.includes('-')) {
      // UUID - look up by externalId
      const [destination] = await db
        .select()
        .from(destinations)
        .where(eq(destinations.externalId, id));
      return destination;
    } else {
      // Numeric ID
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
      const [destination] = await db
        .select()
        .from(destinations)
        .where(eq(destinations.id, numericId));
      return destination;
    }
  }

  async getDestinationsByDriveTime(maxMinutes: number): Promise<Destination[]> {
    return await db
      .select()
      .from(destinations)
      .where(lte(destinations.driveTime, maxMinutes))
      .orderBy(asc(destinations.driveTime));
  }

  async getDestinationsByCategory(category: string): Promise<Destination[]> {
    return await db
      .select()
      .from(destinations)
      .where(eq(destinations.category, category))
      .orderBy(asc(destinations.name));
  }

  async getDestinationsByTier(tier: string): Promise<Destination[]> {
    return await db
      .select()
      .from(destinations)
      .where(eq(destinations.subscriptionTier, tier))
      .orderBy(asc(destinations.name));
  }

  async getDestinationsWithFilters(filters: { driveTime?: string; category?: string; tier?: string }): Promise<Destination[]> {
    let query = db.select().from(destinations);
    const conditions = [];

    // Handle drive time ranges to match DriveTimeSelector component
    if (filters.driveTime) {
      const driveTimeValue = parseInt(filters.driveTime);
      
      switch (driveTimeValue) {
        case 30:
          // "30 MIN" - Downtown & Nearby (0-30 minutes)
          conditions.push(and(
            gte(destinations.driveTime, 0),
            lte(destinations.driveTime, 30)
          ));
          break;
        case 60:
          // "1 HOUR" - Ski Country (31-60 minutes)
          conditions.push(and(
            gte(destinations.driveTime, 31),
            lte(destinations.driveTime, 60)
          ));
          break;
        case 120:
          // "2 HOURS" - Natural Wonders (61-120 minutes)
          conditions.push(and(
            gte(destinations.driveTime, 61),
            lte(destinations.driveTime, 120)
          ));
          break;
        case 300:
          // "3-5 HRS" - National Parks (121-300 minutes)
          conditions.push(and(
            gte(destinations.driveTime, 121),
            lte(destinations.driveTime, 300)
          ));
          break;
        case 480:
          // "5-8 HRS" - Epic Adventures (301-480 minutes)
          conditions.push(and(
            gte(destinations.driveTime, 301),
            lte(destinations.driveTime, 480)
          ));
          break;
        case 720:
          // "8-12 HRS" - Ultimate Escapes (481-720 minutes)
          conditions.push(and(
            gte(destinations.driveTime, 481),
            lte(destinations.driveTime, 720)
          ));
          break;
        default:
          // Fallback for any other values
          conditions.push(lte(destinations.driveTime, driveTimeValue));
      }
    }

    // Handle category filter
    if (filters.category) {
      conditions.push(eq(destinations.category, filters.category));
    }

    // Handle tier filter
    if (filters.tier) {
      conditions.push(eq(destinations.subscriptionTier, filters.tier));
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    return await query.orderBy(asc(destinations.driveTime));
  }

  async getOlympicVenues(): Promise<Destination[]> {
    return await db
      .select()
      .from(destinations)
      .where(eq(destinations.isOlympicVenue, true))
      .orderBy(asc(destinations.name));
  }

  async createDestination(destination: InsertDestination): Promise<Destination> {
    const [created] = await db
      .insert(destinations)
      .values(destination)
      .returning();
    return created;
  }

  async updateDestination(id: number, updates: Partial<InsertDestination>): Promise<Destination> {
    const [updated] = await db
      .update(destinations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(destinations.id, id))
      .returning();
    return updated;
  }

  // User trip operations
  async getUserTrips(userId: string): Promise<UserTrip[]> {
    return await db
      .select()
      .from(userTrips)
      .where(eq(userTrips.userId, userId))
      .orderBy(desc(userTrips.createdAt));
  }

  async getUserTrip(id: string, userId: string): Promise<UserTrip | undefined> {
    const [trip] = await db
      .select()
      .from(userTrips)
      .where(and(eq(userTrips.id, id), eq(userTrips.userId, userId)));
    return trip;
  }

  async createUserTrip(trip: InsertUserTrip): Promise<UserTrip> {
    const [created] = await db
      .insert(userTrips)
      .values(trip)
      .returning();
    return created;
  }

  async updateUserTrip(id: string, trip: Partial<InsertUserTrip>): Promise<UserTrip> {
    const [updated] = await db
      .update(userTrips)
      .set({ ...trip, updatedAt: new Date() })
      .where(eq(userTrips.id, id))
      .returning();
    return updated;
  }

  async deleteUserTrip(id: string, userId: string): Promise<void> {
    await db
      .delete(userTrips)
      .where(and(eq(userTrips.id, id), eq(userTrips.userId, userId)));
  }

  // Kit interest operations
  async createKitInterest(interest: InsertKitInterest): Promise<KitInterest> {
    const [created] = await db
      .insert(kitInterest)
      .values(interest)
      .returning();
    return created;
  }

  async getKitAnalytics(): Promise<{ kitStats: any[], totalSignups: number, totalVotes: number }> {
    const signups = await db.select().from(kitInterest);
    const totalSignups = signups.length;
    const totalVotes = signups.reduce((sum, signup) => sum + signup.rankedKits.length, 0);
    
    // Calculate kit preferences
    const kitStats: Record<string, { name: string, votes: number, averageRank: number, rankings: number[] }> = {};
    
    signups.forEach(signup => {
      signup.rankedKits.forEach((kit, index) => {
        if (!kitStats[kit]) {
          kitStats[kit] = { name: kit, votes: 0, averageRank: 0, rankings: [] };
        }
        kitStats[kit].votes += 1;
        kitStats[kit].rankings.push(index + 1);
      });
    });
    
    // Calculate average rankings
    Object.values(kitStats).forEach(stat => {
      stat.averageRank = stat.rankings.reduce((sum, rank) => sum + rank, 0) / stat.rankings.length;
    });
    
    const kitStatsArray = Object.values(kitStats).sort((a, b) => a.averageRank - b.averageRank);
    
    return {
      kitStats: kitStatsArray,
      totalSignups,
      totalVotes,
    };
  }

  async saveKitPreferences(preferences: any[]): Promise<void> {
    if (preferences.length === 0) return;
    
    // Clear existing preferences for this session first
    const sessionId = preferences[0].sessionId;
    await db.execute(sql`DELETE FROM kit_preferences WHERE session_id = ${sessionId}`);
    
    // Insert new preferences
    for (const pref of preferences) {
      await db.execute(sql`
        INSERT INTO kit_preferences (session_id, email, kit_name, ranking)
        VALUES (${pref.sessionId}, ${pref.email || null}, ${pref.kitName}, ${pref.ranking})
      `);
    }
  }

  // Business submission operations
  async createBusinessSubmission(submission: InsertBusinessSubmission): Promise<BusinessSubmission> {
    const [created] = await db
      .insert(businessSubmissions)
      .values(submission)
      .returning();
    return created;
  }

  async getAllBusinessSubmissions(): Promise<BusinessSubmission[]> {
    return await db
      .select()
      .from(businessSubmissions)
      .orderBy(desc(businessSubmissions.createdAt));
  }

  async updateBusinessSubmissionStatus(id: number, status: string, reviewNotes?: string, reviewedBy?: string): Promise<BusinessSubmission> {
    const [updated] = await db
      .update(businessSubmissions)
      .set({
        status,
        reviewNotes,
        reviewedBy,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(businessSubmissions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();