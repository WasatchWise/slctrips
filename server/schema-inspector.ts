
/**
 * Comprehensive Schema Inspector
 * Fetches actual Supabase schema and compares with local types
 */

import { createClient } from '@supabase/supabase-js';

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface TableInfo {
  table_name: string;
  columns: ColumnInfo[];
}

export class SchemaInspector {
  private supabase;
  private danielSupabase;

  constructor() {
    // Main Supabase instance
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    );

    // Daniel's database instance
    this.danielSupabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.DANIEL_SUPABASE_ANON_KEY!
    );
  }

  /**
   * Fetch complete schema from Supabase
   */
  async fetchSupabaseSchema(): Promise<{
    main: TableInfo[];
    daniel: TableInfo[];
  }> {
    // console.log('🔍 Fetching complete Supabase schema...');

    try {
      // Fetch schema from main database
      const { data: mainTables, error: mainError } = await this.supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');

      if (mainError) {
        // console.error('Main schema fetch error:', mainError);
        throw mainError;
      }

      // Fetch schema from Daniel's database
      const { data: danielTables, error: danielError } = await this.danielSupabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');

      if (danielError) {
        // console.error('Daniel schema fetch error:', danielError);
        throw danielError;
      }

      // Get detailed column information for each table
      const mainSchema = await this.getTableDetails(this.supabase, mainTables || []);
      const danielSchema = await this.getTableDetails(this.danielSupabase, danielTables || []);

      return {
        main: mainSchema,
        daniel: danielSchema
      };
    } catch (_error) {
      // console.error('Schema fetch failed:', error);
      throw error;
    }
  }

  /**
   * Get detailed column information for tables
   */
  private async getTableDetails(client: any, tables: any[]): Promise<TableInfo[]> {
    const tableDetails: TableInfo[] = [];

    for (const table of tables) {
      try {
        const { data: columns, error } = await client
          .from('information_schema.columns')
          .select(`
            column_name,
            data_type,
            is_nullable,
            column_default,
            character_maximum_length
          `)
          .eq('table_schema', 'public')
          .eq('table_name', table.table_name)
          .order('ordinal_position');

        if (error) {
          // console.warn(`Failed to fetch columns for ${table.table_name}:`, error);
          continue;
        }

        tableDetails.push({
          table_name: table.table_name,
          columns: columns || []
        });
      } catch (_error) {
        // console.warn(`Error processing table ${table.table_name}:`, error);
      }
    }

    return tableDetails;
  }

  /**
   * Compare schemas and identify mismatches
   */
  compareSchemas(actualSchema: TableInfo[], localTypes: any): {
    mismatches: any[];
    missing: any[];
    extra: any[];
    suggestions: string[];
  } {
    const mismatches: any[] = [];
    const missing: any[] = [];
    const extra: any[] = [];
    const suggestions: string[] = [];

    // Find destinations table in actual schema
    const destinationsTable = actualSchema.find(t => t.table_name === 'destinations');
    
    if (!destinationsTable) {
      missing.push({
        type: 'table',
        name: 'destinations',
        issue: 'Table not found in Supabase schema'
      });
      return { mismatches, missing, extra, suggestions };
    }

    // Expected fields based on current TypeScript types
    const expectedFields = [
      'id', 'name', 'slug', 'latitude', 'longitude', 'county', 'region',
      'category', 'subcategory', 'is_verified', 'place_id', 'created_at', 'updated_at'
    ];

    const actualFields = destinationsTable.columns.map(c => c.column_name);

    // Check for missing fields
    expectedFields.forEach(field => {
      if (!actualFields.includes(field)) {
        missing.push({
          type: 'column',
          table: 'destinations',
          name: field,
          issue: 'Expected field missing from Supabase schema'
        });
      }
    });

    // Check for extra fields not in our types
    actualFields.forEach(field => {
      if (!expectedFields.includes(field)) {
        extra.push({
          type: 'column',
          table: 'destinations',
          name: field,
          dataType: destinationsTable.columns.find(c => c.column_name === field)?.data_type,
          issue: 'Field exists in Supabase but not in local types'
        });
      }
    });

    return { mismatches, missing, extra, suggestions };
  }

  /**
   * Generate TypeScript interfaces from actual schema
   */
  generateTypeScriptInterfaces(schema: TableInfo[]): string {
    let interfaces = '';

    schema.forEach(table => {
      const interfaceName = this.toPascalCase(table.table_name);
      
      interfaces += `export interface ${interfaceName} {\n`;
      
      table.columns.forEach(column => {
        const tsType = this.mapPostgresToTypeScript(column.data_type);
        const optional = column.is_nullable === 'YES' ? '?' : '';
        
        interfaces += `  ${column.column_name}${optional}: ${tsType};\n`;
      });
      
      interfaces += '}\n\n';
    });

    return interfaces;
  }

  /**
   * Map PostgreSQL types to TypeScript types
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
      'date': 'string',
      'jsonb': 'any',
      'json': 'any',
      'uuid': 'string',
      'ARRAY': 'any[]'
    };

    // Handle array types
    if (pgType.includes('[]')) {
      const baseType = pgType.replace('[]', '');
      const tsBaseType = typeMap[baseType] || 'any';
      return `${tsBaseType}[]`;
    }

    return typeMap[pgType] || 'any';
  }

  /**
   * Convert snake_case to PascalCase
   */
  private toPascalCase(str: string): string {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  /**
   * Generate updated schema types file
   */
  generateSchemaTypes(actualSchema: TableInfo[]): string {
    const interfaces = this.generateTypeScriptInterfaces(actualSchema);
    
    return `/**
 * Auto-generated Supabase Schema Types
 * Generated on: ${new Date().toISOString()}
 * 
 * This file is auto-generated based on the actual Supabase schema.
 * Do not edit manually - regenerate using the schema inspector.
 */

${interfaces}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
${actualSchema.map(table => {
  const interfaceName = this.toPascalCase(table.table_name);
  return `      ${table.table_name}: {
        Row: ${interfaceName};
        Insert: Partial<${interfaceName}>;
        Update: Partial<${interfaceName}>;
      };`;
}).join('\n')}
    };
  };
}
`;
  }
}

export const schemaInspector = new SchemaInspector();
