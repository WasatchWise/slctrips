/**
 * Check what photo data is actually available in Supabase
 */

export async function checkSupabasePhotos() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.DANIEL_SUPABASE_KEY!
    );

    // Get a few destinations with photo data
    const { data: destinations, error } = await supabase
      .from('destinations')
      .select('name, photo_gallery')
      .not('photo_gallery', 'is', null)
      .neq('photo_gallery', '')
      .neq('photo_gallery', '[]')
      .limit(10);

    if (error) {
      // console.error('Supabase error:', error);
      return;
    }

    // console.log('Destinations with photos:', destinations);
    
    // Show detailed photo data for first few
    destinations?.slice(0, 3).forEach(dest => {
      // console.log(`\n${dest.name}:`);
      if (dest.photo_gallery) {
        try {
          const photos = typeof dest.photo_gallery === 'string' 
            ? JSON.parse(dest.photo_gallery) 
            : dest.photo_gallery;
          // console.log('Photo data:', JSON.stringify(photos, null, 2));
        } catch (_e) {
          // console.log('Raw photo_gallery:', dest.photo_gallery);
        }
      }
    });

  } catch (_error) {
    // console.error('Error checking Supabase photos:', error);
  }
}