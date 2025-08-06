/**
 * Daniel Data Integration System
 * Loads authentic Supabase data from CSV into PostgreSQL
 * Based on Mt. Olympus Master Plan specifications
 */

import { db } from "./db";
import { destinations_enhanced } from "@shared/mt-olympus-schema";
import * as fs from "fs";
import * as path from "path";

interface DanielRow {
  uuid: string;
  name: string;
  slug: string;
  tagline?: string;
  description_short?: string;
  description_long?: string;
  latitude?: string;
  longitude?: string;
  address_full?: string;
  county?: string;
  region?: string;
  drive_minutes?: string;
  distance_miles?: string;
  pet_policy_allowed?: string;
  is_featured?: string;
  is_family_friendly?: string;
  is_stroller_friendly?: string;
  has_playground?: string;
  parking_no?: string;
  parking_variable?: string;
  parking_limited?: string;
  parking_true?: string;
  is_parking_free?: string;
  has_restrooms?: string;
  has_visitor_center?: string;
  is_season_spring?: string;
  is_season_summer?: string;
  is_season_fall?: string;
  is_season_winter?: string;
  is_season_all?: string;
  cover_photo_url?: string;
  cover_photo_alt_text?: string;
  destination_url?: string;
  [key: string]: string | undefined; // For additional CSV columns
}

export class DanielIntegration {
  private csvPath = path.join(process.cwd(), "attached_assets", "SLCTripsDatabase - Daniel_1751606719553.csv");
  
  /**
   * Parse CSV data with proper handling of quoted fields
   */
  private parseCSV(csvContent: string): DanielRow[] {
    const lines = csvContent.split('\n');
    if (lines.length < 2) return [];
    
    const headers = this.parseCSVRow(lines[0]);
    const rows: DanielRow[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = this.parseCSVRow(line);
      if (values.length === 0) continue;
      
      const row: DanielRow = {};
      headers.forEach((header, index) => {
        if (values[index] !== undefined) {
          row[header] = values[index];
        }
      });
      
      // Only process rows with required fields
      if (row.uuid && row.name && row.slug) {
        rows.push(row);
      }
    }
    
    return rows;
  }
  
  /**
   * Parse a CSV row handling quotes and commas properly
   */
  private parseCSVRow(row: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"') {
        if (inQuotes && row[i + 1] === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }
  
  /**
   * Convert string boolean values to actual booleans
   */
  private stringToBoolean(value?: string): boolean {
    if (!value) return false;
    const lower = value.toLowerCase();
    return lower === 'true' || lower === '1' || lower === 'yes';
  }
  
  /**
   * Convert string number values to numbers
   */
  private stringToNumber(value?: string): number | null {
    if (!value || value === '') return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
  
  /**
   * Categorize destination based on drive time and characteristics
   */
  private categorizeDestination(row: DanielRow): {
    category_downtown_nearby: boolean;
    category_epic_adventures: boolean;
    category_natural_wonders: boolean;
    category_ski_country: boolean;
    category_national_parks: boolean;
    category_ultimate_escapes: boolean;
  } {
    const driveMinutes = this.stringToNumber(row.drive_minutes) || 0;
    const name = row.name?.toLowerCase() || '';
    const description = (row.description_short || row.description_long || '').toLowerCase();
    
    // National Parks (explicit detection)
    if (name.includes('national park') || description.includes('national park')) {
      return {
        category_downtown_nearby: false,
        category_epic_adventures: false,
        category_natural_wonders: false,
        category_ski_country: false,
        category_national_parks: true,
        category_ultimate_escapes: false
      };
    }
    
    // Ski Country (winter sports)
    if (name.includes('ski') || name.includes('snowbird') || name.includes('alta') || 
        name.includes('brighton') || name.includes('solitude') || description.includes('skiing')) {
      return {
        category_downtown_nearby: false,
        category_epic_adventures: false,
        category_natural_wonders: false,
        category_ski_country: true,
        category_national_parks: false,
        category_ultimate_escapes: false
      };
    }
    
    // Drive time based categorization
    if (driveMinutes <= 45) {
      return {
        category_downtown_nearby: true,
        category_epic_adventures: false,
        category_natural_wonders: false,
        category_ski_country: false,
        category_national_parks: false,
        category_ultimate_escapes: false
      };
    } else if (driveMinutes <= 120) {
      // Natural features vs adventures
      if (name.includes('canyon') || name.includes('falls') || name.includes('lake') || 
          name.includes('mountain') || description.includes('natural')) {
        return {
          category_downtown_nearby: false,
          category_epic_adventures: false,
          category_natural_wonders: true,
          category_ski_country: false,
          category_national_parks: false,
          category_ultimate_escapes: false
        };
      } else {
        return {
          category_downtown_nearby: false,
          category_epic_adventures: true,
          category_natural_wonders: false,
          category_ski_country: false,
          category_national_parks: false,
          category_ultimate_escapes: false
        };
      }
    } else {
      // 2+ hours = Ultimate Escapes
      return {
        category_downtown_nearby: false,
        category_epic_adventures: false,
        category_natural_wonders: false,
        category_ski_country: false,
        category_national_parks: false,
        category_ultimate_escapes: true
      };
    }
  }
  
  /**
   * Transform Daniel row to database format
   */
  private transformRow(row: DanielRow) {
    const categories = this.categorizeDestination(row);
    
    return {
      external_id: row.uuid,
      name: row.name,
      slug: row.slug,
      tagline: row.tagline || null,
      description_short: row.description_short || null,
      description_long: row.description_long || null,
      latitude: this.stringToNumber(row.latitude),
      longitude: this.stringToNumber(row.longitude),
      address_full: row.address_full || null,
      county: row.county || null,
      region: row.region || null,
      drive_minutes: this.stringToNumber(row.drive_minutes),
      distance_miles: this.stringToNumber(row.distance_miles),
      pet_policy_allowed: this.stringToBoolean(row.pet_policy_allowed),
      is_featured: this.stringToBoolean(row.is_featured),
      is_family_friendly: this.stringToBoolean(row.is_family_friendly),
      is_stroller_friendly: this.stringToBoolean(row.is_stroller_friendly),
      has_playground: this.stringToBoolean(row.has_playground),
      parking_no: this.stringToBoolean(row.parking_no),
      parking_variable: this.stringToBoolean(row.parking_variable),
      parking_limited: this.stringToBoolean(row.parking_limited),
      parking_true: this.stringToBoolean(row.parking_true),
      is_parking_free: this.stringToBoolean(row.is_parking_free),
      has_restrooms: this.stringToBoolean(row.has_restrooms),
      has_visitor_center: this.stringToBoolean(row.has_visitor_center),
      is_season_spring: this.stringToBoolean(row.is_season_spring),
      is_season_summer: this.stringToBoolean(row.is_season_summer),
      is_season_fall: this.stringToBoolean(row.is_season_fall),
      is_season_winter: this.stringToBoolean(row.is_season_winter),
      is_season_all: this.stringToBoolean(row.is_season_all),
      cover_photo_url: row.cover_photo_url || null,
      cover_photo_alt_text: row.cover_photo_alt_text || null,
      photos: row.cover_photo_url ? [{
        url: row.cover_photo_url,
        caption: row.cover_photo_alt_text || row.name,
        source: "Supabase Daniel",
        verified: true,
        updated: new Date().toISOString()
      }] : null,
      ...categories,
      is_olympic_venue: false,
      ai_enriched: false,
      content_quality_score: 0.75, // Default quality score for Daniel data
      view_count: 0,
      like_count: 0,
      share_count: 0
    };
  }
  
  /**
   * Load and process Daniel data
   */
  async loadDanielData(): Promise<{
    success: boolean;
    loaded: number;
    errors: string[];
    summary: Record<string, number>;
  }> {
    try {
      // console.log("🧠 Loading Daniel data from:", this.csvPath);
      
      if (!fs.existsSync(this.csvPath)) {
        throw new Error(`Daniel CSV file not found: ${this.csvPath}`);
      }
      
      const csvContent = fs.readFileSync(this.csvPath, 'utf-8');
      const rows = this.parseCSV(csvContent);
      
      // console.log(`📊 Parsed ${rows.length} Daniel destinations`);
      
      const errors: string[] = [];
      let loaded = 0;
      const summary: Record<string, number> = {
        downtown_nearby: 0,
        epic_adventures: 0,
        natural_wonders: 0,
        ski_country: 0,
        national_parks: 0,
        ultimate_escapes: 0
      };
      
      // Process in batches of 50
      const batchSize = 50;
      for (let i = 0; i < rows.length; i += batchSize) {
        const batch = rows.slice(i, i + batchSize);
        
        try {
          const transformedBatch = batch.map(row => {
            const transformed = this.transformRow(row);
            
            // Update summary counts
            if (transformed.category_downtown_nearby) summary.downtown_nearby++;
            if (transformed.category_epic_adventures) summary.epic_adventures++;
            if (transformed.category_natural_wonders) summary.natural_wonders++;
            if (transformed.category_ski_country) summary.ski_country++;
            if (transformed.category_national_parks) summary.national_parks++;
            if (transformed.category_ultimate_escapes) summary.ultimate_escapes++;
            
            return transformed;
          });
          
          await db.insert(destinations_enhanced).values(transformedBatch);
          loaded += batch.length;
          
          // console.log(`✅ Loaded batch ${Math.floor(i/batchSize) + 1}: ${batch.length} destinations`);
          
        } catch (_error) {
          const errorMsg = `Batch ${Math.floor(i/batchSize) + 1} failed: ${_error instanceof Error ? _error.message : 'Unknown error'}`;
          errors.push(errorMsg);
          // console.error("❌", errorMsg);
        }
      }
      
      // console.log(`Daniel Integration Complete:
      //   Loaded: ${loaded} destinations
      //   Errors: ${errors.length}
      //   Categories:
      //     - Downtown & Nearby: ${summary.downtown_nearby}
      //     - Epic Adventures: ${summary.epic_adventures}  
      //     - Natural Wonders: ${summary.natural_wonders}
      //     - Ski Country: ${summary.ski_country}
      //     - National Parks: ${summary.national_parks}
      //     - Ultimate Escapes: ${summary.ultimate_escapes}`);
      
      return {
        success: true,
        loaded,
        errors,
        summary
      };
      
    } catch (_error) {
      const errorMsg = _error instanceof Error ? _error.message : 'Unknown error';
      // console.error("💥 Daniel Integration Failed:", errorMsg);
      
      return {
        success: false,
        loaded: 0,
        errors: [errorMsg],
        summary: {}
      };
    }
  }
  
  /**
   * Get integration status and statistics
   */
  async getIntegrationStatus() {
    try {
      const totalCount = await db.select().from(destinations_enhanced);
      
      // Count by category
      const stats = {
        total: totalCount.length,
        downtown_nearby: totalCount.filter(d => d.category_downtown_nearby).length,
        epic_adventures: totalCount.filter(d => d.category_epic_adventures).length,
        natural_wonders: totalCount.filter(d => d.category_natural_wonders).length,
        ski_country: totalCount.filter(d => d.category_ski_country).length,
        national_parks: totalCount.filter(d => d.category_national_parks).length,
        ultimate_escapes: totalCount.filter(d => d.category_ultimate_escapes).length,
        with_photos: totalCount.filter(d => d.cover_photo_url).length,
        ai_enriched: totalCount.filter(d => d.ai_enriched).length
      };
      
      return {
        success: true,
        stats,
        photoCoverage: ((stats.with_photos / stats.total) * 100).toFixed(1),
        aiCoverage: ((stats.ai_enriched / stats.total) * 100).toFixed(1)
      };
      
    } catch (_error) {
      return {
        success: false,
        error: _error instanceof Error ? _error.message : 'Unknown error'
      };
    }
  }
}

export const danielIntegration = new DanielIntegration();