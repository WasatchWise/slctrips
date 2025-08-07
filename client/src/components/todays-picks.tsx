import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { MapPin, Calendar, Star, Clock } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  description?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
}

interface TodaysPicksProps {
  destinations: Destination[];
  maxPicks?: number;
}

// Function to get today's rotating picks based on date
function getTodaysPicks(destinations: Destination[], maxPicks: number = 6): Destination[] {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Use day of year to create a deterministic but rotating selection
  const shuffled = [...destinations].sort((a, b) => {
    const hashA = (a.id.charCodeAt(0) * dayOfYear) % 1000;
    const hashB = (b.id.charCodeAt(0) * dayOfYear) % 1000;
    return hashA - hashB;
  });
  
  // Filter destinations with good data
  const validDestinations = shuffled.filter(dest => 
    dest.name && dest.slug && dest.category
  );
  
  return validDestinations.slice(0, maxPicks);
}

// Function to get category color
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Downtown & Nearby': 'bg-green-100 text-green-800 border-green-200',
    'Less than 90 Minutes': 'bg-blue-100 text-blue-800 border-blue-200',
    'Less than 3 Hours': 'bg-purple-100 text-purple-800 border-purple-200',
    'Less than 5 Hours': 'bg-orange-100 text-orange-800 border-orange-200',
    'Less than 8 Hours': 'bg-red-100 text-red-800 border-red-200',
    'Less than 12 Hours': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'A little bit farther': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
}

// Function to get drive time from category
function getDriveTime(category: string): string {
  const driveTimes: Record<string, string> = {
    'Downtown & Nearby': '30 min',
    'Less than 90 Minutes': '90 min',
    'Less than 3 Hours': '3 hr',
    'Less than 5 Hours': '5 hr',
    'Less than 8 Hours': '8 hr',
    'Less than 12 Hours': '12 hr',
    'A little bit farther': '12+ hr'
  };
  
  return driveTimes[category] || 'Unknown';
}

export function TodaysPicks({ destinations, maxPicks = 6 }: TodaysPicksProps) {
  const [, setLocation] = useLocation();
  const [todaysPicks, setTodaysPicks] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (destinations.length > 0) {
      const picks = getTodaysPicks(destinations, maxPicks);
      setTodaysPicks(picks);
      setLoading(false);
    }
  }, [destinations, maxPicks]);

  const handleDestinationClick = (destination: Destination) => {
    setLocation(`/destinations/${destination.slug}`);
  };

  const handleCategoryClick = (category: string) => {
    setLocation(`/destinations?category=${encodeURIComponent(category)}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading today's picks...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-xl font-bold text-white">Today's Picks</h2>
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white text-sm">Curated for you</div>
            <div className="text-blue-100 text-xs">Updated daily</div>
          </div>
        </div>
      </div>

      {/* Picks Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {todaysPicks.map((destination, index) => (
            <div
              key={destination.id}
              className="group cursor-pointer bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
              onClick={() => handleDestinationClick(destination)}
            >
              {/* Destination Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {destination.name}
                  </h3>
                </div>
                {destination.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{destination.rating}</span>
                  </div>
                )}
              </div>

              {/* Category Badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(destination.category)} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(destination.category);
                  }}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  {getDriveTime(destination.category)}
                </span>
              </div>

              {/* Description */}
              {destination.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {destination.description}
                </p>
              )}

              {/* Subcategory */}
              {destination.subcategory && (
                <div className="text-xs text-gray-500">
                  {destination.subcategory}
                </div>
              )}

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-10 transition-opacity rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Based on {destinations.length} destinations</span>
            <button
              onClick={() => setLocation('/destinations')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Destinations →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
