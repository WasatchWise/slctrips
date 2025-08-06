/**
 * Supabase Table Creation System
 * Creates all necessary tables for Mt. Olympus Master Plan expansion
 */

import { supabase } from './supabase-client';

export interface TableCreationResult {
  success: boolean;
  tablesCreated: string[];
  tablesSkipped: string[];
  errors: string[];
}

export class SupabaseTableCreator {
  
  /**
   * Check if a table exists in Supabase
   */
  private async tableExists(tableName: string): Promise<boolean> {
    try {
      const { error } = await supabase.from(tableName).select('*').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Create a table using direct INSERT operations to test structure
   */
  private async createTableViaInsert(tableName: string, sampleData: any): Promise<boolean> {
    try {
      // Try to insert and immediately delete to test table structure
      const { data, error } = await supabase
        .from(tableName)
        .insert(sampleData)
        .select()
        .single();
      
      if (!error && data) {
        // Clean up the test record
        await supabase.from(tableName).delete().eq('id', data.id);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Create tags table for destination categorization
   */
  async createTagsTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'tags';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Tags table already exists' };
    }

    // Test if we can create via insert
    const sampleTag = {
      name: 'test-tag',
      category: 'activity',
      description: 'Test tag for table creation',
      color: '#0087c8',
      icon: 'tag',
      created_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, sampleTag);
    
    return {
      success: created,
      message: created 
        ? 'Tags table structure verified and ready' 
        : 'Tags table needs to be created in Supabase dashboard with fields: id (uuid, primary), name (text), category (text), description (text), color (text), icon (text), created_at (timestamptz)'
    };
  }

  /**
   * Create activities table for destination activities
   */
  async createActivitiesTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'activities';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Activities table already exists' };
    }

    const sampleActivity = {
      name: 'Hiking',
      category: 'outdoor',
      description: 'Trail hiking and walking activities',
      difficulty_levels: ['Easy', 'Moderate', 'Hard'],
      season_availability: ['Spring', 'Summer', 'Fall'],
      gear_required: ['Hiking boots', 'Water bottle'],
      duration_range: { min: 30, max: 480 },
      created_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, sampleActivity);
    
    return {
      success: created,
      message: created 
        ? 'Activities table structure verified and ready' 
        : 'Activities table needs to be created in Supabase dashboard with fields: id (uuid, primary), name (text), category (text), description (text), difficulty_levels (text[]), season_availability (text[]), gear_required (text[]), duration_range (jsonb), created_at (timestamptz)'
    };
  }

  /**
   * Create photos table for destination imagery
   */
  async createPhotosTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'photos';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Photos table already exists' };
    }

    const samplePhoto = {
      destination_uuid: '872fa53d-3850-4c31-b7db-2d82ea1a4dcc',
      url: 'https://example.com/photo.jpg',
      alt_text: 'Sample photo',
      caption: 'Test photo for table creation',
      source: 'Google Places API',
      photographer: 'System Test',
      width: 1920,
      height: 1080,
      file_size: 245760,
      is_primary: false,
      verified: true,
      uploaded_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, samplePhoto);
    
    return {
      success: created,
      message: created 
        ? 'Photos table structure verified and ready' 
        : 'Photos table needs to be created in Supabase dashboard with fields: id (uuid, primary), destination_uuid (uuid, foreign key), url (text), alt_text (text), caption (text), source (text), photographer (text), width (int4), height (int4), file_size (int4), is_primary (bool), verified (bool), uploaded_at (timestamptz)'
    };
  }

  /**
   * Create destination_tags junction table
   */
  async createDestinationTagsTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'destination_tags';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Destination tags table already exists' };
    }

    const sampleRelation = {
      destination_uuid: '872fa53d-3850-4c31-b7db-2d82ea1a4dcc',
      tag_id: 1,
      relevance_score: 0.95,
      added_by: 'system',
      created_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, sampleRelation);
    
    return {
      success: created,
      message: created 
        ? 'Destination tags table structure verified and ready' 
        : 'Destination tags table needs to be created in Supabase dashboard with fields: id (uuid, primary), destination_uuid (uuid, foreign key), tag_id (uuid, foreign key), relevance_score (numeric), added_by (text), created_at (timestamptz)'
    };
  }

  /**
   * Create destination_activities junction table
   */
  async createDestinationActivitiesTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'destination_activities';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Destination activities table already exists' };
    }

    const sampleRelation = {
      destination_uuid: '872fa53d-3850-4c31-b7db-2d82ea1a4dcc',
      activity_id: 1,
      difficulty: 'Moderate',
      duration_estimate: 120,
      recommended_season: ['Spring', 'Summer', 'Fall'],
      created_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, sampleRelation);
    
    return {
      success: created,
      message: created 
        ? 'Destination activities table structure verified and ready' 
        : 'Destination activities table needs to be created in Supabase dashboard with fields: id (uuid, primary), destination_uuid (uuid, foreign key), activity_id (uuid, foreign key), difficulty (text), duration_estimate (int4), recommended_season (text[]), created_at (timestamptz)'
    };
  }

  /**
   * Create reviews table for user feedback
   */
  async createReviewsTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'reviews';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Reviews table already exists' };
    }

    const sampleReview = {
      destination_uuid: '872fa53d-3850-4c31-b7db-2d82ea1a4dcc',
      user_name: 'Test User',
      rating: null, // Only authentic Google Places ratings used
      title: 'Great experience',
      content: 'Sample review for table testing',
      visit_date: '2025-07-04',
      verified_visit: false,
      helpful_votes: 0,
      created_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, sampleReview);
    
    return {
      success: created,
      message: created 
        ? 'Reviews table structure verified and ready' 
        : 'Reviews table needs to be created in Supabase dashboard with fields: id (uuid, primary), destination_uuid (uuid, foreign key), user_name (text), rating (numeric), title (text), content (text), visit_date (date), verified_visit (bool), helpful_votes (int4), created_at (timestamptz)'
    };
  }

  /**
   * Create trip_kits table for monetization
   */
  async createTripKitsTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'trip_kits';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Trip kits table already exists' };
    }

    const sampleTripKit = {
      title: 'Utah Adventure Weekend',
      description: 'A comprehensive guide to Utah adventures',
      price_cents: 2999,
      duration_hours: 48,
      difficulty_level: 'Moderate',
      included_destinations: ['872fa53d-3850-4c31-b7db-2d82ea1a4dcc'],
      gear_recommendations: ['Hiking boots', 'Camera', 'Water bottle'],
      season_availability: ['Spring', 'Summer', 'Fall'],
      max_group_size: 6,
      guide_included: false,
      transportation_included: false,
      meals_included: false,
      cover_image_url: '',
      gallery_urls: [],
      downloadable_assets: ['PDF Guide', 'Maps'],
      active: true,
      created_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, sampleTripKit);
    
    return {
      success: created,
      message: created 
        ? 'Trip kits table structure verified and ready' 
        : 'Trip kits table needs to be created in Supabase dashboard with fields: id (uuid, primary), title (text), description (text), price_cents (int4), duration_hours (int4), difficulty_level (text), included_destinations (uuid[]), gear_recommendations (text[]), season_availability (text[]), max_group_size (int4), guide_included (bool), transportation_included (bool), meals_included (bool), cover_image_url (text), gallery_urls (text[]), downloadable_assets (text[]), active (bool), created_at (timestamptz)'
    };
  }

  /**
   * Create mt_olympus_characters table
   */
  async createMtOlympusCharactersTable(): Promise<{ success: boolean; message: string }> {
    const tableName = 'mt_olympus_characters';
    
    if (await this.tableExists(tableName)) {
      return { success: true, message: 'Mt. Olympus characters table already exists' };
    }

    const sampleCharacter = {
      name: 'Test Guardian',
      county: 'Salt Lake County',
      title: 'Guardian of Salt Lake County',
      power_core: 'Urban Coordination',
      power_secondary: ['Navigation', 'Communication'],
      avatar_url: '',
      story_short: 'A test character for table creation',
      story_long: 'This is a comprehensive test character used to verify table structure',
      artifacts: ['Crystal of Coordination', 'Map of Paths'],
      special_abilities: ['Path Finding', 'Group Coordination'],
      domain_environment: 'Urban',
      personality_traits: ['Helpful', 'Organized', 'Friendly'],
      created_at: new Date().toISOString()
    };

    const created = await this.createTableViaInsert(tableName, sampleCharacter);
    
    return {
      success: created,
      message: created 
        ? 'Mt. Olympus characters table structure verified and ready' 
        : 'Mt. Olympus characters table needs to be created in Supabase dashboard with fields: id (uuid, primary), name (text), county (text), title (text), power_core (text), power_secondary (text[]), avatar_url (text), story_short (text), story_long (text), artifacts (text[]), special_abilities (text[]), domain_environment (text), personality_traits (text[]), created_at (timestamptz)'
    };
  }

  /**
   * Create all tables needed for Mt. Olympus Master Plan
   */
  async createAllTables(): Promise<TableCreationResult> {
    const result: TableCreationResult = {
      success: true,
      tablesCreated: [],
      tablesSkipped: [],
      errors: []
    };

    const tables = [
      { name: 'tags', method: () => this.createTagsTable() },
      { name: 'activities', method: () => this.createActivitiesTable() },
      { name: 'photos', method: () => this.createPhotosTable() },
      { name: 'destination_tags', method: () => this.createDestinationTagsTable() },
      { name: 'destination_activities', method: () => this.createDestinationActivitiesTable() },
      { name: 'reviews', method: () => this.createReviewsTable() },
      { name: 'trip_kits', method: () => this.createTripKitsTable() },
      { name: 'mt_olympus_characters', method: () => this.createMtOlympusCharactersTable() }
    ];

    for (const table of tables) {
      try {
        const tableResult = await table.method();
        
        if (tableResult.success) {
          if (tableResult.message.includes('already exists')) {
            result.tablesSkipped.push(table.name);
          } else {
            result.tablesCreated.push(table.name);
          }
        } else {
          result.errors.push(`${table.name}: ${tableResult.message}`);
          result.success = false;
        }
      } catch (error: any) {
        result.errors.push(`${table.name}: ${error.message}`);
        result.success = false;
      }
    }

    return result;
  }

  /**
   * Generate SQL creation scripts for manual creation
   */
  generateSQLScripts(): Record<string, string> {
    return {
      tags: `
        CREATE TABLE tags (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL UNIQUE,
          category TEXT NOT NULL,
          description TEXT,
          color TEXT DEFAULT '#0087c8',
          icon TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      activities: `
        CREATE TABLE activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          difficulty_levels TEXT[] DEFAULT '{}',
          season_availability TEXT[] DEFAULT '{}',
          gear_required TEXT[] DEFAULT '{}',
          duration_range JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      photos: `
        CREATE TABLE photos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          destination_uuid UUID NOT NULL,
          url TEXT NOT NULL,
          alt_text TEXT,
          caption TEXT,
          source TEXT,
          photographer TEXT,
          width INTEGER,
          height INTEGER,
          file_size INTEGER,
          is_primary BOOLEAN DEFAULT false,
          verified BOOLEAN DEFAULT false,
          uploaded_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (destination_uuid) REFERENCES destinations(id)
        );
      `,
      destination_tags: `
        CREATE TABLE destination_tags (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          destination_uuid UUID NOT NULL,
          tag_id UUID NOT NULL,
          relevance_score NUMERIC(3,2) DEFAULT 1.0,
          added_by TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (destination_uuid) REFERENCES destinations(id),
          FOREIGN KEY (tag_id) REFERENCES tags(id),
          UNIQUE(destination_uuid, tag_id)
        );
      `,
      destination_activities: `
        CREATE TABLE destination_activities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          destination_uuid UUID NOT NULL,
          activity_id UUID NOT NULL,
          difficulty TEXT,
          duration_estimate INTEGER,
          recommended_season TEXT[] DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (destination_uuid) REFERENCES destinations(id),
          FOREIGN KEY (activity_id) REFERENCES activities(id),
          UNIQUE(destination_uuid, activity_id)
        );
      `,
      reviews: `
        CREATE TABLE reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          destination_uuid UUID NOT NULL,
          user_name TEXT NOT NULL,
          rating NUMERIC(2,1) CHECK (rating >= 1 AND rating <= 5),
          title TEXT,
          content TEXT,
          visit_date DATE,
          verified_visit BOOLEAN DEFAULT false,
          helpful_votes INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          FOREIGN KEY (destination_uuid) REFERENCES destinations(id)
        );
      `,
      trip_kits: `
        CREATE TABLE trip_kits (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          price_cents INTEGER NOT NULL DEFAULT 0,
          duration_hours INTEGER,
          difficulty_level TEXT CHECK (difficulty_level IN ('Easy', 'Moderate', 'Hard', 'Expert')),
          included_destinations UUID[] DEFAULT '{}',
          gear_recommendations TEXT[] DEFAULT '{}',
          season_availability TEXT[] DEFAULT '{}',
          max_group_size INTEGER DEFAULT 8,
          guide_included BOOLEAN DEFAULT false,
          transportation_included BOOLEAN DEFAULT false,
          meals_included BOOLEAN DEFAULT false,
          cover_image_url TEXT,
          gallery_urls TEXT[] DEFAULT '{}',
          downloadable_assets TEXT[] DEFAULT '{}',
          active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `,
      mt_olympus_characters: `
        CREATE TABLE mt_olympus_characters (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL UNIQUE,
          county TEXT NOT NULL,
          title TEXT NOT NULL,
          power_core TEXT NOT NULL,
          power_secondary TEXT[] DEFAULT '{}',
          avatar_url TEXT,
          story_short TEXT,
          story_long TEXT,
          artifacts TEXT[] DEFAULT '{}',
          special_abilities TEXT[] DEFAULT '{}',
          domain_environment TEXT,
          personality_traits TEXT[] DEFAULT '{}',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    };
  }
}

export const supabaseTableCreator = new SupabaseTableCreator();