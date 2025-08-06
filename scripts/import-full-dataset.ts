/**
 * Full Dataset Import System
 * Imports all 992 destinations from CSV files to PostgreSQL
 */

import fs from 'fs';
import path from 'path';
import { pool } from '../server/db';
import { parse } from 'csv-parse/sync';

interface CSVDestination {
  id: string;
  name: string;
  slug: string;
  latitude: string;
  longitude: string;
  county: string;
  region: string;
  category: string;
  created_at: string;
  updated_at: string;
  subcategory?: string;
  is_verified: string;
}

interface CSVContent {
  id: string;
  title: string;
  description_short: string;
  description_long: string;
  address: string;
  website: string;
  phone: string;
  cover_photo_url: string;
  cover_photo_alt_text: string;
}

export class FullDatasetImport {
  private destinationsFile = path.join(process.cwd(), 'attached_assets', 'destinations_rows (6)_1752208372644.csv');
  private contentFile = path.join(process.cwd(), 'attached_assets', 'destination_content_rows_1752208372644.csv');

  /**
   * Import all destinations from CSV files
   */
  async importFullDataset(): Promise<{
    success: boolean;
    imported: number;
    skipped: number;
    errors: string[];
  }> {
    // console.log('🚀 Starting full dataset import...');
    // console.log('=' .repeat(60));

    const result = {
      success: false,
      imported: 0,
      skipped: 0,
      errors: [] as string[]
    };

    try {
      // Read and parse destinations CSV
      const destinationsData = fs.readFileSync(this.destinationsFile, 'utf8');
      const destinations: CSVDestination[] = parse(destinationsData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ','
      });

      // Read and parse content CSV
      const contentData = fs.readFileSync(this.contentFile, 'utf8');
      const contents: CSVContent[] = parse(contentData, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ','
      });

      // Create content lookup
      const contentLookup = new Map<string, CSVContent>();
      contents.forEach(content => {
        contentLookup.set(content.id, content);
      });

      // console.log(`📊 Found ${destinations.length} destinations to import`);
      // console.log(`📊 Found ${contents.length} content records`);

      // Process destinations in batches
      const batchSize = 50;
      for (let i = 0; i < destinations.length; i += batchSize) {
        const batch = destinations.slice(i, i + batchSize);
        // console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(destinations.length / batchSize)}`);
        
        for (const destination of batch) {
          try {
            const content = contentLookup.get(destination.id);
            await this.importDestination(destination, content);
            result.imported++;
            // console.log(`✅ Imported: ${destination.name}`);
          } catch (_error) {
            result.skipped++;
            const errorMsg = `❌ Error importing ${destination.name}: ${(error as Error).message}`;
            // console.log(errorMsg);
            result.errors.push(errorMsg);
          }
        }
      }

      result.success = true;
      // console.log('\n' + '='.repeat(60));
      // console.log('🎯 Full dataset import completed!');
      // console.log(`📊 Total imported: ${result.imported}`);
      // console.log(`⚠️  Skipped: ${result.skipped}`);
      // console.log(`❌ Errors: ${result.errors.length}`);

      return result;
    } catch (_error) {
      // console.error('❌ Full dataset import failed:', error);
      result.errors.push(`Import failed: ${(error as Error).message}`);
      return result;
    }
  }

  /**
   * Import a single destination with content
   */
  private async importDestination(destination: CSVDestination, content?: CSVContent): Promise<void> {
    const insertQuery = `
      INSERT INTO destinations (
        external_id, name, category, drive_time, distance, 
        address, coordinates, phone, website, description,
        photos, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
      ON CONFLICT (external_id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        drive_time = EXCLUDED.drive_time,
        distance = EXCLUDED.distance,
        address = EXCLUDED.address,
        coordinates = EXCLUDED.coordinates,
        phone = EXCLUDED.phone,
        website = EXCLUDED.website,
        description = EXCLUDED.description,
        updated_at = EXCLUDED.updated_at
    `;

    // Calculate drive time from category
    const driveTime = this.calculateDriveTime(destination.category);
    
    // Create coordinates object
    const coordinates = {
      lat: parseFloat(destination.latitude),
      lng: parseFloat(destination.longitude)
    };

    // Create placeholder photo if content has one
    let photos = null;
    if (content?.cover_photo_url) {
      photos = [{
        url: content.cover_photo_url,
        alt_text: content.cover_photo_alt_text || destination.name,
        caption: destination.name,
        source: 'CSV Import',
        is_primary: true,
        uploaded_at: new Date().toISOString()
      }];
    }

    await pool.query(insertQuery, [
      destination.id,
      destination.name,
      destination.category,
      driveTime,
      null, // distance - will be calculated later
      content?.address || '',
      JSON.stringify(coordinates),
      content?.phone || '',
      content?.website || '',
      content?.description_short || content?.description_long || '',
      photos ? JSON.stringify(photos) : null,
      new Date(destination.created_at),
      new Date(destination.updated_at)
    ]);
  }

  /**
   * Calculate drive time from category
   */
  private calculateDriveTime(category: string): number {
    const categoryMappings: { [key: string]: number } = {
      'Downtown & Nearby': 30,
      '30 MIN': 30,
      'Less than 90 Minutes': 60,
      '1-2 HRS': 90,
      'Less than 3 Hours': 150,
      '3-4 HRS': 210,
      'Less than 5 Hours': 270,
      '5-7 HRS': 360,
      'Less than 8 Hours': 450,
      '8-11 HRS': 540,
      'Less than 12 Hours': 630,
      '12+ HRS': 720,
      'A little bit farther': 840
    };

    return categoryMappings[category] || 120;
  }

  /**
   * Get import statistics
   */
  async getImportStats(): Promise<{
    totalDestinations: number;
    withPhotos: number;
    categoryCounts: { [key: string]: number };
  }> {
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM destinations');
    const photosResult = await pool.query(`
      SELECT COUNT(*) as with_photos 
      FROM destinations 
      WHERE photos IS NOT NULL AND photos != '[]'
    `);
    const categoryResult = await pool.query(`
      SELECT category, COUNT(*) as count 
      FROM destinations 
      GROUP BY category 
      ORDER BY count DESC
    `);

    const categoryCounts: { [key: string]: number } = {};
    categoryResult.rows.forEach(row => {
      categoryCounts[row.category] = parseInt(row.count);
    });

    return {
      totalDestinations: parseInt(totalResult.rows[0].total),
      withPhotos: parseInt(photosResult.rows[0].with_photos),
      categoryCounts
    };
  }
}

export const fullDatasetImport = new FullDatasetImport();