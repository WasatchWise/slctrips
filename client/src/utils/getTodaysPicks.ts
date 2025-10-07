import { Destination } from '@/types/destination-types';

// Geographic coordinates for Utah destinations (relative to SLC Airport)
const DESTINATION_COORDINATES: { [key: string]: { lat: number, lng: number } } = {
  // Downtown & Nearby (30 min)
  "Temple Square": { lat: 40.7707, lng: -111.8929 },
  "Liberty Park": { lat: 40.7608, lng: -111.8790 },
  "Red Butte Garden": { lat: 40.7647, lng: -111.8167 },
  "Sugar House Park": { lat: 40.7208, lng: -111.8569 },
  "The Leonardo": { lat: 40.7608, lng: -111.8910 },
  "Crestwood Pool": { lat: 40.7208, lng: -111.8569 },
  
  // 90 Minutes or Less
  "Antelope Island State Park": { lat: 41.0847, lng: -112.4872 },
  "Park City Main Street": { lat: 40.6461, lng: -111.4980 },
  "Alta's Rustler Lodge": { lat: 40.5883, lng: -111.6383 },
  "Sundance Resort": { lat: 40.3922, lng: -111.5847 },
  "Big Cottonwood Canyon": { lat: 40.6333, lng: -111.5833 },
  
  // 3 Hours or Less
  "Butch Cassidy's Childhood Home": { lat: 40.1667, lng: -110.4000 },
  "Spiral Jetty": { lat: 41.4383, lng: -112.6689 },
  "Goblin Valley State Park": { lat: 38.5667, lng: -110.7000 },
  "Capitol Reef National Park": { lat: 38.3667, lng: -111.2500 },
  "Timpanogos Cave": { lat: 40.4500, lng: -111.7000 },
  
  // 5 Hours or Less
  "Zion National Park": { lat: 37.3000, lng: -113.0500 },
  "Bryce Canyon National Park": { lat: 37.6167, lng: -112.1667 },
  "Arches National Park": { lat: 38.7333, lng: -109.5000 },
  "Bloomington Petroglyph Park": { lat: 37.0667, lng: -113.5833 },
  
  // 8 Hours or Less
  "Big Sky Resort": { lat: 45.2667, lng: -111.4000 },
  "Yellowstone National Park": { lat: 44.4280, lng: -110.5885 },
  "Jackson Hole": { lat: 43.4799, lng: -110.7624 },
  "Glacier National Park": { lat: 48.7596, lng: -113.7870 },
  
  // 12 Hours or Less
  "Estes Park": { lat: 40.3772, lng: -105.5217 },
  "Rocky Mountain National Park": { lat: 40.3556, lng: -105.6972 },
  "Denver": { lat: 39.7392, lng: -104.9903 },
  "Colorado Springs": { lat: 38.8339, lng: -104.8214 },
  
  // A little bit farther
  "Grand Canyon National Park": { lat: 36.1069, lng: -112.1129 },
  "Grand Teton National Park": { lat: 43.7904, lng: -110.6818 },
  "Yosemite National Park": { lat: 37.8651, lng: -119.5383 },
  "Amarillo": { lat: 35.2220, lng: -101.8313 }
};

// SLC Airport coordinates (center point)
const SLC_AIRPORT = { lat: 40.7884, lng: -111.9778 };

// Function to get today's rotating picks based on the date
export function getTodaysPicks(destinations: Destination[]): Destination[] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Use day of year to create a rotating selection
  const picksPerDay = 6;
  const startIndex = (dayOfYear * picksPerDay) % destinations.length;
  
  // Get today's picks
  const todaysPicks = destinations.slice(startIndex, startIndex + picksPerDay);
  
  // If we don't have enough destinations, wrap around
  if (todaysPicks.length < picksPerDay) {
    const remaining = picksPerDay - todaysPicks.length;
    todaysPicks.push(...destinations.slice(0, remaining));
  }
  
  // Add geographic coordinates to each pick
  return todaysPicks.map(dest => {
    const coords = DESTINATION_COORDINATES[dest.name];
    return {
      ...dest,
      latitude: coords?.lat ?? dest.latitude ?? null,
      longitude: coords?.lng ?? dest.longitude ?? null
    };
  });
}

// Function to calculate pin position on the bulls-eye based on real coordinates
export function calculatePinPosition(destination: Destination, containerSize: number = 1000): { x: number, y: number } {
  const lat = destination.latitude ?? destination.coordinates?.lat;
  const lng = destination.longitude ?? destination.coordinates?.lng;

  if (!lat || !lng) {
    // Fallback to random position if no coordinates
    const angle = Math.random() * 2 * Math.PI;
    const radius = 100 + Math.random() * 200;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  }

  // Calculate distance and bearing from SLC Airport
  const lat1 = SLC_AIRPORT.lat * Math.PI / 180;
  const lng1 = SLC_AIRPORT.lng * Math.PI / 180;
  const lat2 = lat * Math.PI / 180;
  const lng2 = lng * Math.PI / 180;
  
  // Calculate distance in km
  const R = 6371; // Earth's radius in km
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Calculate bearing
  const yBearing = Math.sin(lng2 - lng1) * Math.cos(lat2);
  const xBearing = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
  const bearing = Math.atan2(yBearing, xBearing) * 180 / Math.PI;

  // Convert to bulls-eye coordinates
  // Scale distance to fit within the bulls-eye (max ~500px radius)
  const maxDistance = 500; // km
  const scaleFactor = Math.min(distance / maxDistance, 1);
  const radius = scaleFactor * 250; // Max radius of 250px

  // Convert bearing to radians and calculate position
  const bearingRad = (bearing - 90) * Math.PI / 180; // Adjust for compass orientation
  const x = Math.cos(bearingRad) * radius;
  const y = Math.sin(bearingRad) * radius;
  
  return { x, y };
}

// Function to get the ring that a destination belongs to based on drive time
export function getDestinationRing(destination: Destination): string {
  const driveTime = destination.driveTime ?? destination.drive_time ?? 0;
  
  if (driveTime <= 30) return '30min';
  if (driveTime <= 90) return '90min';
  if (driveTime <= 180) return '3hr';
  if (driveTime <= 300) return '5hr';
  if (driveTime <= 480) return '8hr';
  if (driveTime <= 720) return '12hr';
  return '12hr'; // Default
} 