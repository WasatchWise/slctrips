import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function verifyCoordinates() {
  console.log('🔍 Verifying destination coordinates...');

  // Get all destinations
  const { data: destinations, error } = await supabase
    .from('destinations')
    .select('*');

  if (error) {
    console.error('Error fetching destinations:', error);
    return;
  }

  console.log(`📊 Found ${destinations?.length || 0} destinations`);

  let validCount = 0;
  let invalidCount = 0;
  let updatedCount = 0;

  for (const destination of destinations || []) {
    const hasValidCoords = destination.latitude && 
                           destination.longitude && 
                           !isNaN(destination.latitude) && 
                           !isNaN(destination.longitude) &&
                           destination.latitude !== 0 &&
                           destination.longitude !== 0;

    if (hasValidCoords) {
      validCount++;
    } else {
      invalidCount++;
      console.log(`❌ Invalid coordinates for: ${destination.name}`);
      
      // Try to fix with Utah coordinates if it's a known location
      const fixedCoords = getUtahCoordinates(destination.name);
      if (fixedCoords) {
        const { error: updateError } = await supabase
          .from('destinations')
          .update({
            latitude: fixedCoords.lat,
            longitude: fixedCoords.lng,
            coordinates: `POINT(${fixedCoords.lng} ${fixedCoords.lat})`
          })
          .eq('id', destination.id);

        if (!updateError) {
          updatedCount++;
          console.log(`✅ Fixed coordinates for: ${destination.name}`);
        } else {
          console.error(`❌ Failed to update: ${destination.name}`, updateError);
        }
      }
    }
  }

  console.log(`\n📈 Results:`);
  console.log(`✅ Valid coordinates: ${validCount}`);
  console.log(`❌ Invalid coordinates: ${invalidCount}`);
  console.log(`🔧 Fixed coordinates: ${updatedCount}`);
}

function getUtahCoordinates(name: string) {
  const utahCoords: { [key: string]: { lat: number, lng: number } } = {
    // Salt Lake City Area
    'Salt Lake City': { lat: 40.7608, lng: -111.8910 },
    'Temple Square': { lat: 40.7700, lng: -111.8900 },
    'Utah State Capitol': { lat: 40.7769, lng: -111.8880 },
    'Liberty Park': { lat: 40.7600, lng: -111.8700 },
    'Memory Grove': { lat: 40.7700, lng: -111.8900 },
    'Red Butte Garden': { lat: 40.7700, lng: -111.8200 },
    'This Is The Place Heritage Park': { lat: 40.7600, lng: -111.8200 },
    'City Creek Center': { lat: 40.7700, lng: -111.8900 },
    'Antelope Island State Park': { lat: 41.0500, lng: -112.2200 },
    'Big Cottonwood Canyon': { lat: 40.6200, lng: -111.6200 },
    'Little Cottonwood Canyon': { lat: 40.5700, lng: -111.6200 },

    // Park City Area
    'Park City': { lat: 40.6461, lng: -111.4980 },
    'Park City Main Street': { lat: 40.6461, lng: -111.4980 },
    'Park City Mountain Resort': { lat: 40.6500, lng: -111.5100 },
    'Deer Valley Resort': { lat: 40.6400, lng: -111.4900 },
    'Canyons Village': { lat: 40.6500, lng: -111.5100 },

    // Moab Area
    'Moab': { lat: 38.5733, lng: -109.5498 },
    'Arches National Park': { lat: 38.6160, lng: -109.6190 },
    'Canyonlands National Park': { lat: 38.3260, lng: -109.8780 },
    'Dead Horse Point State Park': { lat: 38.4800, lng: -109.7400 },

    // Zion Area
    'Zion National Park': { lat: 37.2982, lng: -113.0263 },
    'Springdale': { lat: 37.1750, lng: -112.9990 },
    'Kolob Canyons': { lat: 37.4000, lng: -113.2000 },

    // Bryce Canyon Area
    'Bryce Canyon National Park': { lat: 37.5930, lng: -112.1870 },
    'Bryce Canyon City': { lat: 37.6700, lng: -112.1700 },

    // St. George Area
    'St. George': { lat: 37.0965, lng: -113.5684 },
    'Snow Canyon State Park': { lat: 37.2000, lng: -113.6500 },
    'Sand Hollow State Park': { lat: 37.1200, lng: -113.3700 },

    // Ogden Area
    'Ogden': { lat: 41.2230, lng: -111.9738 },
    'Ogden Canyon': { lat: 41.2500, lng: -111.9500 },
    'Pineview Reservoir': { lat: 41.3000, lng: -111.8500 },

    // Provo Area
    'Provo': { lat: 40.2338, lng: -111.6585 },
    'Bridal Veil Falls': { lat: 40.3400, lng: -111.6100 },
    'Sundance Resort': { lat: 40.3900, lng: -111.5800 },

    // Logan Area
    'Logan': { lat: 41.7355, lng: -111.8344 },
    'Logan Canyon': { lat: 41.7500, lng: -111.8000 },
    'Bear Lake': { lat: 41.9500, lng: -111.4000 },

    // Vernal Area
    'Vernal': { lat: 40.4555, lng: -109.5288 },
    'Dinosaur National Monument': { lat: 40.4400, lng: -109.3000 },
    'Flaming Gorge': { lat: 41.0000, lng: -109.5000 },

    // Cedar City Area
    'Cedar City': { lat: 37.6775, lng: -113.0619 },
    'Cedar Breaks National Monument': { lat: 37.6300, lng: -112.8400 },
    'Brian Head Resort': { lat: 37.7000, lng: -112.8500 },

    // Kanab Area
    'Kanab': { lat: 37.0475, lng: -112.5263 },
    'Best Friends Animal Sanctuary': { lat: 37.0000, lng: -112.5300 },

    // Torrey Area
    'Torrey': { lat: 38.2994, lng: -111.4185 },
    'Capitol Reef National Park': { lat: 38.3700, lng: -111.1400 },

    // Escalante Area
    'Escalante': { lat: 37.7705, lng: -111.6002 },
    'Grand Staircase-Escalante': { lat: 37.6000, lng: -111.5000 },

    // Bluff Area
    'Bluff': { lat: 37.2844, lng: -109.5518 },
    'Monument Valley': { lat: 37.0000, lng: -110.1700 },

    // Lake Powell Area
    'Lake Powell': { lat: 37.0000, lng: -111.5000 },
    'Glen Canyon National Recreation Area': { lat: 37.0000, lng: -111.5000 },

    // Great Salt Lake Area
    'Great Salt Lake': { lat: 41.1500, lng: -112.5000 },
    'Great Salt Lake State Park': { lat: 40.7300, lng: -112.2200 },
    'Spiral Jetty': { lat: 41.4400, lng: -112.6700 },

    // Uinta Mountains
    'Uinta Mountains': { lat: 40.7500, lng: -110.7500 },
    'Mirror Lake': { lat: 40.7000, lng: -110.7000 },
    'High Uintas Wilderness': { lat: 40.7500, lng: -110.7500 },

    // Wasatch Mountains
    'Wasatch Mountains': { lat: 40.7500, lng: -111.7500 },
    'Mount Timpanogos': { lat: 40.3900, lng: -111.6500 },
    'Mount Nebo': { lat: 39.8200, lng: -111.7600 },

    // San Rafael Swell
    'San Rafael Swell': { lat: 39.0000, lng: -110.5000 },
    'Goblin Valley State Park': { lat: 38.5700, lng: -110.7000 },

    // West Desert
    'West Desert': { lat: 40.0000, lng: -113.0000 },
    'Bonneville Salt Flats': { lat: 40.7500, lng: -113.8800 },
    'Wendover': { lat: 40.7380, lng: -114.0370 }
  };

  // Try exact match first
  if (utahCoords[name]) {
    return utahCoords[name];
  }

  // Try partial matches
  for (const [key, coords] of Object.entries(utahCoords)) {
    if (name.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(name.toLowerCase())) {
      return coords;
    }
  }

  return null;
}

// Run the verification
verifyCoordinates().catch(console.error); 