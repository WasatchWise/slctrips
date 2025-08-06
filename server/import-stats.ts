/**
 * Import Statistics Module for SLC Trips
 * Provides comprehensive analytics and reporting for data import operations
 */

import { storage } from './storage';

interface ImportStats {
  totalImports: number;
  successfulImports: number;
  failedImports: number;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  averageProcessingTime: number;
  lastImportDate?: Date;
  importHistory: ImportHistoryEntry[];
  categoryBreakdown: CategoryStats[];
  errorAnalysis: ErrorAnalysis[];
  performanceMetrics: PerformanceMetrics;
}

interface ImportHistoryEntry {
  id: string;
  timestamp: Date;
  status: 'completed' | 'failed' | 'partial';
  recordsProcessed: number;
  recordsSuccessful: number;
  recordsFailed: number;
  processingTime: number;
  source: string;
  errors: string[];
  warnings: string[];
}

interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
  withPhotos: number;
  withoutPhotos: number;
  averageDriveTime: number;
  lastUpdated: Date;
}

interface ErrorAnalysis {
  errorType: string;
  count: number;
  percentage: number;
  examples: string[];
  recommendations: string[];
}

interface PerformanceMetrics {
  averageImportTime: number;
  fastestImport: number;
  slowestImport: number;
  averageRecordsPerMinute: number;
  peakPerformance: number;
  reliabilityScore: number;
}

interface DataQualityMetrics {
  totalDestinations: number;
  completeRecords: number;
  incompleteRecords: number;
  duplicateRecords: number;
  invalidCoordinates: number;
  missingPhotos: number;
  qualityScore: number;
  fieldCompleteness: FieldCompleteness;
}

interface FieldCompleteness {
  name: number;
  address: number;
  description: number;
  category: number;
  drive_time: number;
  coordinates: number;
  photos: number;
  website: number;
  phone: number;
  hours: number;
  price_range: number;
  accessibility: number;
  pet_friendly: number;
  kid_friendly: number;
  seasonal: number;
  best_time: number;
  difficulty: number;
  length: number;
  elevation_gain: number;
  permit_required: number;
  mt_olympus_character: number;
  mt_olympus_abilities: number;
}

export class ImportStatsModule {
  private statsCache: ImportStats | null = null;
  private cacheExpiry: Date | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {}

  /**
   * Get comprehensive import statistics
   */
  async getImportStatistics(): Promise<ImportStats> {
    // Check cache first
    if (this.statsCache && this.cacheExpiry && new Date() < this.cacheExpiry) {
      return this.statsCache;
    }

    const stats = await this.calculateImportStatistics();
    
    // Update cache
    this.statsCache = stats;
    this.cacheExpiry = new Date(Date.now() + this.CACHE_DURATION);
    
    return stats;
  }

  /**
   * Calculate comprehensive import statistics
   */
  private async calculateImportStatistics(): Promise<ImportStats> {
    const { pool } = await import('./db');

    // Get basic import counts
    const importCounts = await this.getImportCounts();
    
    // Get import history
    const importHistory = await this.getImportHistory();
    
    // Get category breakdown
    const categoryBreakdown = await this.getCategoryBreakdown();
    
    // Get error analysis
    const errorAnalysis = await this.getErrorAnalysis();
    
    // Get performance metrics
    const performanceMetrics = await this.getPerformanceMetrics();

    return {
      ...importCounts,
      importHistory,
      categoryBreakdown,
      errorAnalysis,
      performanceMetrics
    };
  }

  /**
   * Get basic import counts
   */
  private async getImportCounts(): Promise<{
    totalImports: number;
    successfulImports: number;
    failedImports: number;
    totalRecords: number;
    successfulRecords: number;
    failedRecords: number;
    averageProcessingTime: number;
    lastImportDate?: Date;
  }> {
    const { pool } = await import('./db');

    // Get total destinations count
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM destinations');
    const totalRecords = parseInt(totalResult.rows[0].total);

    // Get destinations with photos
    const withPhotosResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM destinations 
      WHERE photos IS NOT NULL 
        AND photos != '[]'::jsonb 
        AND jsonb_array_length(photos) > 0
    `);
    const successfulRecords = parseInt(withPhotosResult.rows[0].count);

    // Get last import date
    const lastImportResult = await pool.query(`
      SELECT MAX(created_at) as last_import 
      FROM destinations
    `);
    const lastImportDate = lastImportResult.rows[0].last_import;

    // Calculate averages (simplified for now)
    const totalImports = 1; // This would come from import logs
    const successfulImports = 1;
    const failedImports = 0;
    const averageProcessingTime = 0;

    return {
      totalImports,
      successfulImports,
      failedImports,
      totalRecords,
      successfulRecords,
      failedRecords: totalRecords - successfulRecords,
      averageProcessingTime,
      lastImportDate
    };
  }

  /**
   * Get import history
   */
  private async getImportHistory(): Promise<ImportHistoryEntry[]> {
    // This would typically come from a dedicated import_logs table
    // For now, we'll create a mock entry based on current data
    const { pool } = await import('./db');
    
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM destinations');
    const totalRecords = parseInt(totalResult.rows[0].total);

    const withPhotosResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM destinations 
      WHERE photos IS NOT NULL 
        AND photos != '[]'::jsonb 
        AND jsonb_array_length(photos) > 0
    `);
    const successfulRecords = parseInt(withPhotosResult.rows[0].count);

    return [{
      id: 'import-001',
      timestamp: new Date(),
      status: 'completed',
      recordsProcessed: totalRecords,
      recordsSuccessful: successfulRecords,
      recordsFailed: totalRecords - successfulRecords,
      processingTime: 0,
      source: 'manual_import',
      errors: [],
      warnings: []
    }];
  }

  /**
   * Get category breakdown
   */
  private async getCategoryBreakdown(): Promise<CategoryStats[]> {
    const { pool } = await import('./db');

    const result = await pool.query(`
      SELECT 
        category,
        COUNT(*) as count,
        COUNT(CASE WHEN photos IS NOT NULL AND photos != '[]'::jsonb AND jsonb_array_length(photos) > 0 THEN 1 END) as with_photos,
        COUNT(CASE WHEN photos IS NULL OR photos = '[]'::jsonb OR jsonb_array_length(photos) = 0 THEN 1 END) as without_photos,
        AVG(drive_time) as avg_drive_time,
        MAX(updated_at) as last_updated
      FROM destinations 
      WHERE category IS NOT NULL
      GROUP BY category 
      ORDER BY count DESC
    `);

    const total = result.rows.reduce((sum, row) => sum + parseInt(row.count), 0);

    return result.rows.map(row => ({
      category: row.category,
      count: parseInt(row.count),
      percentage: (parseInt(row.count) / total) * 100,
      withPhotos: parseInt(row.with_photos),
      withoutPhotos: parseInt(row.without_photos),
      averageDriveTime: parseFloat(row.avg_drive_time) || 0,
      lastUpdated: new Date(row.last_updated)
    }));
  }

  /**
   * Get error analysis
   */
  private async getErrorAnalysis(): Promise<ErrorAnalysis[]> {
    // This would analyze actual error logs
    // For now, we'll provide common error patterns
    return [
      {
        errorType: 'Missing Photos',
        count: 0, // Would be calculated from actual data
        percentage: 0,
        examples: ['Destination has no photos', 'Photo URLs are invalid'],
        recommendations: ['Run photo enrichment process', 'Check Google Places API quota']
      },
      {
        errorType: 'Invalid Coordinates',
        count: 0,
        percentage: 0,
        examples: ['Coordinates format is incorrect', 'Coordinates are out of bounds'],
        recommendations: ['Validate coordinate format', 'Check coordinate ranges']
      },
      {
        errorType: 'Duplicate Records',
        count: 0,
        percentage: 0,
        examples: ['Same destination with different names', 'Same location with different addresses'],
        recommendations: ['Implement duplicate detection', 'Use fuzzy matching for names']
      }
    ];
  }

  /**
   * Get performance metrics
   */
  private async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    // This would calculate from actual import logs
    return {
      averageImportTime: 0,
      fastestImport: 0,
      slowestImport: 0,
      averageRecordsPerMinute: 0,
      peakPerformance: 0,
      reliabilityScore: 100 // Would be calculated from success/failure rates
    };
  }

  /**
   * Get data quality metrics
   */
  async getDataQualityMetrics(): Promise<DataQualityMetrics> {
    const { pool } = await import('./db');

    // Get total destinations
    const totalResult = await pool.query('SELECT COUNT(*) as total FROM destinations');
    const totalDestinations = parseInt(totalResult.rows[0].total);

    // Get field completeness
    const fieldCompleteness = await this.getFieldCompleteness(totalDestinations);

    // Calculate quality score
    const qualityScore = this.calculateQualityScore(fieldCompleteness);

    // Get other metrics
    const duplicateResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM (
        SELECT name, address, COUNT(*) 
        FROM destinations 
        GROUP BY name, address 
        HAVING COUNT(*) > 1
      ) as duplicates
    `);
    const duplicateRecords = parseInt(duplicateResult.rows[0].count);

    const invalidCoordsResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM destinations 
      WHERE coordinates IS NOT NULL 
        AND coordinates != ''
        AND (
          coordinates !~ '^-?[0-9]+\.?[0-9]*,-?[0-9]+\.?[0-9]*$'
          OR coordinates = '0,0'
        )
    `);
    const invalidCoordinates = parseInt(invalidCoordsResult.rows[0].count);

    const missingPhotosResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM destinations 
      WHERE photos IS NULL 
        OR photos = '[]'::jsonb 
        OR jsonb_array_length(photos) = 0
    `);
    const missingPhotos = parseInt(missingPhotosResult.rows[0].count);

    const completeRecords = totalDestinations - duplicateRecords - invalidCoordinates;
    const incompleteRecords = totalDestinations - completeRecords;

    return {
      totalDestinations,
      completeRecords,
      incompleteRecords,
      duplicateRecords,
      invalidCoordinates,
      missingPhotos,
      qualityScore,
      fieldCompleteness
    };
  }

  /**
   * Get field completeness statistics
   */
  private async getFieldCompleteness(totalDestinations: number): Promise<FieldCompleteness> {
    const { pool } = await import('./db');

    const fields = [
      'name', 'address', 'description', 'category', 'drive_time', 'coordinates',
      'photos', 'website', 'phone', 'hours', 'price_range', 'accessibility',
      'pet_friendly', 'kid_friendly', 'seasonal', 'best_time', 'difficulty',
      'length', 'elevation_gain', 'permit_required', 'mt_olympus_character',
      'mt_olympus_abilities'
    ];

    const completeness: any = {};

    for (const field of fields) {
      const result = await pool.query(`
        SELECT COUNT(*) as count 
        FROM destinations 
        WHERE ${field} IS NOT NULL 
          AND ${field} != ''
          AND ${field} != '[]'::jsonb
      `);
      
      const count = parseInt(result.rows[0].count);
      completeness[field] = (count / totalDestinations) * 100;
    }

    return completeness as FieldCompleteness;
  }

  /**
   * Calculate overall quality score
   */
  private calculateQualityScore(fieldCompleteness: FieldCompleteness): number {
    const weights = {
      name: 1.0,           // Required
      address: 0.8,        // Important
      description: 0.7,    // Important
      category: 0.9,       // Very important
      drive_time: 0.9,     // Very important
      coordinates: 0.8,    // Important
      photos: 0.6,         // Nice to have
      website: 0.5,        // Nice to have
      phone: 0.4,          // Nice to have
      hours: 0.4,          // Nice to have
      price_range: 0.3,    // Nice to have
      accessibility: 0.3,  // Nice to have
      pet_friendly: 0.2,   // Nice to have
      kid_friendly: 0.2,   // Nice to have
      seasonal: 0.2,       // Nice to have
      best_time: 0.3,      // Nice to have
      difficulty: 0.4,     // Nice to have
      length: 0.3,         // Nice to have
      elevation_gain: 0.2, // Nice to have
      permit_required: 0.2, // Nice to have
      mt_olympus_character: 0.1, // Nice to have
      mt_olympus_abilities: 0.1  // Nice to have
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [field, weight] of Object.entries(weights)) {
      const completeness = fieldCompleteness[field as keyof FieldCompleteness] || 0;
      totalScore += (completeness / 100) * weight;
      totalWeight += weight;
    }

    return (totalScore / totalWeight) * 100;
  }

  /**
   * Get import trends over time
   */
  async getImportTrends(days: number = 30): Promise<{
    dates: string[];
    counts: number[];
    successRates: number[];
  }> {
    const { pool } = await import('./db');

    const result = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count,
        COUNT(CASE WHEN photos IS NOT NULL AND photos != '[]'::jsonb AND jsonb_array_length(photos) > 0 THEN 1 END) as with_photos
      FROM destinations 
      WHERE created_at >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);

    const dates: string[] = [];
    const counts: number[] = [];
    const successRates: number[] = [];

    result.rows.forEach(row => {
      dates.push(row.date);
      counts.push(parseInt(row.count));
      const successRate = parseInt(row.count) > 0 ? (parseInt(row.with_photos) / parseInt(row.count)) * 100 : 0;
      successRates.push(successRate);
    });

    return { dates, counts, successRates };
  }

  /**
   * Clear statistics cache
   */
  clearCache(): void {
    this.statsCache = null;
    this.cacheExpiry = null;
  }

  /**
   * Generate import report
   */
  async generateImportReport(): Promise<{
    summary: string;
    details: any;
    recommendations: string[];
  }> {
    const stats = await this.getImportStatistics();
    const qualityMetrics = await this.getDataQualityMetrics();

    const summary = `
      Import Statistics Summary:
      - Total Destinations: ${stats.totalRecords}
      - Successful Records: ${stats.successfulRecords}
      - Failed Records: ${stats.failedRecords}
      - Data Quality Score: ${qualityMetrics.qualityScore.toFixed(1)}%
      - Categories: ${stats.categoryBreakdown.length}
      - Last Import: ${stats.lastImportDate ? stats.lastImportDate.toLocaleDateString() : 'Never'}
    `;

    const recommendations = this.generateRecommendations(stats, qualityMetrics);

    return {
      summary: summary.trim(),
      details: { stats, qualityMetrics },
      recommendations
    };
  }

  /**
   * Generate recommendations based on statistics
   */
  private generateRecommendations(stats: ImportStats, qualityMetrics: DataQualityMetrics): string[] {
    const recommendations: string[] = [];

    if (qualityMetrics.missingPhotos > 0) {
      recommendations.push(`Run photo enrichment for ${qualityMetrics.missingPhotos} destinations without photos`);
    }

    if (qualityMetrics.duplicateRecords > 0) {
      recommendations.push(`Review and resolve ${qualityMetrics.duplicateRecords} duplicate records`);
    }

    if (qualityMetrics.invalidCoordinates > 0) {
      recommendations.push(`Fix coordinates for ${qualityMetrics.invalidCoordinates} destinations`);
    }

    if (qualityMetrics.qualityScore < 80) {
      recommendations.push('Improve data completeness by filling missing required fields');
    }

    if (stats.categoryBreakdown.length < 5) {
      recommendations.push('Add more destination categories for better organization');
    }

    return recommendations;
  }
}

// Export singleton instance
export const importStats = new ImportStatsModule(); 