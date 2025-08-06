/**
 * Full Dataset Import Module for SLC Trips
 * Handles comprehensive data import from CSV files with validation and error handling
 */

import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { storage } from './storage';

interface ImportProgress {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  current: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  errors: string[];
  warnings: string[];
  results: ImportResult[];
}

interface ImportResult {
  row: number;
  data: any;
  success: boolean;
  reason: string;
  timestamp: Date;
}

interface ImportOptions {
  filePath?: string;
  csvData?: string;
  validateOnly?: boolean;
  batchSize?: number;
  skipDuplicates?: boolean;
  updateExisting?: boolean;
  categories?: string[];
  driveTimeFilter?: number;
}

interface DestinationData {
  name: string;
  address?: string;
  description?: string;
  category?: string;
  drive_time?: number;
  coordinates?: string;
  photos?: string;
  website?: string;
  phone?: string;
  hours?: string;
  price_range?: string;
  accessibility?: string;
  pet_friendly?: boolean;
  kid_friendly?: boolean;
  seasonal?: boolean;
  best_time?: string;
  difficulty?: string;
  length?: string;
  elevation_gain?: string;
  permit_required?: boolean;
  mt_olympus_character?: string;
  mt_olympus_abilities?: string;
}

export class FullDatasetImport {
  private progress: ImportProgress;
  private isRunning = false;
  private shouldPause = false;

  constructor() {
    this.progress = {
      total: 0,
      processed: 0,
      successful: 0,
      failed: 0,
      current: '',
      status: 'idle',
      errors: [],
      warnings: [],
      results: []
    };
  }

  /**
   * Get current import progress
   */
  getProgress(): ImportProgress {
    return { ...this.progress };
  }

  /**
   * Start full dataset import process
   */
  async startImport(options: ImportOptions = {}): Promise<{ success: boolean; message: string }> {
    if (this.isRunning) {
      return { success: false, message: 'Import already running' };
    }

    const {
      filePath,
      csvData,
      validateOnly = false,
      batchSize = 50,
      skipDuplicates = true,
      updateExisting = false,
      categories = [],
      driveTimeFilter
    } = options;

    try {
      this.isRunning = true;
      this.shouldPause = false;
      this.progress = {
        total: 0,
        processed: 0,
        successful: 0,
        failed: 0,
        current: '',
        status: 'running',
        startTime: new Date(),
        errors: [],
        warnings: [],
        results: []
      };

      // Parse CSV data
      const records = await this.parseCSVData(filePath, csvData);
      this.progress.total = records.length;

      if (records.length === 0) {
        this.progress.status = 'completed';
        this.progress.endTime = new Date();
        return { success: true, message: 'No data to import' };
      }

      // Validate data structure
      const validationResult = await this.validateDataStructure(records);
      if (!validationResult.valid) {
        this.progress.status = 'error';
        this.progress.errors.push(`Data validation failed: ${validationResult.reason}`);
        return { success: false, message: validationResult.reason };
      }

      // Process records in batches
      for (let i = 0; i < records.length; i += batchSize) {
        if (this.shouldPause) {
          this.progress.status = 'paused';
          return { success: true, message: 'Import paused' };
        }

        const batch = records.slice(i, i + batchSize);
        
        for (const [index, record] of batch.entries()) {
          if (this.shouldPause) {
            this.progress.status = 'paused';
            return { success: true, message: 'Import paused' };
          }

          const rowNumber = i + index + 1;
          this.progress.current = `Row ${rowNumber}: ${record.name || 'Unknown'}`;
          
          try {
            // Validate individual record
            const recordValidation = this.validateRecord(record);
            if (!recordValidation.valid) {
              this.progress.failed++;
              this.progress.errors.push(`Row ${rowNumber}: ${recordValidation.reason}`);
              this.progress.results.push({
                row: rowNumber,
                data: record,
                success: false,
                reason: recordValidation.reason,
                timestamp: new Date()
              });
              continue;
            }

            // Apply filters
            if (categories.length > 0 && !categories.includes(record.category)) {
              this.progress.warnings.push(`Row ${rowNumber}: Skipped - category not in filter`);
              continue;
            }

            if (driveTimeFilter && record.drive_time > driveTimeFilter) {
              this.progress.warnings.push(`Row ${rowNumber}: Skipped - drive time exceeds filter`);
              continue;
            }

            // Import record if not in validate-only mode
            if (!validateOnly) {
              const importResult = await this.importRecord(record, {
                skipDuplicates,
                updateExisting
              });

              if (importResult.success) {
                this.progress.successful++;
              } else {
                this.progress.failed++;
                this.progress.errors.push(`Row ${rowNumber}: ${importResult.reason}`);
              }

              this.progress.results.push({
                row: rowNumber,
                data: record,
                success: importResult.success,
                reason: importResult.reason,
                timestamp: new Date()
              });
            } else {
              this.progress.successful++;
            }

            this.progress.processed++;

          } catch (error: any) {
            this.progress.failed++;
            this.progress.errors.push(`Row ${rowNumber}: ${error.message}`);
            this.progress.processed++;
          }
        }
      }

      this.progress.status = 'completed';
      this.progress.endTime = new Date();
      this.isRunning = false;

      const message = validateOnly 
        ? `Validation completed. Processed: ${this.progress.processed}, Valid: ${this.progress.successful}, Invalid: ${this.progress.failed}`
        : `Import completed. Processed: ${this.progress.processed}, Successful: ${this.progress.successful}, Failed: ${this.progress.failed}`;

      return { success: true, message };

    } catch (error: any) {
      this.progress.status = 'error';
      this.progress.errors.push(`Import failed: ${error.message}`);
      this.isRunning = false;
      return { success: false, message: error.message };
    }
  }

  /**
   * Parse CSV data from file or string
   */
  private async parseCSVData(filePath?: string, csvData?: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const records: any[] = [];

      if (filePath) {
        // Read from file
        if (!fs.existsSync(filePath)) {
          reject(new Error(`File not found: ${filePath}`));
          return;
        }

        fs.createReadStream(filePath)
          .pipe(parse({
            columns: true,
            skip_empty_lines: true,
            trim: true
          }))
          .on('data', (record) => records.push(record))
          .on('end', () => resolve(records))
          .on('error', reject);
      } else if (csvData) {
        // Parse from string
        parse(csvData, {
          columns: true,
          skip_empty_lines: true,
          trim: true
        }, (err, records) => {
          if (err) reject(err);
          else resolve(records);
        });
      } else {
        reject(new Error('No file path or CSV data provided'));
      }
    });
  }

  /**
   * Validate data structure
   */
  private async validateDataStructure(records: any[]): Promise<{ valid: boolean; reason?: string }> {
    if (records.length === 0) {
      return { valid: false, reason: 'No records found' };
    }

    const firstRecord = records[0];
    const requiredFields = ['name'];
    const optionalFields = [
      'address', 'description', 'category', 'drive_time', 'coordinates',
      'photos', 'website', 'phone', 'hours', 'price_range', 'accessibility',
      'pet_friendly', 'kid_friendly', 'seasonal', 'best_time', 'difficulty',
      'length', 'elevation_gain', 'permit_required', 'mt_olympus_character',
      'mt_olympus_abilities'
    ];

    // Check required fields
    for (const field of requiredFields) {
      if (!firstRecord.hasOwnProperty(field)) {
        return { valid: false, reason: `Missing required field: ${field}` };
      }
    }

    // Check for unexpected fields
    const allFields = [...requiredFields, ...optionalFields];
    const unexpectedFields = Object.keys(firstRecord).filter(key => !allFields.includes(key));
    
    if (unexpectedFields.length > 0) {
      this.progress.warnings.push(`Unexpected fields found: ${unexpectedFields.join(', ')}`);
    }

    return { valid: true };
  }

  /**
   * Validate individual record
   */
  private validateRecord(record: any): { valid: boolean; reason?: string } {
    // Check required fields
    if (!record.name || record.name.trim() === '') {
      return { valid: false, reason: 'Name is required' };
    }

    // Validate drive time
    if (record.drive_time !== undefined && record.drive_time !== '') {
      const driveTime = parseFloat(record.drive_time);
      if (isNaN(driveTime) || driveTime < 0) {
        return { valid: false, reason: 'Invalid drive time' };
      }
    }

    // Validate coordinates if provided
    if (record.coordinates && record.coordinates.trim() !== '') {
      const coords = record.coordinates.split(',').map((c: string) => parseFloat(c.trim()));
      if (coords.length !== 2 || coords.some(isNaN)) {
        return { valid: false, reason: 'Invalid coordinates format (should be "lat,lng")' };
      }
    }

    // Validate boolean fields
    const booleanFields = ['pet_friendly', 'kid_friendly', 'seasonal', 'permit_required'];
    for (const field of booleanFields) {
      if (record[field] !== undefined && record[field] !== '') {
        const value = record[field].toLowerCase();
        if (!['true', 'false', '1', '0', 'yes', 'no'].includes(value)) {
          return { valid: false, reason: `Invalid boolean value for ${field}` };
        }
      }
    }

    return { valid: true };
  }

  /**
   * Import a single record
   */
  private async importRecord(record: any, options: {
    skipDuplicates: boolean;
    updateExisting: boolean;
  }): Promise<{ success: boolean; reason: string }> {
    const { pool } = await import('./db');

    try {
      // Check for existing record
      const existingResult = await pool.query(
        'SELECT id FROM destinations WHERE name = $1 AND address = $2',
        [record.name, record.address || null]
      );

      if (existingResult.rows.length > 0) {
        if (options.skipDuplicates) {
          return { success: true, reason: 'Skipped duplicate' };
        }
        
        if (options.updateExisting) {
          // Update existing record
          await this.updateDestination(existingResult.rows[0].id, record);
          return { success: true, reason: 'Updated existing record' };
        } else {
          return { success: false, reason: 'Duplicate record found' };
        }
      }

      // Insert new record
      await this.insertDestination(record);
      return { success: true, reason: 'Inserted new record' };

    } catch (error: any) {
      return { success: false, reason: error.message };
    }
  }

  /**
   * Insert new destination
   */
  private async insertDestination(record: any): Promise<void> {
    const { pool } = await import('./db');

    const query = `
      INSERT INTO destinations (
        name, address, description, category, drive_time, coordinates,
        photos, website, phone, hours, price_range, accessibility,
        pet_friendly, kid_friendly, seasonal, best_time, difficulty,
        length, elevation_gain, permit_required, mt_olympus_character,
        mt_olympus_abilities, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21, $22, NOW(), NOW()
      )
    `;

    const values = [
      record.name,
      record.address || null,
      record.description || null,
      record.category || null,
      record.drive_time ? parseFloat(record.drive_time) : null,
      record.coordinates || null,
      record.photos ? JSON.parse(record.photos) : null,
      record.website || null,
      record.phone || null,
      record.hours || null,
      record.price_range || null,
      record.accessibility || null,
      this.parseBoolean(record.pet_friendly),
      this.parseBoolean(record.kid_friendly),
      this.parseBoolean(record.seasonal),
      record.best_time || null,
      record.difficulty || null,
      record.length || null,
      record.elevation_gain || null,
      this.parseBoolean(record.permit_required),
      record.mt_olympus_character || null,
      record.mt_olympus_abilities || null
    ];

    await pool.query(query, values);
  }

  /**
   * Update existing destination
   */
  private async updateDestination(id: number, record: any): Promise<void> {
    const { pool } = await import('./db');

    const query = `
      UPDATE destinations SET
        address = $2, description = $3, category = $4, drive_time = $5,
        coordinates = $6, photos = $7, website = $8, phone = $9, hours = $10,
        price_range = $11, accessibility = $12, pet_friendly = $13,
        kid_friendly = $14, seasonal = $15, best_time = $16, difficulty = $17,
        length = $18, elevation_gain = $19, permit_required = $20,
        mt_olympus_character = $21, mt_olympus_abilities = $22, updated_at = NOW()
      WHERE id = $1
    `;

    const values = [
      id,
      record.address || null,
      record.description || null,
      record.category || null,
      record.drive_time ? parseFloat(record.drive_time) : null,
      record.coordinates || null,
      record.photos ? JSON.parse(record.photos) : null,
      record.website || null,
      record.phone || null,
      record.hours || null,
      record.price_range || null,
      record.accessibility || null,
      this.parseBoolean(record.pet_friendly),
      this.parseBoolean(record.kid_friendly),
      this.parseBoolean(record.seasonal),
      record.best_time || null,
      record.difficulty || null,
      record.length || null,
      record.elevation_gain || null,
      this.parseBoolean(record.permit_required),
      record.mt_olympus_character || null,
      record.mt_olympus_abilities || null
    ];

    await pool.query(query, values);
  }

  /**
   * Parse boolean value from string
   */
  private parseBoolean(value: any): boolean | null {
    if (value === undefined || value === null || value === '') {
      return null;
    }

    const str = value.toString().toLowerCase();
    return ['true', '1', 'yes'].includes(str);
  }

  /**
   * Pause the import process
   */
  pauseImport(): { success: boolean; message: string } {
    if (!this.isRunning) {
      return { success: false, message: 'No import running' };
    }

    this.shouldPause = true;
    return { success: true, message: 'Import will pause after current record' };
  }

  /**
   * Resume the import process
   */
  async resumeImport(): Promise<{ success: boolean; message: string }> {
    if (this.progress.status !== 'paused') {
      return { success: false, message: 'No paused import to resume' };
    }

    this.shouldPause = false;
    this.progress.status = 'running';
    
    // Continue with remaining records
    const remaining = this.progress.total - this.progress.processed;
    if (remaining > 0) {
      return this.startImport({ batchSize: 50 });
    }

    return { success: true, message: 'Import resumed' };
  }

  /**
   * Stop the import process
   */
  stopImport(): { success: boolean; message: string } {
    if (!this.isRunning) {
      return { success: false, message: 'No import running' };
    }

    this.shouldPause = true;
    this.isRunning = false;
    this.progress.status = 'idle';
    return { success: true, message: 'Import stopped' };
  }

  /**
   * Get import statistics
   */
  async getImportStatistics(): Promise<{
    totalDestinations: number;
    importProgress: ImportProgress;
    recentResults: ImportResult[];
    errorSummary: { [key: string]: number };
  }> {
    const { pool } = await import('./db');
    
    // Get total destinations count
    const countResult = await pool.query('SELECT COUNT(*) as total FROM destinations');
    const totalDestinations = parseInt(countResult.rows[0].total);

    // Analyze error patterns
    const errorSummary: { [key: string]: number } = {};
    this.progress.errors.forEach(error => {
      const key = error.split(':')[0] || 'Unknown';
      errorSummary[key] = (errorSummary[key] || 0) + 1;
    });

    return {
      totalDestinations,
      importProgress: this.getProgress(),
      recentResults: this.progress.results.slice(-20), // Last 20 results
      errorSummary
    };
  }

  /**
   * Clear import history
   */
  clearHistory(): { success: boolean; message: string } {
    this.progress.results = [];
    this.progress.errors = [];
    this.progress.warnings = [];
    return { success: true, message: 'Import history cleared' };
  }
}

// Export singleton instance
export const fullDatasetImport = new FullDatasetImport(); 