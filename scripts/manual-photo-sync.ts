/**
 * Manual photo sync script - run directly in server context
 */

import { pool } from './db';

export async function manualPhotoSync() {
  try {
    // console.log('🚀 Starting manual photo sync...');
    
    // Import Supabase client from existing route
    const { createClient } = await import('@supabase/supabase-js');
    
    // Use the same connection pattern as the working destinations API
    const supabaseUrl = process.env.SUPABASE_URL || 'https://mkepcjzqnbowrgbvjfem.supabase.co';
    const supabaseKey = process.env.DANIEL_SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;
    
    // console.log('🔑 Using Supabase URL:', supabaseUrl);
    // console.log('🔑 API key length:', supabaseKey?.length || 0);
    
    const supabase = createClient(supabaseUrl, supabaseKey!);

    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('destinations')
      .select('id, name')
      .limit(1);

    if (testError) {
      // console.error('❌ Supabase connection failed:', testError);
      return { error: 'Supabase connection failed' };
    }

    // console.log('✅ Supabase connected successfully');

    // Get destinations with photos from local database
    const localQuery = await pool.query(`
      SELECT name, photos 
      FROM destinations 
      WHERE photos IS NOT NULL AND photos != '[]'
      ORDER BY name
      LIMIT 10
    `);

    // console.log(`📸 Found ${localQuery.rows.length} destinations with photos locally`);

    let successCount = 0;
    let errorCount = 0;

    for (const localDest of localQuery.rows) {
      try {
        // console.log(`🔍 Processing: ${localDest.name}`);
        
        // Find exact match in Supabase
        const { data: supabaseDest, error: findError } = await supabase
          .from('destinations')
          .select('id, name, photo_gallery')
          .eq('name', localDest.name)
          .single();

        if (findError) {
          // console.log(`⚠️  No exact match for: ${localDest.name}`);
          errorCount++;
          continue;
        }

        // Update with photo data
        const { error: updateError } = await supabase
          .from('destinations')
          .update({ photo_gallery: localDest.photos })
          .eq('id', supabaseDest.id);

        if (updateError) {
          // console.error(`❌ Update failed for ${localDest.name}:`, updateError);
          errorCount++;
        } else {
          // console.log(`✅ Updated photos for: ${localDest.name}`);
          successCount++;
        }

        // Small delay to be gentle with API
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (_error) {
        // console.error(`❌ Error processing ${localDest.name}:`, error);
        errorCount++;
      }
    }

    const result = {
      message: `Sync complete: ${successCount} updated, ${errorCount} errors`,
      successCount,
      errorCount,
      totalProcessed: localQuery.rows.length
    };

    // console.log(`🎯 ${result.message}`);
    return result;

  } catch (_error) {
    // console.error('❌ Manual sync failed:', error);
    return { error: error.message };
  }
}