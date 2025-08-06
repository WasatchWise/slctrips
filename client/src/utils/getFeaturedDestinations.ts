import { useState, useEffect } from "react";
import { Destination } from '@/types/destination-types';

// Mock data for when API is not accessible
const mockDestinations = [
  {
    id: 1,
    name: "Antelope Island State Park",
    category: "Downtown & Nearby",
    driveTime: 45,
    description: "Experience the Great Salt Lake's largest island",
    photos: [{ url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" }]
  },
  {
    id: 2,
    name: "Big Cottonwood Canyon",
    category: "Less than 90 Minutes",
    driveTime: 30,
    description: "Alpine scenery and hiking trails",
    photos: [{ url: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=200&fit=crop" }]
  },
  {
    id: 3,
    name: "Park City Main Street",
    category: "Less than 3 Hours",
    driveTime: 35,
    description: "Historic mining town turned ski resort",
    photos: [{ url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop" }]
  },
  {
    id: 4,
    name: "Zion National Park",
    category: "Less than 5 Hours",
    driveTime: 240,
    description: "Stunning red rock formations and hiking",
    photos: [{ url: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=200&fit=crop" }]
  },
  {
    id: 5,
    name: "Bryce Canyon National Park",
    category: "Less than 8 Hours",
    driveTime: 300,
    description: "Hoodoos and natural amphitheaters",
    photos: [{ url: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=200&fit=crop" }]
  },
  {
    id: 6,
    name: "Arches National Park",
    category: "A little bit farther",
    driveTime: 360,
    description: "Famous red rock arches and formations",
    photos: [{ url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop" }]
  }
];

// Shared function to get the exact same featured destinations used by both components
export async function getFeaturedDestinations(): Promise<Destination[]> {
  try {
    const response = await fetch('/api/destinations');
    if (!response.ok) {
      throw new Error('Failed to fetch destinations');
    }
    const responseData = await response.json();
    const allDestinations: any[] = Array.isArray(responseData) ? responseData : (responseData.destinations || []);
    
    console.log('API Response:', {
      hasDestinations: !!responseData.destinations,
      totalDestinations: allDestinations.length,
      categories: [...new Set(allDestinations.map(d => d.category))]
    });

    // Get diverse destinations from different categories with photos
    const categorizedDestinations = allDestinations.reduce((acc: any, dest: any) => {
      if (!acc[dest.category]) {
        acc[dest.category] = [];
      }
      acc[dest.category].push(dest);
      return acc;
    }, {});

    // Select one from each category, prioritizing quality destinations with photos
    const featuredDestinations: any[] = [];
    
    // Preferred destinations for each category (authentic names from your database)
    const preferredDestinations = {
      'Downtown & Nearby': ['Crestwood Pool', 'Sugar House Park', 'Liberty Park', 'The Leonardo'],
      'Less than 90 Minutes': ['Alta\'s Rustler Lodge', 'Antelope Island State Park', 'Park City', 'Sundance Resort'],
      'Less than 3 Hours': ['Butch Cassidy\'s Childhood Home', 'Spiral Jetty', 'Goblin Valley State Park', 'Capitol Reef National Park'],
      'Less than 5 Hours': ['Bloomington Petroglyph Park', 'Arches National Park', 'Zion National Park', 'Bryce Canyon National Park'],
      'Less than 8 Hours': ['Big Sky Resort', 'Yellowstone National Park', 'Jackson Hole', 'Glacier National Park'],
      'Less than 12 Hours': ['Estes Park', 'Rocky Mountain National Park', 'Denver', 'Colorado Springs'],
      'A little bit farther': ['Amarillo', 'Grand Teton National Park', 'Yosemite National Park', 'Grand Canyon National Park']
    };
    
    // Process categories in a specific order to ensure proper display
    const orderedCategories = [
      'Downtown & Nearby',
      'Less than 90 Minutes', 
      'Less than 3 Hours',
      'Less than 5 Hours',
      'Less than 8 Hours',
      'Less than 12 Hours',
      'A little bit farther'
    ];
    
    orderedCategories.forEach(category => {
      const categoryDests = categorizedDestinations[category] || [];
      if (categoryDests.length === 0) return;
      
      // Try to find a preferred destination first
      let selected = null;
      const preferred = preferredDestinations[category] || [];
      for (const prefName of preferred) {
        const found = categoryDests.find(d => d.name === prefName);
        if (found) {
          selected = found;
          break;
        }
      }
      
      // Fallback to first destination in category
      if (!selected) {
        selected = categoryDests[0];
      }
      
      if (selected) {
        // Ensure the selected destination actually belongs to this category
        console.log(`Selected for ${category}: ${selected.name} (actual category: ${selected.category})`);
        featuredDestinations.push(selected);
      }
    });
    // Take up to 6 destinations
    const finalDestinations = featuredDestinations.slice(0, 6);
    
    console.log('Final featured destinations:', finalDestinations.map(d => ({
      name: d.name,
      category: d.category,
      hasLatLng: !!(d.latitude && d.longitude)
    })));
    
    return finalDestinations.map((dest: any) => {
      const convertedDest: Destination = {
        id: dest.id,
        name: dest.name,
        category: dest.category,
        driveTime: dest.driveTime || calculateDriveTimeFromCategory(dest.category),
        description: dest.description || '',
        photos: dest.photos || [],
        photoUrl: (() => {
          if (dest.photos) {
            if (typeof dest.photos === 'string') {
              try {
                const parsed = JSON.parse(dest.photos);
                return parsed[0]?.url || dest.photo_url || '';
              } catch (_e) {
                return dest.photo_url || '';
              }
            }
            return dest.photos[0]?.url || dest.photo_url || '';
          }
          return dest.photo_url || '';
        })(),
        rating: null, // Only authentic Google Places ratings used
        categoryColor: getCategoryColor(dest.category),
        categoryLabel: getCategoryLabel(dest.category),
        uuid: dest.uuid,
        latitude: dest.coordinates?.lat || dest.latitude,
        longitude: dest.coordinates?.lng || dest.longitude
      };
      return convertedDest;
    });
  } catch (_error) {
    // console.error('Error fetching featured destinations:', error);
    return [];
  }
}

// Helper function to calculate drive time from authentic Supabase categories only
function calculateDriveTimeFromCategory(category: string): number {
  const categoryMappings: { [key: string]: number } = {
    'Downtown & Nearby': 25,
    'Less than 90 Minutes': 60,
    'Less than 3 Hours': 150,
    'Less than 5 Hours': 280,
    'Less than 8 Hours': 420,
    'Less than 12 Hours': 600,
    'A little bit farther': 720
  };
  
  return categoryMappings[category] || 120;
}

// Helper function to get category colors based on authentic Supabase categories only
function getCategoryColor(category: string): string {
  const colorMap: { [key: string]: string } = {
    "Downtown & Nearby": "#f4b441", // Pioneer Gold
    "Less than 90 Minutes": "#b33c1a", // Canyon Red
    "Less than 3 Hours": "#0087c8",   // Great Salt Blue
    "Less than 5 Hours": "#2e8b57",   // Sea Green
    "Less than 8 Hours": "#6a1b9a",   // Deep Purple
    "Less than 12 Hours": "#ff9800",  // Burnt Orange
    "A little bit farther": "#8b4513" // Saddle Brown
  };
  return colorMap[category] || "#0087c8";
}

// Helper function to get category label - using authentic Supabase categories only
function getCategoryLabel(category: string): string {
  // Return the exact Supabase category - no modifications
  return category;
}

// Hook version for React components
export const useFeaturedDestinations = () => {
  const [destinations, setDestinations] = useState(mockDestinations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/destinations?limit=all&status=active');
        
        if (!response.ok) {
          console.warn('API not accessible, using mock data');
          setDestinations(mockDestinations);
          setError(null);
          return;
        }
        
        const data = await response.json();
        setDestinations(data.destinations || mockDestinations);
        setError(null);
      } catch (err) {
        console.warn('API error, using mock data:', err);
        setDestinations(mockDestinations);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDestinations();
  }, []);

  return { destinations, loading, error };
};