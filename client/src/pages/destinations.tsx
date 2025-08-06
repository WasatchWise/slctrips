import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MapPin, Clock, Filter, Grid, List, ChevronUp, Home, ArrowRight, Star } from "lucide-react";
import { CleanNavigation } from "../components/clean-navigation";
import { Footer } from "../components/footer";
import { getMainPhoto } from "../utils/getPhotoUrl";

interface Photo {
  url: string;
  caption?: string;
  source?: string;
  verified?: boolean;
}

interface Destination {
  uuid: string;
  name: string;
  slug: string;
  tagline: string;
  description_short: string;
  description_long: string;
  description?: string;
  address?: string;
  latitude: number;
  longitude: number;
  address_full: string;
  county: string;
  region: string;
  drive_minutes: number;
  driveTime?: number;
  distance_miles: number;
  pet_policy_allowed: boolean;
  is_pet_friendly?: boolean;
  is_featured: boolean;
  is_family_friendly: boolean;
  is_stroller_friendly: boolean;
  has_playground: boolean;
  parking_no: boolean;
  parking_variable: boolean;
  parking_limited: boolean;
  parking_true: boolean;
  is_parking_free: boolean;
  has_restrooms: boolean;
  has_visitor_center: boolean;
  is_season_spring: boolean;
  is_season_summer: boolean;
  is_season_fall: boolean;
  is_season_winter: boolean;
  is_season_all: boolean;
  cover_photo_url: string;
  cover_photo_alt_text: string;
  category: string;
  destination_url: string;
  content_status: string;
  updated_at: string;
  photos?: Photo[];
  is_olympic_venue?: boolean;
}

const CATEGORIES = [
  { name: 'All', value: '' },
  { name: 'Downtown & Nearby', value: 'Downtown & Nearby' },
  { name: 'Less than 90 Minutes', value: 'Less than 90 Minutes' },
  { name: 'Less than 3 Hours', value: 'Less than 3 Hours' },
  { name: 'Less than 5 Hours', value: 'Less than 5 Hours' },
  { name: 'Less than 8 Hours', value: 'Less than 8 Hours' },
  { name: 'Less than 12 Hours', value: 'Less than 12 Hours' },
  { name: 'A little bit farther', value: 'A little bit farther' }
];

const getCategoryStyle = (category: string) => {
  switch (category) {
    case '30 MIN':
      return 'category-downtown';
    case '1-2 HRS':
      return 'category-natural';
    case 'ROAD TRIPS':
      return 'category-epic';
    case 'WEEKEND':
      return 'category-ultimate';
    case 'STATE PARKS':
      return 'category-ski';
    case 'NATIONAL':
      return 'category-national';
    default:
      return 'bg-gray-600';
  }
};

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sortBy, setSortBy] = useState('driveTime');

  // Parse URL parameters for category filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  // Handle scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const response = await fetch('/api/destinations');
        if (!response.ok) throw new Error('Failed to fetch destinations');
        
        const result = await response.json();
        if (Array.isArray(result)) {
          // Handle direct array response
          setDestinations(result);
        } else if (result.destinations && Array.isArray(result.destinations)) {
          // Handle wrapped response format
          setDestinations(result.destinations);
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (_err) {
        setError(err instanceof Error ? err.message : 'Failed to load destinations');
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  const filteredDestinations = destinations
    .filter(dest => {
      // Handle both drive time filtering from bulls-eye and category filtering
      let matchesCategory = true;
      if (selectedCategory) {
        // Handle bulls-eye drive time filters
        if (selectedCategory === '30 min') {
          matchesCategory = (dest.driveTime || dest.drive_minutes || 0) <= 30;
        } else if (selectedCategory === '90 min') {
          matchesCategory = (dest.driveTime || dest.drive_minutes || 0) > 30 && (dest.driveTime || dest.drive_minutes || 0) <= 90;
        } else if (selectedCategory === '3h') {
          matchesCategory = (dest.driveTime || dest.drive_minutes || 0) > 90 && (dest.driveTime || dest.drive_minutes || 0) <= 180;
        } else if (selectedCategory === '5h') {
          matchesCategory = (dest.driveTime || dest.drive_minutes || 0) > 180 && (dest.driveTime || dest.drive_minutes || 0) <= 300;
        } else if (selectedCategory === '8h') {
          matchesCategory = (dest.driveTime || dest.drive_minutes || 0) > 300 && (dest.driveTime || dest.drive_minutes || 0) <= 480;
        } else if (selectedCategory === '12h') {
          matchesCategory = (dest.driveTime || dest.drive_minutes || 0) > 480;
        } else {
          // Handle actual database category values
          matchesCategory = dest.category === selectedCategory;
        }
      }
      
      const matchesSearch = !searchTerm || 
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (dest.description_short?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (dest.description_long?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (dest.address_full?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'driveTime':
        default:
          return (a.driveTime || a.drive_minutes || 0) - (b.driveTime || b.drive_minutes || 0);
      }
    });





  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <CleanNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destinations...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <CleanNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Destinations</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <CleanNavigation />
      
      {/* Compact Hero Header */}
      <div className="slc-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-white/80 mb-4">
            <Link href="/" className="flex items-center space-x-1 hover:text-white transition-colors">
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-sm font-medium text-white">All Destinations</span>
          </div>

          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-3">
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <MapPin className="w-4 h-4 inline mr-1" />
                FROM SALT LAKE CITY
              </span>
              <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Star className="w-4 h-4 inline mr-1" />
                AUTHENTIC UTAH
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 font-montserrat">
              Explore Utah
            </h1>
            <p className="text-lg text-white opacity-90 mb-4 font-montserrat">
              To Everywhere
            </p>
            <p className="text-base text-white opacity-80 max-w-2xl mx-auto">
              Discover authentic Utah destinations curated by locals. From 30-minute city adventures to epic road trips across the American West.
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Filters with SLC Trips Styling */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Enhanced Search */}
            <div className="flex-1 max-w-lg relative">
              <div className="relative">
                <input
                  id="destination-search"
                  name="search"
                  type="text"
                  placeholder="Search destinations, activities, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm font-inter text-sm"
                />
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-xl px-3 py-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  id="category-filter"
                  name="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm font-medium text-gray-700 cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enhanced View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Destinations Grid/List */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-16">
            <div className="slc-glass-effect rounded-2xl p-12 max-w-2xl mx-auto">
              <div className="floating-element">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
                No destinations found
              </h3>
              <p className="text-gray-600 mb-8 font-inter leading-relaxed">
                We couldn't find any destinations matching your criteria. Try exploring different categories or searching for specific activities.
              </p>
              
              {/* Popular Categories */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {CATEGORIES.slice(1).map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all slc-hover-lift ${getCategoryStyle(cat.value)} text-white`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSearchTerm('');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Show All Destinations
              </button>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {filteredDestinations.map((destination, index) => (
              <Link 
                key={`dest-${destination.uuid}-${index}`}
                href={`/destinations/${destination.uuid}`}
                className="block group"
              >
                {viewMode === 'grid' ? (
                  // Enhanced Grid Card with SLC Trips styling
                  <div className="bg-white rounded-xl overflow-hidden slc-card-shadow slc-hover-lift transition-all duration-300">
                    <div className="relative">
                      <img 
                        src={(() => {
                          const photoUrl = getMainPhoto(destination);
                          if (photoUrl) return photoUrl;
                          
                          // Category-based fallback photos
                          const categoryImages = {
                            'Downtown & Nearby': 'https://images.unsplash.com/photo-1531040630173-7cfb894c8326?w=400&h=200&fit=crop',
                            'Less than 90 Minutes': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop',
                            'Less than 3 Hours': 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&h=200&fit=crop',
                            'Less than 5 Hours': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=200&fit=crop',
                            'Less than 8 Hours': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=400&h=200&fit=crop',
                            'Less than 12 Hours': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=200&fit=crop',
                            'A little bit farther': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=200&fit=crop'
                          };
                          return categoryImages[destination.category as keyof typeof categoryImages] || 
                                 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop';
                        })()} 
                        alt={destination.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex space-x-2">
                        <span className={`text-white px-3 py-1 rounded-full text-xs font-semibold ${getCategoryStyle(destination.category)}`}>
                          {destination.category}
                        </span>
                        {destination.is_olympic_venue && (
                          <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                            🏅 2034 Olympic
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors font-montserrat text-lg">
                        {destination.name}
                      </h3>
                      
                      {destination.tagline && (
                        <p className="text-sm font-medium text-blue-600 mb-2 italic line-clamp-1">
                          "{destination.tagline}"
                        </p>
                      )}

                      {destination.description_short && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {destination.description_short}
                        </p>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate font-inter">{destination.address_full || destination.county || 'Utah'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        {destination.drive_minutes > 0 && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{destination.drive_minutes} min from SLC</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Quick Features */}
                      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                        {destination.is_family_friendly && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Family
                          </span>
                        )}
                        {destination.is_pet_friendly && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            Pet-Friendly
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // List Item
                  <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={(() => {
                          const photoUrl = getMainPhoto(destination);
                          if (photoUrl) return photoUrl;
                          
                          // Category-based fallback photos
                          const categoryImages = {
                            'Downtown & Nearby': 'https://images.unsplash.com/photo-1531040630173-7cfb894c8326?w=200&h=200&fit=crop',
                            'Less than 90 Minutes': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop',
                            'Less than 3 Hours': 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=200&h=200&fit=crop',
                            'Less than 5 Hours': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200&h=200&fit=crop',
                            'Less than 8 Hours': 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=200&h=200&fit=crop',
                            'Less than 12 Hours': 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&h=200&fit=crop',
                            'A little bit farther': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&h=200&fit=crop'
                          };
                          return categoryImages[destination.category as keyof typeof categoryImages] || 
                                 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=200&fit=crop';
                        })()} 
                        alt={destination.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {destination.name}
                          </h3>
                          <div className="flex space-x-2 ml-4">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                              {destination.category}
                            </span>
                            {destination.is_olympic_venue && (
                              <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Olympic
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span className="truncate">{destination.address || 'Utah'}</span>
                          </div>
                        </div>
                        
                        {destination.tagline && (
                          <p className="text-sm font-medium text-blue-600 mb-1 italic">
                            "{destination.tagline}"
                          </p>
                        )}
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {destination.description_short || destination.description || 'Discover this Utah destination'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 slc-hover-lift"
          aria-label="Back to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      <Footer />
    </div>
  );
}