/**
 * Sync photos from local PostgreSQL to Supabase
 * This eliminates the hybrid system and makes Supabase the single source of truth
 */

export async function syncPhotosToSupabase() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const { pool } = await import('./db');
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.DANIEL_SUPABASE_KEY! // Use the regular key first
    );

    // Get all destinations with photos from local database
    const localQuery = await pool.query(`
      SELECT id, name, photos, photo_url, cover_photo_url, photo_urls
      FROM destinations 
      WHERE photos IS NOT NULL AND photos != '[]'
    `);

    // console.log(`📸 Found ${localQuery.rows.length} destinations with photos in local database`);

    let updatedCount = 0;
    let errorCount = 0;
    let matchedCount = 0;

    for (const localDest of localQuery.rows) {
      try {
        // Find matching destination in Supabase by name
        const { data: supabaseDest, error: findError } = await supabase
          .from('destinations')
          .select('id, name, photo_gallery')
          .ilike('name', localDest.name)
          .single();

        if (findError || !supabaseDest) {
          // Try partial match
          const { data: partialMatch, error: partialError } = await supabase
            .from('destinations')
            .select('id, name, photo_gallery')
            .ilike('name', `%${localDest.name.split(' ')[0]}%`)
            .limit(1);
            
          if (partialError || !partialMatch || partialMatch.length === 0) {
            // console.log(`❌ No match found for: ${localDest.name}`);
            continue;
          }
          
          // Use first partial match
          const matched = partialMatch[0];
          // console.log(`🔍 Partial match: "${localDest.name}" -> "${matched.name}"`);
          matchedCount++;
          
          // Update the matched destination
          const updateData = { photo_gallery: localDest.photos };
          
          const { error: updateError } = await supabase
            .from('destinations')
            .update(updateData)
            .eq('id', matched.id);

          if (updateError) {
            // console.error(`❌ Failed to update ${matched.name}:`, updateError);
            errorCount++;
          } else {
            // console.log(`✅ Updated photos for: ${matched.name}`);
            updatedCount++;
          }
          
          continue;
        }

        matchedCount++;

        // Check if already has photos
        if (supabaseDest.photo_gallery && supabaseDest.photo_gallery !== '' && supabaseDest.photo_gallery !== '[]') {
          // console.log(`⏭️  Already has photos: ${supabaseDest.name}`);
          continue;
        }

        // Update Supabase destination with photo data
        const updateData = { photo_gallery: localDest.photos };
        
        const { error: updateError } = await supabase
          .from('destinations')
          .update(updateData)
          .eq('id', supabaseDest.id);

        if (updateError) {
          // console.error(`❌ Failed to update ${localDest.name}:`, updateError);
          errorCount++;
        } else {
          // console.log(`✅ Updated photos for: ${localDest.name}`);
          updatedCount++;
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (_error) {
        // console.error(`❌ Error processing ${localDest.name}:`, error);
        errorCount++;
      }
    }

    // console.log(`🎯 Sync complete: ${updatedCount} updated, ${matchedCount} matched, ${errorCount} errors`);
    return { updatedCount, matchedCount, errorCount, totalLocalPhotos: localQuery.rows.length };

  } catch (_error) {
    // console.error('❌ Photo sync failed:', error);
    throw error;
  }
}