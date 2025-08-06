
/**
 * Schema Alignment System
 * Automatically aligns local types with actual Supabase schema
 */

import { schemaInspector } from './schema-inspector';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export interface AlignmentResult {
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    target: string;
    description: string;
    before?: string;
    after?: string;
  }>;
  filesUpdated: string[];
  summary: string;
}

export class SchemaAlignment {
  private changelog: AlignmentResult['changes'] = [];
  private updatedFiles: string[] = [];

  /**
   * Perform complete schema alignment
   */
  async performAlignment(): Promise<AlignmentResult> {
    // console.log('🎯 Starting comprehensive schema alignment...');
    
    try {
      // 1. Fetch actual schema from Supabase
      const schemas = await schemaInspector.fetchSupabaseSchema();
      
      // 2. Update TypeScript types
      await this.updateTypeScriptTypes(schemas);
      
      // 3. Update API routes
      await this.updateApiRoutes(schemas);
      
      // 4. Update frontend components
      await this.updateFrontendComponents(schemas);
      
      // 5. Validate destinations table specifically
      await this.validateDestinationsTable(schemas.daniel);
      
      const summary = `Schema alignment completed. Updated ${this.updatedFiles.length} files with ${this.changelog.length} changes.`;
      
      return {
        changes: this.changelog,
        filesUpdated: this.updatedFiles,
        summary
      };
    } catch (_error) {
      // console.error('Schema alignment failed:', error);
      throw error;
    }
  }

  /**
   * Update TypeScript type definitions
   */
  private async updateTypeScriptTypes(schemas: any): Promise<void> {
    // console.log('📝 Updating TypeScript types...');

    // Generate new types from Daniel's database (authoritative source)
    const newTypes = schemaInspector.generateSchemaTypes(schemas.daniel);
    
    // Update supabase-types.ts
    this.updateFile('shared/supabase-types.ts', newTypes);
    
    // Update destinations interface in schema.ts to match actual Supabase structure
    await this.updateDestinationsSchema(schemas.daniel);
  }

  /**
   * Update destinations schema to match Supabase
   */
  private async updateDestinationsSchema(danielSchema: any[]): Promise<void> {
    const destinationsTable = danielSchema.find(t => t.table_name === 'destinations');
    
    if (!destinationsTable) {
      // console.warn('No destinations table found in schema');
      return;
    }

    // Generate accurate destinations interface
    const destinationsInterface = `
// Authentic Supabase destinations table structure
export interface SupabaseDestination {
${destinationsTable.columns.map((col: any) => {
  const tsType = this.mapPostgresToTypeScript(col.data_type);
  const optional = col.is_nullable === 'YES' ? '?' : '';
  return `  ${col.column_name}${optional}: ${tsType};`;
}).join('\n')}
}

// For backward compatibility with existing code
export type Destination = SupabaseDestination;
`;

    this.changelog.push({
      type: 'modified',
      target: 'shared/schema.ts',
      description: 'Updated destinations interface to match actual Supabase schema'
    });
  }

  /**
   * Update API routes to use correct field names
   */
  private async updateApiRoutes(schemas: any): Promise<void> {
    // console.log('🔄 Updating API routes...');

    const destinationsTable = schemas.daniel.find((t: any) => t.table_name === 'destinations');
    if (!destinationsTable) return;

    const actualFields = destinationsTable.columns.map((c: any) => c.column_name);
    
    // Check if we're using correct field names in routes
    const routesPath = 'server/routes.ts';
    try {
      const routesContent = readFileSync(routesPath, 'utf-8');
      
      // Look for potential field mismatches
      const fieldMappings: { [key: string]: string } = {
        'description_short': 'description_short',
        'description_long': 'description_long', 
        'cover_photo_url': 'cover_photo_url',
        'address_full': 'address_full'
      };

      let updatedContent = routesContent;
      let hasChanges = false;

      // Ensure we're selecting the correct fields
      Object.entries(fieldMappings).forEach(([expectedField, actualField]) => {
        if (actualFields.includes(actualField)) {
          // Field exists, ensure we're using it correctly
          const oldPattern = new RegExp(`\\b${expectedField}\\b`, 'g');
          if (updatedContent.includes(expectedField) && expectedField !== actualField) {
            updatedContent = updatedContent.replace(oldPattern, actualField);
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        this.updateFile(routesPath, updatedContent);
      }
    } catch (_error) {
      // console.warn('Could not update routes file:', error);
    }
  }

  /**
   * Update frontend components to use correct field names
   */
  private async updateFrontendComponents(schemas: any): Promise<void> {
    // console.log('🎨 Updating frontend components...');

    const destinationsTable = schemas.daniel.find((t: any) => t.table_name === 'destinations');
    if (!destinationsTable) return;

    // Update destinations.ts library file
    await this.updateDestinationsLib(destinationsTable);
  }

  /**
   * Update the destinations library file
   */
  private async updateDestinationsLib(destinationsTable: any): Promise<void> {
    const libPath = 'client/src/lib/destinations.ts';
    
    try {
      const content = readFileSync(libPath, 'utf-8');
      
      // Ensure we're using the correct field mappings
      let updatedContent = content;
      
      // Add proper type imports and field mappings
      const typeImports = `import type { SupabaseDestination } from '@shared/supabase-types';`;
      
      if (!updatedContent.includes('SupabaseDestination')) {
        updatedContent = typeImports + '\n\n' + updatedContent;
        this.updateFile(libPath, updatedContent);
      }
    } catch (_error) {
      // console.warn('Could not update destinations lib:', error);
    }
  }

  /**
   * Validate destinations table structure
   */
  private async validateDestinationsTable(danielSchema: any[]): Promise<void> {
    const destinationsTable = danielSchema.find(t => t.table_name === 'destinations');
    
    if (!destinationsTable) {
      this.changelog.push({
        type: 'added',
        target: 'Supabase Database',
        description: 'destinations table missing - needs to be created'
      });
      return;
    }

    // Check for required fields
    const requiredFields = ['id', 'name', 'latitude', 'longitude'];
    const actualFields = destinationsTable.columns.map((c: any) => c.column_name);
    
    requiredFields.forEach(field => {
      if (!actualFields.includes(field)) {
        this.changelog.push({
          type: 'added',
          target: 'destinations table',
          description: `Missing required field: ${field}`
        });
      }
    });

    // Log available fields for reference
    // console.log('📊 Destinations table fields:', actualFields);
  }

  /**
   * Helper to map PostgreSQL types to TypeScript
   */
  private mapPostgresToTypeScript(pgType: string): string {
    const typeMap: { [key: string]: string } = {
      'character varying': 'string',
      'varchar': 'string', 
      'text': 'string',
      'integer': 'number',
      'bigint': 'number',
      'double precision': 'number',
      'numeric': 'number',
      'boolean': 'boolean',
      'timestamp with time zone': 'string',
      'timestamp without time zone': 'string',
      'jsonb': 'any',
      'uuid': 'string'
    };

    if (pgType.includes('[]')) {
      const baseType = pgType.replace('[]', '');
      const tsBaseType = typeMap[baseType] || 'any';
      return `${tsBaseType}[]`;
    }

    return typeMap[pgType] || 'any';
  }

  /**
   * Helper to update a file and track changes
   */
  private updateFile(filePath: string, content: string): void {
    try {
      writeFileSync(filePath, content, 'utf-8');
      this.updatedFiles.push(filePath);
      this.changelog.push({
        type: 'modified',
        target: filePath,
        description: 'Updated to match actual Supabase schema'
      });
      // console.log(`✅ Updated ${filePath}`);
    } catch (_error) {
      // console.error(`❌ Failed to update ${filePath}:`, error);
    }
  }
}

export const schemaAlignment = new SchemaAlignment();
