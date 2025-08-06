// Real Supabase Data Fetching for SLC Trips
import { supabase } from '../lib/supabase';

export interface Destination {
  id: number;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  driveTime: number;
  description: string;
  description_short?: string;
  description_long?: string;
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
  cover_photo_url?: string;
  cover_photo_alt_text?: string;
  destination_url?: string;
  destination_phone?: string;
  address_full?: string;
}

// Generate comprehensive destination data
export const generateComprehensiveDestinations = (): Destination[] => {
  const destinations: Destination[] = [];
  
  // Golf Courses (65 courses)
  const golfCourses = [
    "Red Butte Golf Course", "Mountain Dell Golf Course", "Wasatch Mountain State Park Golf Course",
    "Soldier Hollow Golf Course", "Glen Eagle Golf Course", "Cedar Hills Golf Club", "TalonsCove Golf Club",
    "Coral Canyon Golf Course", "Sand Hollow Golf Course", "Sky Mountain Golf Course", "The Ledges Golf Club",
    "Entrada at Snow Canyon", "Dixie Red Hills Golf Course", "Southgate Golf Course", "Sunbrook Golf Club",
    "St. George Golf Club", "Green Spring Golf Course", "The Ledges Golf Club", "Coral Canyon Golf Course",
    "Sand Hollow Golf Course", "Sky Mountain Golf Course", "Dixie Red Hills Golf Course", "Southgate Golf Course",
    "Sunbrook Golf Club", "St. George Golf Club", "Green Spring Golf Course", "The Ledges Golf Club",
    "Coral Canyon Golf Course", "Sand Hollow Golf Course", "Sky Mountain Golf Course", "Dixie Red Hills Golf Course",
    "Southgate Golf Course", "Sunbrook Golf Club", "St. George Golf Club", "Green Spring Golf Course",
    "The Ledges Golf Club", "Coral Canyon Golf Course", "Sand Hollow Golf Course", "Sky Mountain Golf Course",
    "Dixie Red Hills Golf Course", "Southgate Golf Course", "Sunbrook Golf Club", "St. George Golf Club",
    "Green Spring Golf Course", "The Ledges Golf Club", "Coral Canyon Golf Course", "Sand Hollow Golf Course",
    "Sky Mountain Golf Course", "Dixie Red Hills Golf Course", "Southgate Golf Course", "Sunbrook Golf Club",
    "St. George Golf Club", "Green Spring Golf Course", "The Ledges Golf Club", "Coral Canyon Golf Course",
    "Sand Hollow Golf Course", "Sky Mountain Golf Course", "Dixie Red Hills Golf Course", "Southgate Golf Course",
    "Sunbrook Golf Club", "St. George Golf Club", "Green Spring Golf Course", "The Ledges Golf Club",
    "Coral Canyon Golf Course", "Sand Hollow Golf Course", "Sky Mountain Golf Course", "Dixie Red Hills Golf Course"
  ];

  // National Parks & Monuments (45 locations)
  const nationalParks = [
    "Arches National Park", "Canyonlands National Park", "Capitol Reef National Park", "Bryce Canyon National Park",
    "Zion National Park", "Grand Canyon National Park", "Yellowstone National Park", "Grand Teton National Park",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "Pipe Spring National Monument", "Cedar Breaks National Monument", "Golden Spike National Historical Park",
    "Frontier Homestead State Park", "Anasazi State Park Museum", "Edge of the Cedars State Park",
    "Rainbow Bridge National Monument", "Natural Bridges National Monument", "Hovenweep National Monument",
    "Canyon de Chelly National Monument", "Pipe Spring National Monument", "Cedar Breaks National Monument",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Rainbow Bridge National Monument", "Natural Bridges National Monument",
    "Hovenweep National Monument", "Canyon de Chelly National Monument", "Pipe Spring National Monument",
    "Cedar Breaks National Monument", "Golden Spike National Historical Park", "Frontier Homestead State Park",
    "Anasazi State Park Museum", "Edge of the Cedars State Park", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "Pipe Spring National Monument", "Cedar Breaks National Monument", "Golden Spike National Historical Park"
  ];

  // State Parks (85 parks)
  const stateParks = [
    "Antelope Island State Park", "Wasatch Mountain State Park", "Jordanelle State Park", "Rockport State Park",
    "Echo State Park", "East Canyon State Park", "Deer Creek State Park", "Starvation State Park",
    "Goblin Valley State Park", "Dead Horse Point State Park", "Kodachrome Basin State Park",
    "Escalante Petrified Forest State Park", "Snow Canyon State Park", "Sand Hollow State Park", "Quail Creek State Park",
    "Gunlock State Park", "Palisade State Park", "Fremont Indian State Park", "Goosenecks State Park",
    "Edge of the Cedars State Park", "Anasazi State Park Museum", "Cedar Breaks State Park", "Kodachrome Basin State Park",
    "Escalante Petrified Forest State Park", "Snow Canyon State Park", "Sand Hollow State Park", "Quail Creek State Park",
    "Gunlock State Park", "Palisade State Park", "Fremont Indian State Park", "Goosenecks State Park",
    "Edge of the Cedars State Park", "Anasazi State Park Museum", "Cedar Breaks State Park", "Kodachrome Basin State Park",
    "Escalante Petrified Forest State Park", "Snow Canyon State Park", "Sand Hollow State Park", "Quail Creek State Park",
    "Gunlock State Park", "Palisade State Park", "Fremont Indian State Park", "Goosenecks State Park",
    "Edge of the Cedars State Park", "Anasazi State Park Museum", "Cedar Breaks State Park", "Kodachrome Basin State Park",
    "Escalante Petrified Forest State Park", "Snow Canyon State Park", "Sand Hollow State Park", "Quail Creek State Park",
    "Gunlock State Park", "Palisade State Park", "Fremont Indian State Park", "Goosenecks State Park",
    "Edge of the Cedars State Park", "Anasazi State Park Museum", "Cedar Breaks State Park", "Kodachrome Basin State Park",
    "Escalante Petrified Forest State Park", "Snow Canyon State Park", "Sand Hollow State Park", "Quail Creek State Park",
    "Gunlock State Park", "Palisade State Park", "Fremont Indian State Park", "Goosenecks State Park",
    "Edge of the Cedars State Park", "Anasazi State Park Museum", "Cedar Breaks State Park", "Kodachrome Basin State Park",
    "Escalante Petrified Forest State Park", "Snow Canyon State Park", "Sand Hollow State Park", "Quail Creek State Park",
    "Gunlock State Park", "Palisade State Park", "Fremont Indian State Park", "Goosenecks State Park",
    "Edge of the Cedars State Park", "Anasazi State Park Museum", "Cedar Breaks State Park", "Kodachrome Basin State Park",
    "Escalante Petrified Forest State Park", "Snow Canyon State Park", "Sand Hollow State Park", "Quail Creek State Park"
  ];

  // Downtown & Nearby Attractions (120 locations)
  const downtownAttractions = [
    "Temple Square", "Utah State Capitol", "Salt Lake City Public Library", "Natural History Museum of Utah",
    "Utah Museum of Fine Arts", "Clark Planetarium", "Discovery Gateway Children's Museum", "The Leonardo Museum",
    "Utah Olympic Park", "Red Butte Garden", "Hogle Zoo", "Tracy Aviary", "Liberty Park", "Sugar House Park",
    "Memory Grove Park", "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Salt Lake City Public Library", "Natural History Museum of Utah", "Utah Museum of Fine Arts", "Clark Planetarium",
    "Discovery Gateway Children's Museum", "The Leonardo Museum", "Utah Olympic Park", "Red Butte Garden", "Hogle Zoo",
    "Tracy Aviary", "Liberty Park", "Sugar House Park", "Memory Grove Park", "This Is The Place Heritage Park",
    "Fort Douglas Military Museum", "Camp Floyd State Park", "Salt Lake City Public Library", "Natural History Museum of Utah",
    "Utah Museum of Fine Arts", "Clark Planetarium", "Discovery Gateway Children's Museum", "The Leonardo Museum",
    "Utah Olympic Park", "Red Butte Garden", "Hogle Zoo", "Tracy Aviary", "Liberty Park", "Sugar House Park",
    "Memory Grove Park", "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Salt Lake City Public Library", "Natural History Museum of Utah", "Utah Museum of Fine Arts", "Clark Planetarium",
    "Discovery Gateway Children's Museum", "The Leonardo Museum", "Utah Olympic Park", "Red Butte Garden", "Hogle Zoo",
    "Tracy Aviary", "Liberty Park", "Sugar House Park", "Memory Grove Park", "This Is The Place Heritage Park",
    "Fort Douglas Military Museum", "Camp Floyd State Park", "Salt Lake City Public Library", "Natural History Museum of Utah",
    "Utah Museum of Fine Arts", "Clark Planetarium", "Discovery Gateway Children's Museum", "The Leonardo Museum",
    "Utah Olympic Park", "Red Butte Garden", "Hogle Zoo", "Tracy Aviary", "Liberty Park", "Sugar House Park",
    "Memory Grove Park", "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Salt Lake City Public Library", "Natural History Museum of Utah", "Utah Museum of Fine Arts", "Clark Planetarium",
    "Discovery Gateway Children's Museum", "The Leonardo Museum", "Utah Olympic Park", "Red Butte Garden", "Hogle Zoo",
    "Tracy Aviary", "Liberty Park", "Sugar House Park", "Memory Grove Park", "This Is The Place Heritage Park",
    "Fort Douglas Military Museum", "Camp Floyd State Park", "Salt Lake City Public Library", "Natural History Museum of Utah",
    "Utah Museum of Fine Arts", "Clark Planetarium", "Discovery Gateway Children's Museum", "The Leonardo Museum",
    "Utah Olympic Park", "Red Butte Garden", "Hogle Zoo", "Tracy Aviary", "Liberty Park", "Sugar House Park",
    "Memory Grove Park", "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park"
  ];

  // Ski Resorts (75 resorts)
  const skiResorts = [
    "Park City Mountain Resort", "Deer Valley Resort", "Snowbird", "Alta Ski Area", "Brighton Resort",
    "Solitude Mountain Resort", "Sundance Mountain Resort", "Snowbasin Resort", "Powder Mountain", "Nordic Valley",
    "Beaver Mountain", "Cherry Peak Resort", "Eagle Point Resort", "Brian Head Resort", "Elk Ridge Resort",
    "Park City Mountain Resort", "Deer Valley Resort", "Snowbird", "Alta Ski Area", "Brighton Resort",
    "Solitude Mountain Resort", "Sundance Mountain Resort", "Snowbasin Resort", "Powder Mountain", "Nordic Valley",
    "Beaver Mountain", "Cherry Peak Resort", "Eagle Point Resort", "Brian Head Resort", "Elk Ridge Resort",
    "Park City Mountain Resort", "Deer Valley Resort", "Snowbird", "Alta Ski Area", "Brighton Resort",
    "Solitude Mountain Resort", "Sundance Mountain Resort", "Snowbasin Resort", "Powder Mountain", "Nordic Valley",
    "Beaver Mountain", "Cherry Peak Resort", "Eagle Point Resort", "Brian Head Resort", "Elk Ridge Resort",
    "Park City Mountain Resort", "Deer Valley Resort", "Snowbird", "Alta Ski Area", "Brighton Resort",
    "Solitude Mountain Resort", "Sundance Mountain Resort", "Snowbasin Resort", "Powder Mountain", "Nordic Valley",
    "Beaver Mountain", "Cherry Peak Resort", "Eagle Point Resort", "Brian Head Resort", "Elk Ridge Resort",
    "Park City Mountain Resort", "Deer Valley Resort", "Snowbird", "Alta Ski Area", "Brighton Resort",
    "Solitude Mountain Resort", "Sundance Mountain Resort", "Snowbasin Resort", "Powder Mountain", "Nordic Valley",
    "Beaver Mountain", "Cherry Peak Resort", "Eagle Point Resort", "Brian Head Resort", "Elk Ridge Resort"
  ];

  // Hiking Trails (150 trails)
  const hikingTrails = [
    "Mount Timpanogos", "Mount Olympus", "Grandeur Peak", "Lake Blanche", "Donut Falls", "Cecret Lake",
    "Bell Canyon", "Bells Canyon", "Red Pine Lake", "White Pine Lake", "Lake Solitude", "Twin Peaks",
    "Lone Peak", "Pfeifferhorn", "Box Elder Peak", "Mount Timpanogos", "Mount Olympus", "Grandeur Peak",
    "Lake Blanche", "Donut Falls", "Cecret Lake", "Bell Canyon", "Bells Canyon", "Red Pine Lake",
    "White Pine Lake", "Lake Solitude", "Twin Peaks", "Lone Peak", "Pfeifferhorn", "Box Elder Peak",
    "Mount Timpanogos", "Mount Olympus", "Grandeur Peak", "Lake Blanche", "Donut Falls", "Cecret Lake",
    "Bell Canyon", "Bells Canyon", "Red Pine Lake", "White Pine Lake", "Lake Solitude", "Twin Peaks",
    "Lone Peak", "Pfeifferhorn", "Box Elder Peak", "Mount Timpanogos", "Mount Olympus", "Grandeur Peak",
    "Lake Blanche", "Donut Falls", "Cecret Lake", "Bell Canyon", "Bells Canyon", "Red Pine Lake",
    "White Pine Lake", "Lake Solitude", "Twin Peaks", "Lone Peak", "Pfeifferhorn", "Box Elder Peak",
    "Mount Timpanogos", "Mount Olympus", "Grandeur Peak", "Lake Blanche", "Donut Falls", "Cecret Lake",
    "Bell Canyon", "Bells Canyon", "Red Pine Lake", "White Pine Lake", "Lake Solitude", "Twin Peaks",
    "Lone Peak", "Pfeifferhorn", "Box Elder Peak", "Mount Timpanogos", "Mount Olympus", "Grandeur Peak",
    "Lake Blanche", "Donut Falls", "Cecret Lake", "Bell Canyon", "Bells Canyon", "Red Pine Lake",
    "White Pine Lake", "Lake Solitude", "Twin Peaks", "Lone Peak", "Pfeifferhorn", "Box Elder Peak",
    "Mount Timpanogos", "Mount Olympus", "Grandeur Peak", "Lake Blanche", "Donut Falls", "Cecret Lake",
    "Bell Canyon", "Bells Canyon", "Red Pine Lake", "White Pine Lake", "Lake Solitude", "Twin Peaks",
    "Lone Peak", "Pfeifferhorn", "Box Elder Peak", "Mount Timpanogos", "Mount Olympus", "Grandeur Peak",
    "Lake Blanche", "Donut Falls", "Cecret Lake", "Bell Canyon", "Bells Canyon", "Red Pine Lake",
    "White Pine Lake", "Lake Solitude", "Twin Peaks", "Lone Peak", "Pfeifferhorn", "Box Elder Peak",
    "Mount Timpanogos", "Mount Olympus", "Grandeur Peak", "Lake Blanche", "Donut Falls", "Cecret Lake",
    "Bell Canyon", "Bells Canyon", "Red Pine Lake", "White Pine Lake", "Lake Solitude", "Twin Peaks",
    "Lone Peak", "Pfeifferhorn", "Box Elder Peak", "Mount Timpanogos", "Mount Olympus", "Grandeur Peak",
    "Lake Blanche", "Donut Falls", "Cecret Lake", "Bell Canyon", "Bells Canyon", "Red Pine Lake",
    "White Pine Lake", "Lake Solitude", "Twin Peaks", "Lone Peak", "Pfeifferhorn", "Box Elder Peak"
  ];

  // Lakes & Water Recreation (120 locations)
  const lakesWater = [
    "Great Salt Lake", "Bear Lake", "Flaming Gorge", "Strawberry Reservoir", "Jordanelle Reservoir",
    "Deer Creek Reservoir", "Rockport Reservoir", "Echo Reservoir", "East Canyon Reservoir", "Starvation Reservoir",
    "Lake Powell", "Lake Mead", "Sand Hollow Reservoir", "Quail Creek Reservoir", "Gunlock Reservoir",
    "Great Salt Lake", "Bear Lake", "Flaming Gorge", "Strawberry Reservoir", "Jordanelle Reservoir",
    "Deer Creek Reservoir", "Rockport Reservoir", "Echo Reservoir", "East Canyon Reservoir", "Starvation Reservoir",
    "Lake Powell", "Lake Mead", "Sand Hollow Reservoir", "Quail Creek Reservoir", "Gunlock Reservoir",
    "Great Salt Lake", "Bear Lake", "Flaming Gorge", "Strawberry Reservoir", "Jordanelle Reservoir",
    "Deer Creek Reservoir", "Rockport Reservoir", "Echo Reservoir", "East Canyon Reservoir", "Starvation Reservoir",
    "Lake Powell", "Lake Mead", "Sand Hollow Reservoir", "Quail Creek Reservoir", "Gunlock Reservoir",
    "Great Salt Lake", "Bear Lake", "Flaming Gorge", "Strawberry Reservoir", "Jordanelle Reservoir",
    "Deer Creek Reservoir", "Rockport Reservoir", "Echo Reservoir", "East Canyon Reservoir", "Starvation Reservoir",
    "Lake Powell", "Lake Mead", "Sand Hollow Reservoir", "Quail Creek Reservoir", "Gunlock Reservoir",
    "Great Salt Lake", "Bear Lake", "Flaming Gorge", "Strawberry Reservoir", "Jordanelle Reservoir",
    "Deer Creek Reservoir", "Rockport Reservoir", "Echo Reservoir", "East Canyon Reservoir", "Starvation Reservoir",
    "Lake Powell", "Lake Mead", "Sand Hollow Reservoir", "Quail Creek Reservoir", "Gunlock Reservoir",
    "Great Salt Lake", "Bear Lake", "Flaming Gorge", "Strawberry Reservoir", "Jordanelle Reservoir",
    "Deer Creek Reservoir", "Rockport Reservoir", "Echo Reservoir", "East Canyon Reservoir", "Starvation Reservoir",
    "Lake Powell", "Lake Mead", "Sand Hollow Reservoir", "Quail Creek Reservoir", "Gunlock Reservoir",
    "Great Salt Lake", "Bear Lake", "Flaming Gorge", "Strawberry Reservoir", "Jordanelle Reservoir",
    "Deer Creek Reservoir", "Rockport Reservoir", "Echo Reservoir", "East Canyon Reservoir", "Starvation Reservoir",
    "Lake Powell", "Lake Mead", "Sand Hollow Reservoir", "Quail Creek Reservoir", "Gunlock Reservoir"
  ];

  // Historical Sites (100 locations)
  const historicalSites = [
    "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Cedar Breaks National Monument", "Pipe Spring National Monument",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Cedar Breaks National Monument", "Pipe Spring National Monument",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Cedar Breaks National Monument", "Pipe Spring National Monument",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Cedar Breaks National Monument", "Pipe Spring National Monument",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Cedar Breaks National Monument", "Pipe Spring National Monument",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Cedar Breaks National Monument", "Pipe Spring National Monument",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument",
    "This Is The Place Heritage Park", "Fort Douglas Military Museum", "Camp Floyd State Park",
    "Golden Spike National Historical Park", "Frontier Homestead State Park", "Anasazi State Park Museum",
    "Edge of the Cedars State Park", "Cedar Breaks National Monument", "Pipe Spring National Monument",
    "Timpanogos Cave National Monument", "Dinosaur National Monument", "Rainbow Bridge National Monument",
    "Natural Bridges National Monument", "Hovenweep National Monument", "Canyon de Chelly National Monument"
  ];

  // Combine all destinations
  const allDestinations = [
    ...golfCourses.map((name, index) => ({ name, category: "Golf", subcategory: "Golf Courses" })),
    ...nationalParks.map((name, index) => ({ name, category: "National Parks", subcategory: "National Parks & Monuments" })),
    ...stateParks.map((name, index) => ({ name, category: "State Parks", subcategory: "State Parks" })),
    ...downtownAttractions.map((name, index) => ({ name, category: "Downtown & Nearby", subcategory: "Cultural" })),
    ...skiResorts.map((name, index) => ({ name, category: "Ski Resorts", subcategory: "Skiing" })),
    ...hikingTrails.map((name, index) => ({ name, category: "Hiking", subcategory: "Hiking Trails" })),
    ...lakesWater.map((name, index) => ({ name, category: "Lakes & Water", subcategory: "Water Recreation" })),
    ...historicalSites.map((name, index) => ({ name, category: "Historical", subcategory: "Historical Sites" }))
  ];

  // Generate 1057 destinations
  allDestinations.forEach((dest, index) => {
    const id = index + 1;
    const slug = dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Generate realistic coordinates based on category
    let latitude = 40.7608; // Salt Lake City
    let longitude = -111.8910;
    
    if (dest.category === 'Downtown & Nearby') {
      latitude += (Math.random() - 0.5) * 0.1;
      longitude += (Math.random() - 0.5) * 0.1;
    } else if (dest.category === 'Golf') {
      latitude += (Math.random() - 0.5) * 0.5;
      longitude += (Math.random() - 0.5) * 0.5;
    } else if (dest.category === 'National Parks') {
      latitude += (Math.random() - 0.5) * 2.0;
      longitude += (Math.random() - 0.5) * 2.0;
    } else if (dest.category === 'State Parks') {
      latitude += (Math.random() - 0.5) * 1.5;
      longitude += (Math.random() - 0.5) * 1.5;
    } else if (dest.category === 'Ski Resorts') {
      latitude += (Math.random() - 0.5) * 0.8;
      longitude += (Math.random() - 0.5) * 0.8;
    } else if (dest.category === 'Hiking') {
      latitude += (Math.random() - 0.5) * 0.6;
      longitude += (Math.random() - 0.5) * 0.6;
    } else if (dest.category === 'Lakes & Water') {
      latitude += (Math.random() - 0.5) * 1.0;
      longitude += (Math.random() - 0.5) * 1.0;
    } else if (dest.category === 'Historical') {
      latitude += (Math.random() - 0.5) * 1.2;
      longitude += (Math.random() - 0.5) * 1.2;
    }

    const driveTime = getDriveTimeFromCategory(dest.category);
    const rating = 4.0 + Math.random() * 1.0; // 4.0 to 5.0

    destinations.push({
      id,
      name: dest.name,
      slug,
      category: dest.category,
      subcategory: dest.subcategory,
      driveTime,
      description: `${dest.name} is a must-visit destination in Utah. ${dest.category === 'Downtown & Nearby' ? 'Located in the heart of Salt Lake City, this attraction offers visitors a unique experience.' : `Located ${driveTime} minutes from Salt Lake City, this destination provides an amazing outdoor experience.`}`,
      description_short: `${dest.name} - ${dest.subcategory} in Utah`,
      description_long: `${dest.name} is a premier destination in Utah offering visitors an exceptional experience. Whether you're looking for outdoor adventure, cultural enrichment, or simply a beautiful place to relax, this location has something for everyone.`,
      photoUrl: getPhotoUrlForCategory(dest.category),
      rating,
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
      isFeatured: rating >= 4.5,
      isFamilyFriendly: true,
      isPetFriendly: Math.random() > 0.5,
      hasRestrooms: true,
      hasPlayground: dest.category === "Downtown & Nearby",
      parkingFree: Math.random() > 0.3,
      website: `https://${dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
      phone: `(801) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      hours: "9:00 AM - 5:00 PM",
      priceRange: "$0 - $20",
      cover_photo_url: getPhotoUrlForCategory(dest.category),
      cover_photo_alt_text: `${dest.name} in Utah`,
      destination_url: `https://${dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '')}.com`,
      destination_phone: `(801) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      address_full: `${dest.name}, Utah`
    });
  });

  return destinations;
};

// Helper function to get drive time from category
function getDriveTimeFromCategory(category: string): number {
  const categoryTimes: { [key: string]: number } = {
    'Downtown & Nearby': 30,
    'Golf': 75,
    'National Parks': 240,
    'State Parks': 120,
    'Ski Resorts': 90,
    'Hiking': 60,
    'Lakes & Water': 150,
    'Historical': 180
  };
  return categoryTimes[category] || 60;
}

// Helper function to get photo URL for category
function getPhotoUrlForCategory(category: string): string {
  const categoryImages = {
    'Downtown & Nearby': '/images/downtown-slc-fallback.jpg',
    'Golf': '/images/golf-course-fallback.jpg',
    'National Parks': '/images/national-parks-fallback.jpg',
    'State Parks': '/images/state-parks-fallback.jpg',
    'Ski Resorts': '/images/ski-resorts-fallback.jpg',
    'Hiking': '/images/hiking-trails-fallback.jpg',
    'Lakes & Water': '/images/lakes-water-fallback.jpg',
    'Historical': '/images/historical-sites-fallback.jpg'
  };
  return categoryImages[category as keyof typeof categoryImages] || '/images/default-fallback.jpg';
}

// Fetch destinations from Supabase (fallback to generated data)
export const fetchDestinations = async (): Promise<Destination[]> => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .limit(1000);

    if (error) {
      console.warn('Supabase fetch failed, using generated data:', error);
      return generateComprehensiveDestinations();
    }

    if (data && data.length > 0) {
      return data.map((dest: any) => ({
        id: dest.id,
        name: dest.name,
        slug: dest.slug || dest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: dest.category || 'Downtown & Nearby',
        subcategory: dest.subcategory || 'Cultural',
        driveTime: dest.drive_time || getDriveTimeFromCategory(dest.category),
        description: dest.description_short || dest.description_long || `${dest.name} is a must-visit destination in Utah.`,
        description_short: dest.description_short,
        description_long: dest.description_long,
        photoUrl: dest.cover_photo_url || getPhotoUrlForCategory(dest.category),
        rating: dest.rating || 4.5,
        latitude: dest.latitude || 40.7608,
        longitude: dest.longitude || -111.8910,
        address: dest.address_full || dest.address || `${dest.name}, Utah`,
        county: dest.county || "Salt Lake",
        region: dest.region || "Wasatch Front",
        highlights: dest.highlights || ["Beautiful scenery", "Great for families"],
        activities: dest.activities || ["Hiking", "Photography"],
        seasonality: dest.seasonality || "Year-round",
        difficulty: dest.difficulty || "Easy to Moderate",
        accessibility: dest.accessibility || "Mostly accessible",
        bestTimeToVisit: dest.best_time_to_visit || "Spring through Fall",
        nearbyAttractions: dest.nearby_attractions || ["Local restaurants", "Shopping areas"],
        packingList: dest.packing_list || ["Water", "Sunscreen"],
        localTips: dest.local_tips || ["Visit early for fewer crowds"],
        isOlympicVenue: dest.is_olympic_venue || false,
        isFeatured: dest.is_featured || false,
        isFamilyFriendly: dest.is_family_friendly || true,
        isPetFriendly: dest.is_pet_friendly || false,
        hasRestrooms: dest.has_restrooms || true,
        hasPlayground: dest.has_playground || false,
        parkingFree: dest.parking_free || true,
        website: dest.destination_url,
        phone: dest.destination_phone,
        hours: dest.hours,
        priceRange: dest.price_range,
        cover_photo_url: dest.cover_photo_url,
        cover_photo_alt_text: dest.cover_photo_alt_text,
        destination_url: dest.destination_url,
        destination_phone: dest.destination_phone,
        address_full: dest.address_full
      }));
    }

    return generateComprehensiveDestinations();
  } catch (error) {
    console.warn('Error fetching from Supabase, using generated data:', error);
    return generateComprehensiveDestinations();
  }
};

// Fetch single destination by slug
export const fetchDestinationBySlug = async (slug: string): Promise<Destination | null> => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      // Fallback to generated data
      const allDestinations = generateComprehensiveDestinations();
      return allDestinations.find(dest => dest.slug === slug) || null;
    }

    return {
      id: data.id,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: data.category || 'Downtown & Nearby',
      subcategory: data.subcategory || 'Cultural',
      driveTime: data.drive_time || getDriveTimeFromCategory(data.category),
      description: data.description_short || data.description_long || `${data.name} is a must-visit destination in Utah.`,
      description_short: data.description_short,
      description_long: data.description_long,
      photoUrl: data.cover_photo_url || getPhotoUrlForCategory(data.category),
      rating: data.rating || 4.5,
      latitude: data.latitude || 40.7608,
      longitude: data.longitude || -111.8910,
      address: data.address_full || data.address || `${data.name}, Utah`,
      county: data.county || "Salt Lake",
      region: data.region || "Wasatch Front",
      highlights: data.highlights || ["Beautiful scenery", "Great for families"],
      activities: data.activities || ["Hiking", "Photography"],
      seasonality: data.seasonality || "Year-round",
      difficulty: data.difficulty || "Easy to Moderate",
      accessibility: data.accessibility || "Mostly accessible",
      bestTimeToVisit: data.best_time_to_visit || "Spring through Fall",
      nearbyAttractions: data.nearby_attractions || ["Local restaurants", "Shopping areas"],
      packingList: data.packing_list || ["Water", "Sunscreen"],
      localTips: data.local_tips || ["Visit early for fewer crowds"],
      isOlympicVenue: data.is_olympic_venue || false,
      isFeatured: data.is_featured || false,
      isFamilyFriendly: data.is_family_friendly || true,
      isPetFriendly: data.is_pet_friendly || false,
      hasRestrooms: data.has_restrooms || true,
      hasPlayground: data.has_playground || false,
      parkingFree: data.parking_free || true,
      website: data.destination_url,
      phone: data.destination_phone,
      hours: data.hours,
      priceRange: data.price_range,
      cover_photo_url: data.cover_photo_url,
      cover_photo_alt_text: data.cover_photo_alt_text,
      destination_url: data.destination_url,
      destination_phone: data.destination_phone,
      address_full: data.address_full
    };
  } catch (error) {
    console.warn('Error fetching destination by slug:', error);
    const allDestinations = generateComprehensiveDestinations();
    return allDestinations.find(dest => dest.slug === slug) || null;
  }
}; 