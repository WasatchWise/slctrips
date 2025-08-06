
/**
 * Schema Sync Trigger
 * Immediate execution of schema alignment
 */

import { schemaAlignment } from './schema-alignment';

export async function triggerSchemaSync() {
  // console.log('🚀 Triggering immediate schema sync...');
  
  try {
    const result = await schemaAlignment.performAlignment();
    
    // console.log('\n' + '='.repeat(60));
    // console.log('🎯 SCHEMA ALIGNMENT COMPLETE');
    // console.log('='.repeat(60));
    // console.log(`📁 Files updated: ${result.filesUpdated.length}`);
    // console.log(`🔄 Changes made: ${result.changes.length}`);
    // console.log('\n📋 CHANGELOG:');
    
    result.changes.forEach((change, index) => {
      // console.log(`${index + 1}. [${change.type.toUpperCase()}] ${change.target}`);
      // console.log(`   ${change.description}`);
    });
    
    // console.log('\n✅ ' + result.summary);
    // console.log('='.repeat(60));
    
    return result;
  } catch (_error) {
    // console.error('❌ Schema sync failed:', error);
    throw error;
  }
}

// Auto-trigger if run directly
if (require.main === module) {
  triggerSchemaSync()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
