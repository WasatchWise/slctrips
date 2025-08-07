import { useState, useEffect } from "react";
import { MapPin, Navigation, Compass } from "lucide-react";
import { useLocation } from "wouter";
import { useFeaturedDestinations } from "../utils/getFeaturedDestinations";

// Use official SLC Airport logo with fallback
const airportLogo = "https://slcairport.com/wp-content/uploads/2020/10/slc-logo.png";

// Salt Lake City International Airport coordinates (center point)
const SLC_AIRPORT = { lat: 40.7884, lng: -111.9778 };

// Ring data for the bulls-eye - Ordered from shortest to longest distance
const RINGS = [
  {
    id: "30min",
    label: "Downtown & Nearby",
    shortLabel: "30 min",
    buttonLabel: "30 minutes",
    time: "30 minutes or less",
    color: "#f4b441", // Pioneer Gold (30 min)
    bgGradient: "linear-gradient(135deg, #f4b441 0%, #ffd700 50%, #f4b441 100%)", // Vibrant Gold Gradient
    size: 130,
    position: 1,
    examples: ["Temple Square", "Liberty Park", "Red Butte Garden"],
    count: 371
  },
  {
    id: "90min",
    label: "90 Minutes or Less",
    shortLabel: "90 min",
    buttonLabel: "90 minutes",
    time: "90 minutes or less",
    color: "#b33c1a", // Canyon Red (90 min)
    bgGradient: "linear-gradient(135deg, #b33c1a 0%, #ff6b35 50%, #b33c1a 100%)", // Vibrant Red Gradient
    size: 200,
    position: 2,
    examples: ["Park City", "Antelope Island", "Timpanogos Cave"],
    count: 131
  },
  {
    id: "3hr",
    label: "3 Hours or Less",
    shortLabel: "3h",
    buttonLabel: "3 hours",
    time: "Regional adventures",
    color: "#0087c8", // Great Salt Blue (3 hours)
    bgGradient: "linear-gradient(135deg, #0087c8 0%, #00bfff 50%, #0087c8 100%)", // Vibrant Blue Gradient
    size: 280,
    position: 3,
    examples: ["Moab Area", "Capitol Reef", "Goblin Valley"],
    count: 77
  },
  {
    id: "5hr",
    label: "5 Hours or Less",
    shortLabel: "5h",
    buttonLabel: "5 hours",
    time: "Day trip destinations",
    color: "#2e8b57", // Sea Green (5 hours)
    bgGradient: "linear-gradient(135deg, #2e8b57 0%, #00ff7f 50%, #2e8b57 100%)", // Vibrant Green Gradient
    size: 360,
    position: 4,
    examples: ["Zion National Park", "Bryce Canyon", "Lake Powell"],
    count: 99
  },
  {
    id: "8hr",
    label: "8 Hours or Less",
    shortLabel: "8h",
    buttonLabel: "8 hours",
    time: "Weekend getaways",
    color: "#6a1b9a", // Deep Purple (8 hours)
    bgGradient: "linear-gradient(135deg, #6a1b9a 0%, #9c27b0 50%, #6a1b9a 100%)", // Vibrant Purple Gradient
    size: 440,
    position: 5,
    examples: ["Extended weekend trips", "Multi-state adventures"],
    count: 21
  },
  {
    id: "12hr",
    label: "12 Hours or Less",
    shortLabel: "12h",
    buttonLabel: "12 hours",
    time: "Extended adventures",
    color: "#ff9800", // Burnt Orange (12 hours)
    bgGradient: "linear-gradient(135deg, #ff9800 0%, #ff5722 50%, #ff9800 100%)", // Vibrant Orange Gradient
    size: 520,
    position: 6,
    examples: ["Arches", "Canyonlands", "Grand Canyon"],
    count: 16
  }
];

// Cardinal directions with examples - Corrected for proper compass orientation
const DIRECTIONS = [
  {
    direction: "NORTH",
    label: "North",
    examples: ["Ogden", "Logan", "Bear Lake"],
    color: "#3b82f6", // Blue
    icon: "⬆️",
    angle: -90 // North at top (270 degrees from right)
  },
  {
    direction: "EAST", 
    label: "East",
    examples: ["Park City", "Heber", "Uinta Mountains"],
    color: "#10b981", // Green
    icon: "➡️",
    angle: 0 // East at right (0 degrees)
  },
  {
    direction: "SOUTH",
    label: "South", 
    examples: ["Provo", "Moab", "Zion"],
    color: "#ef4444", // Red
    icon: "⬇️",
    angle: 90 // South at bottom (90 degrees from right)
  },
  {
    direction: "WEST",
    label: "West",
    examples: ["Tooele", "Wendover", "Great Salt Lake"],
    color: "#f59e0b", // Orange
    icon: "⬅️",
    angle: 180 // West at left (180 degrees from right)
  }
];

// Function to get today's rotating picks based on date
function getTodaysPicks(destinations: any[], maxPicks: number = 6): any[] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Use day of year to create a deterministic but rotating selection
  const shuffled = [...destinations].sort((a, b) => {
    const hashA = (a.id * dayOfYear) % 1000;
    const hashB = (b.id * dayOfYear) % 1000;
    return hashA - hashB;
  });
  
  // Filter destinations with coordinates
  const withCoordinates = shuffled.filter(dest => {
    const hasLatLng = !!(dest.latitude && dest.longitude);
    const hasCoordinates = !!(dest.coordinates && dest.coordinates.lat && dest.coordinates.lng);
    return hasLatLng || hasCoordinates;
  });
  
  return withCoordinates.slice(0, maxPicks);
}

// Function to convert geographic coordinates to bulls-eye position
function geoToBullsEyePosition(dest: any, centerLat: number, centerLng: number, maxRadius: number = 250): { x: number, y: number } {
  // Get coordinates from either latitude/longitude fields or coordinates JSON
  let lat = dest.latitude;
  let lng = dest.longitude;
  
  if (!lat || !lng) {
    // Try coordinates JSON
    if (dest.coordinates && dest.coordinates.lat && dest.coordinates.lng) {
      lat = dest.coordinates.lat;
      lng = dest.coordinates.lng;
    } else {
      // No coordinates available, use fallback positioning
      return { x: 0, y: 0 };
    }
  }
  
  // Calculate distance from SLC Airport
  const R = 6371; // Earth's radius in km
  const dLat = (lat - centerLat) * Math.PI / 180;
  const dLng = (lng - centerLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(centerLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  
  // Calculate bearing (direction)
  const y = Math.sin(dLng) * Math.cos(lat * Math.PI / 180);
  const x = Math.cos(centerLat * Math.PI / 180) * Math.sin(lat * Math.PI / 180) -
            Math.sin(centerLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.cos(dLng);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;
  
  // Convert to bulls-eye coordinates
  // Scale distance to fit within the bulls-eye (max ~250px radius)
  const scaledDistance = Math.min(distance * 50, maxRadius); // 50px per km, max 250px
  
  const xPos = Math.cos(bearing * Math.PI / 180) * scaledDistance;
  const yPos = Math.sin(bearing * Math.PI / 180) * scaledDistance;
  
  return { x: xPos, y: yPos };
}

export function BullsEyeExplorerSimple() {
  const { destinations, loading, error } = useFeaturedDestinations();
  const [selectedRing, setSelectedRing] = useState<string | null>(null);
  const [hoveredDestination, setHoveredDestination] = useState<any | null>(null);
  const [todaysPicks, setTodaysPicks] = useState<any[]>([]);
  const [location, setLocation] = useLocation();

  // Get today's rotating picks when destinations load
  useEffect(() => {
    if (destinations.length > 0) {
      const picks = getTodaysPicks(destinations, 8); // Show 8 picks
      setTodaysPicks(picks);
      console.log('Today\'s picks:', picks.map(p => ({ name: p.name, lat: p.latitude, lng: p.longitude })));
    }
  }, [destinations]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading destinations: {error}
      </div>
    );
  }

  // Filter destinations by selected ring
  const getDestinationsForRing = (ringId: string) => {
    const ring = RINGS.find(r => r.id === ringId);
    if (!ring) return todaysPicks;
    
    // Filter by category instead of drive time since API doesn't have drive_time
    return todaysPicks.filter(dest => {
      const category = dest.category || '';
      switch (ringId) {
        case '30min': return category === 'Downtown & Nearby';
        case '90min': return category === 'Less than 90 Minutes';
        case '3hr': return category === 'Less than 3 Hours';
        case '5hr': return category === 'Less than 5 Hours';
        case '8hr': return category === 'Less than 8 Hours';
        case '12hr': return category === 'Less than 12 Hours';
        default: return true;
      }
    });
  };

  // Handle ring click to navigate to destinations page
  const handleRingClick = (ringId: string) => {
    const categoryMap: Record<string, string> = {
      '30min': 'Downtown & Nearby',
      '90min': 'Less than 90 Minutes',
      '3hr': 'Less than 3 Hours',
      '5hr': 'Less than 5 Hours',
      '8hr': 'Less than 8 Hours',
      '12hr': 'Less than 12 Hours'
    };
    
    const category = categoryMap[ringId];
    if (category) {
      setLocation(`/destinations?category=${encodeURIComponent(category)}`);
    }
  };

  return (
    <div className="relative w-full h-[1000px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
      {/* Compass Title */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <Compass className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-blue-800">Today's Picks - Drive Time Compass</span>
        </div>
      </div>

      {/* Cardinal Direction Labels */}
      {DIRECTIONS.map((dir) => {
        const angle = (dir.angle * Math.PI) / 180;
        // Different radius for West and East to place them outside the bullseye
        const radius = (dir.direction === "WEST" || dir.direction === "EAST") ? 400 : 320;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return (
          <div
            key={dir.direction}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
            }}
          >
            <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border-2 border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: dir.color }}>
                  {dir.icon} {dir.label}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {dir.examples.join(", ")}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Bulls-eye rings with drive time labels */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Drive time rings - from outer to inner */}
        {RINGS.slice().reverse().map((ring, index) => (
          <div
            key={ring.id}
            className={`absolute rounded-full border-2 border-white shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 ${
              selectedRing === ring.id ? 'ring-4 ring-blue-400 scale-105' : 'hover:scale-105'
            }`}
            style={{
              width: `${ring.size}px`,
              height: `${ring.size}px`,
              background: selectedRing === ring.id ? ring.bgGradient : ring.bgGradient.replace('100%)', '60%)'), // Use gradient with opacity
              borderColor: ring.color,
              opacity: selectedRing === ring.id ? 0.9 : 0.7,
            }}
            onClick={() => handleRingClick(ring.id)}
          >
            {/* Ring label */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg border border-gray-200">
              <div className="text-sm font-bold" style={{ color: ring.color }}>
                {ring.shortLabel}
              </div>
            </div>
          </div>
        ))}

        {/* Center - SLC Airport with compass indicator */}
        <div className="absolute w-20 h-20 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg">
          <div className="relative">
            <img 
              src={airportLogo} 
              alt="SLC Airport" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=100&h=100&fit=crop";
              }}
            />
            {/* Compass rose indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <Navigation className="w-2 h-2 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive drive time buttons */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-2 flex-wrap justify-center">
          {RINGS.map((ring) => (
            <button
              key={ring.id}
              className={`px-3 py-1 rounded-full text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform duration-200 ${
                selectedRing === ring.id ? 'ring-2 ring-white scale-110' : ''
              }`}
              style={{ backgroundColor: ring.color }}
              onClick={() => handleRingClick(ring.id)}
            >
              {ring.buttonLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Geographically correct destination pins for today's picks */}
      {todaysPicks.map((destination) => {
        const position = geoToBullsEyePosition(destination, SLC_AIRPORT.lat, SLC_AIRPORT.lng);
        
        // Skip if no coordinates available
        if (position.x === 0 && position.y === 0) {
          return null;
        }

        // Determine pin color based on drive time
        const driveTime = destination.driveTime || destination.drive_time || 0;
        let pinColor = "#ef4444"; // Default red
        
        if (driveTime <= 30) pinColor = "#f4b441"; // Pioneer Gold
        else if (driveTime <= 90) pinColor = "#b33c1a"; // Canyon Red
        else if (driveTime <= 180) pinColor = "#0087c8"; // Great Salt Blue
        else if (driveTime <= 300) pinColor = "#2e8b57"; // Sea Green
        else if (driveTime <= 480) pinColor = "#6a1b9a"; // Deep Purple
        else pinColor = "#ff9800"; // Burnt Orange

        return (
          <div
            key={destination.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-5"
            onMouseEnter={() => setHoveredDestination(destination)}
            onMouseLeave={() => setHoveredDestination(null)}
            style={{
              left: `calc(50% + ${position.x}px)`,
              top: `calc(50% + ${position.y}px)`,
            }}
          >
            {/* Pin with pulse animation and photo */}
            <div 
              className="w-6 h-6 rounded-full shadow-lg group-hover:scale-150 transition-transform duration-200 relative overflow-hidden"
              style={{ backgroundColor: pinColor }}
            >
              {/* Destination photo */}
              <img 
                src={destination.image_url || destination.photo_url || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=face`}
                alt={destination.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=face`;
                }}
              />
              {/* Pulse effect */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-75" style={{ backgroundColor: pinColor }}></div>
              {/* Border */}
              <div className="absolute inset-0 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Enhanced pin label with photo */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 min-w-[200px]">
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <img 
                    src={destination.image_url || destination.photo_url || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=50&h=50&fit=crop&crop=face`}
                    alt={destination.name}
                    className="w-8 h-8 rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=50&h=50&fit=crop&crop=face`;
                    }}
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{destination.name}</div>
                    <div className="text-gray-600 text-xs">{destination.category}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-500">{driveTime} min drive</span>
                  <span className="px-2 py-1 rounded-full text-white text-xs" style={{ backgroundColor: pinColor }}>
                    {destination.subcategory || 'Destination'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Instructions */}
      <div className="absolute top-20 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-xs">
          <div className="text-sm text-gray-700">
            <div className="font-semibold mb-1">Today's Picks:</div>
            <div className="text-xs space-y-1">
              <div>• {todaysPicks.length} destinations with real coordinates</div>
              <div>• Click drive time buttons to filter</div>
              <div>• Hover over pins for details</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {(selectedRing || hoveredDestination) && (
        <div className="absolute top-20 right-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg max-w-xs">
            <div className="text-sm text-gray-700">
              {selectedRing && (
                <div className="mb-2">
                  <div className="font-semibold">Selected: {RINGS.find(r => r.id === selectedRing)?.label}</div>
                  <div className="text-xs text-gray-600">
                    {getDestinationsForRing(selectedRing).length} destinations in this zone
                  </div>
                </div>
              )}
              {hoveredDestination && (
                <div>
                  <div className="font-semibold">{hoveredDestination.name}</div>
                  <div className="text-xs text-gray-600">
                    {hoveredDestination.category} • {hoveredDestination.driveTime || hoveredDestination.drive_time || 'Unknown'} min
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Lat: {hoveredDestination.latitude || hoveredDestination.coordinates?.lat || 'N/A'}, 
                    Lng: {hoveredDestination.longitude || hoveredDestination.coordinates?.lng || 'N/A'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}