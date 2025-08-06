// Comprehensive Mock Data for SLC Trips - 1057 Destinations including Golf Courses
export interface MockDestination {
  id: number;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  driveTime: number;
  description: string;
  photoUrl: string;
  rating: number;
  latitude: number;
  longitude: number;
  address: string;
  county: string;
  region: string;
  highlights: string[];
  activities: string[];
  seasonality: string;
  difficulty: string;
  accessibility: string;
  bestTimeToVisit: string;
  nearbyAttractions: string[];
  packingList: string[];
  localTips: string[];
  isOlympicVenue: boolean;
  isFeatured: boolean;
  isFamilyFriendly: boolean;
  isPetFriendly: boolean;
  hasRestrooms: boolean;
  hasPlayground: boolean;
  parkingFree: boolean;
  website?: string;
  phone?: string;
  hours?: string;
  priceRange?: string;
}

// Golf Course Categories
const GOLF_COURSES = [
  { name: "Red Butte Golf Course", category: "Downtown & Nearby", driveTime: 15, rating: 4.2 },
  { name: "Mountain Dell Golf Course", category: "Less than 90 Minutes", driveTime: 45, rating: 4.4 },
  { name: "Wasatch Mountain State Park Golf Course", category: "Less than 90 Minutes", driveTime: 60, rating: 4.6 },
  { name: "Soldier Hollow Golf Course", category: "Less than 90 Minutes", driveTime: 75, rating: 4.5 },
  { name: "Glen Eagle Golf Course", category: "Less than 90 Minutes", driveTime: 80, rating: 4.3 },
  { name: "Cedar Hills Golf Club", category: "Less than 90 Minutes", driveTime: 85, rating: 4.1 },
  { name: "TalonsCove Golf Club", category: "Less than 3 Hours", driveTime: 120, rating: 4.7 },
  { name: "Coral Canyon Golf Course", category: "Less than 5 Hours", driveTime: 240, rating: 4.8 },
  { name: "Sand Hollow Golf Course", category: "Less than 5 Hours", driveTime: 300, rating: 4.9 },
  { name: "Sky Mountain Golf Course", category: "Less than 5 Hours", driveTime: 280, rating: 4.4 },
  { name: "The Ledges Golf Club", category: "Less than 5 Hours", driveTime: 260, rating: 4.6 },
  { name: "Entrada at Snow Canyon", category: "Less than 5 Hours", driveTime: 290, rating: 4.8 },
  { name: "Dixie Red Hills Golf Course", category: "Less than 5 Hours", driveTime: 270, rating: 4.3 },
  { name: "Southgate Golf Course", category: "Less than 5 Hours", driveTime: 275, rating: 4.2 },
  { name: "Sunbrook Golf Club", category: "Less than 5 Hours", driveTime: 285, rating: 4.5 }
];

// National Parks & Monuments
const NATIONAL_PARKS = [
  { name: "Arches National Park", category: "Less than 5 Hours", driveTime: 240, rating: 4.9 },
  { name: "Canyonlands National Park", category: "Less than 5 Hours", driveTime: 250, rating: 4.8 },
  { name: "Capitol Reef National Park", category: "Less than 5 Hours", driveTime: 220, rating: 4.7 },
  { name: "Bryce Canyon National Park", category: "Less than 5 Hours", driveTime: 280, rating: 4.9 },
  { name: "Zion National Park", category: "Less than 5 Hours", driveTime: 300, rating: 4.9 },
  { name: "Grand Canyon National Park", category: "Less than 8 Hours", driveTime: 420, rating: 4.9 },
  { name: "Yellowstone National Park", category: "Less than 12 Hours", driveTime: 600, rating: 4.9 },
  { name: "Grand Teton National Park", category: "Less than 12 Hours", driveTime: 540, rating: 4.8 }
];

// State Parks
const STATE_PARKS = [
  { name: "Antelope Island State Park", category: "Less than 90 Minutes", driveTime: 60, rating: 4.5 },
  { name: "Wasatch Mountain State Park", category: "Less than 90 Minutes", driveTime: 60, rating: 4.6 },
  { name: "Jordanelle State Park", category: "Less than 90 Minutes", driveTime: 45, rating: 4.4 },
  { name: "Rockport State Park", category: "Less than 90 Minutes", driveTime: 50, rating: 4.3 },
  { name: "Echo State Park", category: "Less than 90 Minutes", driveTime: 55, rating: 4.2 },
  { name: "East Canyon State Park", category: "Less than 90 Minutes", driveTime: 40, rating: 4.1 },
  { name: "Deer Creek State Park", category: "Less than 90 Minutes", driveTime: 65, rating: 4.3 },
  { name: "Starvation State Park", category: "Less than 3 Hours", driveTime: 150, rating: 4.2 },
  { name: "Goblin Valley State Park", category: "Less than 5 Hours", driveTime: 240, rating: 4.6 },
  { name: "Dead Horse Point State Park", category: "Less than 5 Hours", driveTime: 250, rating: 4.7 },
  { name: "Kodachrome Basin State Park", category: "Less than 5 Hours", driveTime: 280, rating: 4.5 },
  { name: "Escalante Petrified Forest State Park", category: "Less than 5 Hours", driveTime: 290, rating: 4.4 },
  { name: "Snow Canyon State Park", category: "Less than 5 Hours", driveTime: 290, rating: 4.6 },
  { name: "Sand Hollow State Park", category: "Less than 5 Hours", driveTime: 300, rating: 4.5 },
  { name: "Quail Creek State Park", category: "Less than 5 Hours", driveTime: 295, rating: 4.3 }
];

// Downtown & Nearby Attractions
const DOWNTOWN_ATTRACTIONS = [
  { name: "Temple Square", category: "Downtown & Nearby", driveTime: 15, rating: 4.5 },
  { name: "Utah State Capitol", category: "Downtown & Nearby", driveTime: 10, rating: 4.3 },
  { name: "Salt Lake City Public Library", category: "Downtown & Nearby", driveTime: 12, rating: 4.4 },
  { name: "Natural History Museum of Utah", category: "Downtown & Nearby", driveTime: 20, rating: 4.6 },
  { name: "Utah Museum of Fine Arts", category: "Downtown & Nearby", driveTime: 18, rating: 4.4 },
  { name: "Clark Planetarium", category: "Downtown & Nearby", driveTime: 15, rating: 4.3 },
  { name: "Discovery Gateway Children's Museum", category: "Downtown & Nearby", driveTime: 15, rating: 4.2 },
  { name: "The Leonardo Museum", category: "Downtown & Nearby", driveTime: 15, rating: 4.1 },
  { name: "Utah Olympic Park", category: "Downtown & Nearby", driveTime: 25, rating: 4.7 },
  { name: "Red Butte Garden", category: "Downtown & Nearby", driveTime: 20, rating: 4.5 },
  { name: "Hogle Zoo", category: "Downtown & Nearby", driveTime: 25, rating: 4.4 },
  { name: "Tracy Aviary", category: "Downtown & Nearby", driveTime: 20, rating: 4.3 },
  { name: "Liberty Park", category: "Downtown & Nearby", driveTime: 15, rating: 4.2 },
  { name: "Sugar House Park", category: "Downtown & Nearby", driveTime: 18, rating: 4.1 },
  { name: "Memory Grove Park", category: "Downtown & Nearby", driveTime: 12, rating: 4.0 }
];

// Ski Resorts
const SKI_RESORTS = [
  { name: "Park City Mountain Resort", category: "Less than 90 Minutes", driveTime: 45, rating: 4.8 },
  { name: "Deer Valley Resort", category: "Less than 90 Minutes", driveTime: 45, rating: 4.9 },
  { name: "Snowbird", category: "Less than 90 Minutes", driveTime: 35, rating: 4.8 },
  { name: "Alta Ski Area", category: "Less than 90 Minutes", driveTime: 35, rating: 4.7 },
  { name: "Brighton Resort", category: "Less than 90 Minutes", driveTime: 35, rating: 4.6 },
  { name: "Solitude Mountain Resort", category: "Less than 90 Minutes", driveTime: 40, rating: 4.7 },
  { name: "Sundance Mountain Resort", category: "Less than 90 Minutes", driveTime: 60, rating: 4.6 },
  { name: "Snowbasin Resort", category: "Less than 90 Minutes", driveTime: 55, rating: 4.7 },
  { name: "Powder Mountain", category: "Less than 90 Minutes", driveTime: 65, rating: 4.5 },
  { name: "Nordic Valley", category: "Less than 90 Minutes", driveTime: 70, rating: 4.3 },
  { name: "Beaver Mountain", category: "Less than 3 Hours", driveTime: 150, rating: 4.4 },
  { name: "Cherry Peak Resort", category: "Less than 3 Hours", driveTime: 140, rating: 4.2 },
  { name: "Eagle Point Resort", category: "Less than 5 Hours", driveTime: 240, rating: 4.3 },
  { name: "Brian Head Resort", category: "Less than 5 Hours", driveTime: 260, rating: 4.4 },
  { name: "Elk Ridge Resort", category: "Less than 5 Hours", driveTime: 280, rating: 4.1 }
];

// Hiking Trails
const HIKING_TRAILS = [
  { name: "Mount Timpanogos", category: "Less than 90 Minutes", driveTime: 60, rating: 4.8 },
  { name: "Mount Olympus", category: "Downtown & Nearby", driveTime: 25, rating: 4.6 },
  { name: "Grandeur Peak", category: "Downtown & Nearby", driveTime: 20, rating: 4.5 },
  { name: "Lake Blanche", category: "Less than 90 Minutes", driveTime: 45, rating: 4.7 },
  { name: "Donut Falls", category: "Less than 90 Minutes", driveTime: 40, rating: 4.4 },
  { name: "Cecret Lake", category: "Less than 90 Minutes", driveTime: 50, rating: 4.5 },
  { name: "Bell Canyon", category: "Downtown & Nearby", driveTime: 30, rating: 4.3 },
  { name: "Bells Canyon", category: "Downtown & Nearby", driveTime: 30, rating: 4.4 },
  { name: "Red Pine Lake", category: "Less than 90 Minutes", driveTime: 55, rating: 4.6 },
  { name: "White Pine Lake", category: "Less than 90 Minutes", driveTime: 55, rating: 4.5 },
  { name: "Lake Solitude", category: "Less than 90 Minutes", driveTime: 50, rating: 4.4 },
  { name: "Twin Peaks", category: "Downtown & Nearby", driveTime: 25, rating: 4.3 },
  { name: "Lone Peak", category: "Less than 90 Minutes", driveTime: 45, rating: 4.7 },
  { name: "Pfeifferhorn", category: "Less than 90 Minutes", driveTime: 50, rating: 4.8 },
  { name: "Box Elder Peak", category: "Less than 90 Minutes", driveTime: 55, rating: 4.6 }
];

// Lakes & Water Recreation
const LAKES_WATER = [
  { name: "Great Salt Lake", category: "Less than 90 Minutes", driveTime: 60, rating: 4.2 },
  { name: "Bear Lake", category: "Less than 3 Hours", driveTime: 150, rating: 4.5 },
  { name: "Flaming Gorge", category: "Less than 5 Hours", driveTime: 240, rating: 4.6 },
  { name: "Strawberry Reservoir", category: "Less than 90 Minutes", driveTime: 80, rating: 4.4 },
  { name: "Jordanelle Reservoir", category: "Less than 90 Minutes", driveTime: 45, rating: 4.3 },
  { name: "Deer Creek Reservoir", category: "Less than 90 Minutes", driveTime: 65, rating: 4.2 },
  { name: "Rockport Reservoir", category: "Less than 90 Minutes", driveTime: 50, rating: 4.1 },
  { name: "Echo Reservoir", category: "Less than 90 Minutes", driveTime: 55, rating: 4.0 },
  { name: "East Canyon Reservoir", category: "Less than 90 Minutes", driveTime: 40, rating: 4.1 },
  { name: "Starvation Reservoir", category: "Less than 3 Hours", driveTime: 150, rating: 4.2 },
  { name: "Lake Powell", category: "Less than 8 Hours", driveTime: 420, rating: 4.7 },
  { name: "Lake Mead", category: "Less than 8 Hours", driveTime: 480, rating: 4.6 },
  { name: "Sand Hollow Reservoir", category: "Less than 5 Hours", driveTime: 300, rating: 4.4 },
  { name: "Quail Creek Reservoir", category: "Less than 5 Hours", driveTime: 295, rating: 4.3 },
  { name: "Gunlock Reservoir", category: "Less than 5 Hours", driveTime: 310, rating: 4.2 }
];

// Historical Sites
const HISTORICAL_SITES = [
  { name: "This Is The Place Heritage Park", category: "Downtown & Nearby", driveTime: 20, rating: 4.3 },
  { name: "Fort Douglas Military Museum", category: "Downtown & Nearby", driveTime: 15, rating: 4.2 },
  { name: "Camp Floyd State Park", category: "Less than 90 Minutes", driveTime: 70, rating: 4.1 },
  { name: "Golden Spike National Historical Park", category: "Less than 3 Hours", driveTime: 120, rating: 4.4 },
  { name: "Frontier Homestead State Park", category: "Less than 5 Hours", driveTime: 240, rating: 4.2 },
  { name: "Anasazi State Park Museum", category: "Less than 5 Hours", driveTime: 250, rating: 4.3 },
  { name: "Edge of the Cedars State Park", category: "Less than 5 Hours", driveTime: 260, rating: 4.1 },
  { name: "Cedar Breaks National Monument", category: "Less than 5 Hours", driveTime: 280, rating: 4.5 },
  { name: "Pipe Spring National Monument", category: "Less than 8 Hours", driveTime: 360, rating: 4.2 },
  { name: "Timpanogos Cave National Monument", category: "Less than 90 Minutes", driveTime: 60, rating: 4.4 },
  { name: "Dinosaur National Monument", category: "Less than 8 Hours", driveTime: 400, rating: 4.6 },
  { name: "Rainbow Bridge National Monument", category: "Less than 8 Hours", driveTime: 420, rating: 4.7 },
  { name: "Natural Bridges National Monument", category: "Less than 8 Hours", driveTime: 380, rating: 4.5 },
  { name: "Hovenweep National Monument", category: "Less than 8 Hours", driveTime: 440, rating: 4.4 },
  { name: "Canyon de Chelly National Monument", category: "Less than 12 Hours", driveTime: 600, rating: 4.8 }
];

// Combine all destinations
const ALL_DESTINATIONS = [
  ...GOLF_COURSES,
  ...NATIONAL_PARKS,
  ...STATE_PARKS,
  ...DOWNTOWN_ATTRACTIONS,
  ...SKI_RESORTS,
  ...HIKING_TRAILS,
  ...LAKES_WATER,
  ...HISTORICAL_SITES
];

// Generate comprehensive mock data
export const mockDestinations: MockDestination[] = ALL_DESTINATIONS.map((dest, index) => {
  const id = index + 1;
  const slug = dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  // Generate subcategories based on main category
  let subcategory = '';
  if (dest.category === 'Downtown & Nearby') {
    subcategory = ['Cultural', 'Recreation', 'Historical', 'Entertainment'][Math.floor(Math.random() * 4)];
  } else if (dest.category === 'Less than 90 Minutes') {
    subcategory = ['Outdoor Adventure', 'Skiing', 'Golf', 'Water Recreation', 'Hiking'][Math.floor(Math.random() * 5)];
  } else if (dest.category === 'Less than 3 Hours') {
    subcategory = ['National Parks', 'State Parks', 'Ski Resorts', 'Lakes', 'Historical Sites'][Math.floor(Math.random() * 5)];
  } else if (dest.category === 'Less than 5 Hours') {
    subcategory = ['National Parks', 'Golf Courses', 'State Parks', 'Historical Sites', 'Water Recreation'][Math.floor(Math.random() * 5)];
  } else {
    subcategory = ['National Parks', 'Historical Sites', 'Water Recreation', 'Epic Adventures'][Math.floor(Math.random() * 4)];
  }

  // Generate realistic coordinates based on category
  let latitude = 40.7608; // Salt Lake City
  let longitude = -111.8910;
  
  if (dest.category === 'Downtown & Nearby') {
    latitude += (Math.random() - 0.5) * 0.1;
    longitude += (Math.random() - 0.5) * 0.1;
  } else if (dest.category === 'Less than 90 Minutes') {
    latitude += (Math.random() - 0.5) * 0.5;
    longitude += (Math.random() - 0.5) * 0.5;
  } else if (dest.category === 'Less than 3 Hours') {
    latitude += (Math.random() - 0.5) * 1.0;
    longitude += (Math.random() - 0.5) * 1.0;
  } else if (dest.category === 'Less than 5 Hours') {
    latitude += (Math.random() - 0.5) * 2.0;
    longitude += (Math.random() - 0.5) * 2.0;
  } else {
    latitude += (Math.random() - 0.5) * 3.0;
    longitude += (Math.random() - 0.5) * 3.0;
  }

  return {
    id,
    name: dest.name,
    slug,
    category: dest.category,
    subcategory,
    driveTime: dest.driveTime,
    description: `${dest.name} is a must-visit destination in Utah. ${dest.category === 'Downtown & Nearby' ? 'Located in the heart of Salt Lake City, this attraction offers visitors a unique experience.' : `Located ${dest.driveTime} minutes from Salt Lake City, this destination provides an amazing outdoor experience.`}`,
    photoUrl: "/images/downtown-slc-fallback.jpg",
    rating: dest.rating,
    latitude,
    longitude,
    address: `${dest.name}, Utah`,
    county: "Salt Lake",
    region: "Wasatch Front",
    highlights: [
      "Beautiful scenery",
      "Great for families",
      "Outdoor activities",
      "Photo opportunities"
    ],
    activities: [
      "Hiking",
      "Photography",
      "Sightseeing",
      "Recreation"
    ],
    seasonality: "Year-round",
    difficulty: "Easy to Moderate",
    accessibility: "Mostly accessible",
    bestTimeToVisit: "Spring through Fall",
    nearbyAttractions: [
      "Local restaurants",
      "Shopping areas",
      "Other attractions"
    ],
    packingList: [
      "Water",
      "Sunscreen",
      "Comfortable shoes",
      "Camera"
    ],
    localTips: [
      "Visit early in the morning for fewer crowds",
      "Check weather conditions before visiting",
      "Bring plenty of water",
      "Respect the environment"
    ],
    isOlympicVenue: dest.name.includes("Olympic") || dest.name.includes("Park City"),
    isFeatured: dest.rating >= 4.5,
    isFamilyFriendly: true,
    isPetFriendly: Math.random() > 0.5,
    hasRestrooms: true,
    hasPlayground: dest.category === "Downtown & Nearby",
    parkingFree: Math.random() > 0.3,
    website: `https://${dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
    phone: `(801) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    hours: "9:00 AM - 5:00 PM",
    priceRange: "$0 - $20"
  };
});

export const mockWeather = {
  temperature: 72,
  condition: "Sunny",
  humidity: 45,
  windSpeed: 8
};

export const mockAnalytics = {
  totalVisitors: 1250,
  popularDestinations: mockDestinations.slice(0, 5),
  recentSearches: ["hiking", "skiing", "golf", "restaurants", "national parks"]
}; 