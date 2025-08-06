import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { ArrowLeft, MapPin, Clock, Camera, Share2, Heart, ExternalLink, DollarSign, Users, Thermometer, Mountain, Navigation, Lightbulb, Award, Star } from "lucide-react";
import { CleanNavigation } from "../components/clean-navigation";
import { Footer } from "../components/footer";
import { getMainPhoto, getPhotoUrl } from "../utils/getPhotoUrl";

interface Destination {
  id: number;
  name: string;
  category: string;
  description: string | null;
  address: string;
  coordinates: { lat: number; lng: number } | null;
  driveTime: number;
  website?: string;
  phone?: string;
  photos: Array<{
    url: string;
    caption?: string;
    source: string;
    verified?: boolean;
  }>;
  activities: string[] | null;
  highlights: string[] | null;
  tags: string[] | null;
  difficulty: string | null;
  accessibility: string | null;
  bestTimeToVisit: string | null;
  timeNeeded: string | null;
  pricing: string | null;
  localTips: string[] | null;
  familyFriendly: string | null;
  petFriendly: boolean;
  olympicVenue: boolean;
  rating: number | null;
  isOlympicVenue: boolean;
}

interface GearItem {
  name: string;
  price: string;
  rating: number;
  image: string;
  affiliate_link: string;
  category: string;
}

function getRecommendedGear(destination: Destination): GearItem[] {
  const gear: GearItem[] = [];
  
  // Skip gear recommendations for indoor venues, restaurants, cafes, etc.
  const skipGearCategories = ['restaurants', 'cafes', 'bars', 'museums', 'indoor', 'shopping'];
  const destNameLower = destination.name.toLowerCase();
  const destDescLower = (destination.description || '').toLowerCase();
  
  if (skipGearCategories.some(cat => destNameLower.includes(cat) || destDescLower.includes(cat))) {
    return gear;
  }

  // Hiking gear for trails and outdoor destinations
  if (destNameLower.includes('trail') || destNameLower.includes('hike') || destNameLower.includes('canyon')) {
    gear.push({
      name: "Merrell Moab 3 Hiking Shoes",
      price: "$109.95",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1544966503-7cc4ac882d2e?w=200&auto=format&fit=crop",
      affiliate_link: "#",
      category: "Footwear"
    });

    gear.push({
      name: "Osprey Daylite Plus Daypack",
      price: "$59.95",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop",
      affiliate_link: "#",
      category: "Packs"
    });

    gear.push({
      name: "Hydro Flask Water Bottle",
      price: "$34.95",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&auto=format&fit=crop",
      affiliate_link: "#",
      category: "Hydration"
    });
  }

  // Winter gear for ski destinations
  if (destNameLower.includes('ski') || destNameLower.includes('snow') || destNameLower.includes('winter')) {
    gear.push({
      name: "Smartwool Merino Wool Base Layer",
      price: "$89.95",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&auto=format&fit=crop",
      affiliate_link: "#",
      category: "Clothing"
    });

    gear.push({
      name: "Burton Insulated Snow Gloves",
      price: "$49.95",
      rating: 4.4,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&auto=format&fit=crop",
      affiliate_link: "#",
      category: "Accessories"
    });
  }

  // Photography gear for scenic destinations
  if (destNameLower.includes('scenic') || destNameLower.includes('view') || destNameLower.includes('park')) {
    gear.push({
      name: "Sony Alpha a6000 Camera",
      price: "$449.99",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200&auto=format&fit=crop",
      affiliate_link: "#",
      category: "Photography"
    });
  }

  return gear.slice(0, 6); // Limit to 6 recommendations
}

export default function DestinationPageNew() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Google Places data hooks - must be declared before conditional logic
  const [placesData, setPlacesData] = useState<any>(null);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);

  useEffect(() => {
    async function fetchDestination() {
      if (!id) return;
      
      try {
        // Get specific destination by ID
        const response = await fetch(`/api/destinations/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Destination not found');
            setLoading(false);
            return;
          }
          throw new Error('Failed to fetch destination');
        }
        
        const dest: Destination = await response.json();
        setDestination(dest);
      } catch (_err) {
        setError(err instanceof Error ? err.message : 'Failed to load destination');
      } finally {
        setLoading(false);
      }
    }

    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter">
        <CleanNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading destination...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 font-inter">
        <CleanNavigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The destination you\'re looking for doesn\'t exist.'}</p>
            <a href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  const recommendedGear = getRecommendedGear(destination);

  // Template Detection System - Determines visual styling based on destination characteristics
  const getTemplateType = (destination: Destination): string => {
    const name = destination.name.toLowerCase();
    const description = (destination.description || '').toLowerCase();
    const activities = (destination.activities || []).join(' ').toLowerCase();
    
    // Food & Drink - Restaurant/dining focused
    if (name.includes('restaurant') || name.includes('cafe') || name.includes('brewery') || 
        name.includes('dining') || name.includes('food') || name.includes('bistro') ||
        name.includes('kitchen') || name.includes('grill') || name.includes('bar ') || 
        name.includes('burger') || name.includes('pizza') || name.includes('coffee') ||
        description.includes('dining') || description.includes('restaurant') || 
        description.includes('culinary') || activities.includes('dining')) {
      // Exclude industrial sites that might contain food-related words
      if (name.includes('steel') || name.includes('plant') || name.includes('mill') || 
          description.includes('industrial') || description.includes('steel plant')) {
        return 'cultural_heritage';
      }
      return 'food_drink';
    }
    
    // Cultural & Heritage - Museums, historic sites, industrial heritage
    if (name.includes('museum') || name.includes('historic') || name.includes('heritage') ||
        name.includes('monument') || name.includes('cultural') || name.includes('art') ||
        name.includes('gallery') || name.includes('center') || name.includes('temple') ||
        name.includes('steel') || name.includes('plant') || name.includes('mill') ||
        name.includes('mine') || name.includes('industrial') || name.includes('fort') ||
        description.includes('historic') || description.includes('museum') || 
        description.includes('cultural') || description.includes('heritage') || 
        description.includes('industrial') || description.includes('steel plant') ||
        description.includes('former') || description.includes('remnants')) {
      return 'cultural_heritage';
    }
    
    // Outdoor & Adventure - Active outdoor experiences
    if (name.includes('trail') || name.includes('hike') || name.includes('canyon') || 
        name.includes('peak') || name.includes('climb') || name.includes('wilderness') ||
        description.includes('hiking') || description.includes('outdoor') || 
        description.includes('adventure') || activities.includes('hiking')) {
      return 'outdoor_adventure';
    }
    
    // Winter Sports
    if (name.includes('ski') || name.includes('winter') || name.includes('snow') ||
        description.includes('skiing') || description.includes('winter sports')) {
      return 'winter_sports';
    }
    
    // National Parks
    if (name.includes('national') || description.includes('national park')) {
      return 'national_parks';
    }
    
    // Default to outdoor adventure
    return 'outdoor_adventure';
  };

  const templateType = getTemplateType(destination);
  
  // Template Configuration - Different styling for each template type
  const getTemplateConfig = (type: string) => {
    const configs = {
      food_drink: {
        gradient: 'from-red-500 via-orange-500 to-yellow-500',
        bgColor: 'bg-red-50',
        accentColor: 'text-red-600',
        subtitle: 'Culinary Experience'
      },
      cultural_heritage: {
        gradient: 'from-purple-600 via-indigo-600 to-blue-600',
        bgColor: 'bg-purple-50',
        accentColor: 'text-purple-600',
        subtitle: 'Cultural Heritage'
      },
      outdoor_adventure: {
        gradient: 'from-green-600 via-blue-600 to-teal-600',
        bgColor: 'bg-green-50',
        accentColor: 'text-green-600',
        subtitle: 'Outdoor Adventure'
      },
      winter_sports: {
        gradient: 'from-blue-600 via-cyan-600 to-teal-600',
        bgColor: 'bg-blue-50',
        accentColor: 'text-blue-600',
        subtitle: 'Winter Sports'
      },
      national_parks: {
        gradient: 'from-emerald-600 via-teal-600 to-green-600',
        bgColor: 'bg-emerald-50',
        accentColor: 'text-emerald-600',
        subtitle: 'National Park'
      }
    };
    return configs[type as keyof typeof configs] || configs.outdoor_adventure;
  };

  const templateConfig = getTemplateConfig(templateType);



  // Template-Specific Content Renderer
  const renderTemplateContent = (destination: Destination, templateType: string) => {
    const commonClasses = "bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm";
    
    switch (templateType) {
      case 'food_drink':
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-bold text-white mb-2">🍽️ Dining Experience</h3>
            <p className="text-white opacity-90 text-sm leading-relaxed">
              {destination.localTips && destination.localTips.length > 0 
                ? destination.localTips[0]
                : destination.highlights && destination.highlights.length > 0
                  ? `"${destination.highlights[0]}" - A local favorite for authentic Utah dining.`
                  : `Experience authentic Utah flavors at this ${destination.driveTime}-minute drive from downtown Salt Lake City.`
              }
            </p>
          </div>
        );
      
      case 'cultural_heritage':
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-bold text-white mb-2">🏛️ Historic Insight</h3>
            <p className="text-white opacity-90 text-sm leading-relaxed">
              {destination.localTips 
                ? destination.localTips
                : destination.localTips && destination.localTips.length > 0
                  ? destination.localTips[0]
                  : destination.highlights && destination.highlights.length > 0
                    ? `"${destination.highlights[0]}" - Part of Utah's rich industrial and cultural heritage.`
                    : `Discover Utah's fascinating history at this significant cultural site, ${destination.driveTime} minutes from Salt Lake City.`
              }
            </p>
          </div>
        );
      
      case 'outdoor_adventure':
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-bold text-white mb-2">🏔️ Adventure Guide</h3>
            <p className="text-white opacity-90 text-sm leading-relaxed">
              {destination.localTips && destination.localTips.length > 0 
                ? destination.localTips[0]
                : destination.highlights && destination.highlights.length > 0
                  ? `"${destination.highlights[0]}" - Perfect for outdoor enthusiasts seeking Utah's natural beauty.`
                  : `Embark on an unforgettable outdoor adventure just ${destination.driveTime} minutes from Salt Lake City.`
              }
            </p>
          </div>
        );
      
      case 'winter_sports':
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-bold text-white mb-2">⛷️ Winter Sports Info</h3>
            <p className="text-white opacity-90 text-sm leading-relaxed">
              {destination.localTips && destination.localTips.length > 0 
                ? destination.localTips[0]
                : destination.highlights && destination.highlights.length > 0
                  ? `"${destination.highlights[0]}" - Utah's world-class winter sports destination.`
                  : `Experience Utah's legendary powder and winter sports excellence, ${destination.driveTime} minutes from downtown.`
              }
            </p>
          </div>
        );
      
      case 'national_parks':
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-bold text-white mb-2">🏞️ Park Ranger Tips</h3>
            <p className="text-white opacity-90 text-sm leading-relaxed">
              {destination.localTips && destination.localTips.length > 0 
                ? destination.localTips[0]
                : destination.highlights && destination.highlights.length > 0
                  ? `"${destination.highlights[0]}" - One of America's most treasured natural landscapes.`
                  : `Explore America's natural masterpiece, ${destination.driveTime} minutes from Salt Lake City.`
              }
            </p>
          </div>
        );
      
      default:
        return (
          <div className={commonClasses}>
            <h3 className="text-xl font-bold text-white mb-2">🌟 Local Knowledge</h3>
            <p className="text-white opacity-90 text-sm leading-relaxed">
              {destination.localTips && destination.localTips.length > 0 
                ? destination.localTips[0]
                : destination.highlights && destination.highlights.length > 0
                  ? `"${destination.highlights[0]}" - Discover what makes this place special.`
                  : `Discover this unique Utah destination, ${destination.driveTime} minutes from Salt Lake City.`
              }
            </p>
          </div>
        );
    }
  };

  // Generate category subtitle
  const getSubtitle = (category: string) => {
    switch (category) {
      case 'Downtown & Nearby': return 'City Adventure';
      case 'Natural Wonders': return 'Nature\'s Masterpiece';
      case 'Epic Adventures': return 'Adventure Awaits';
      case 'Ultimate Escapes': return 'Ultimate Escape';
      case 'Ski Country': return 'Powder Paradise';
      case 'National Parks': return 'America\'s Best';
      default: return 'Utah Discovery';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter" style={{
      '--great-salt-blue': '#0087c8',
      '--pioneer-gold': '#f4b441',
      '--canyon-red': '#b33c1a',
      '--wasatch-white': '#ffffff',
      '--navy-ridge': '#0d2a40',
      '--rocky-road': '#f7f0e8'
    } as React.CSSProperties}>
      <CleanNavigation />
      
      {/* Hero Section with Template-Based Dynamic Styling */}
      <div className={`relative bg-gradient-to-br ${templateConfig.gradient} overflow-hidden`}
           style={{
             backgroundImage: getMainPhoto(destination) ? `url(${getMainPhoto(destination)})` : 'none',
             backgroundSize: 'cover',
             backgroundPosition: 'center',
             backgroundBlendMode: 'overlay'
           }}>
        {/* Overlay for text readability when background image is present */}
        {getMainPhoto(destination) && (
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                {/* Only show trending for destinations with TikTok videos or high ratings */}
                {false && (
                  <span className="text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse" 
                        style={{ background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)' }}>
                    🔥 Trending Now
                  </span>
                )}
                <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {destination.category}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3" 
                  style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {destination.name}
                <span className="block text-xl lg:text-2xl font-medium text-yellow-100 mt-1">
                  {templateConfig.subtitle}
                </span>
              </h1>
              <p className="text-xl text-white opacity-90 mb-6 leading-relaxed">
                {destination.description || 'Discover this amazing Utah destination'}
              </p>
              {/* Stats removed per user request - keeping only essential badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                {destination.isOlympicVenue && (
                  <div className="flex items-center bg-yellow-500 bg-opacity-90 rounded-lg px-4 py-2">
                    <Star className="text-yellow-900 mr-2 w-5 h-5" />
                    <span className="text-yellow-900 font-bold">2034 Olympic Venue</span>
                  </div>
                )}
                {destination.familyFriendly && (
                  <div className="flex items-center bg-green-500 bg-opacity-20 rounded-lg px-4 py-2">
                    <Users className="text-green-200 mr-2 w-5 h-5" />
                    <span className="text-white font-medium">Family Friendly</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        style={{ color: 'var(--great-salt-blue)' }}>
                  <Navigation className="mr-2 w-5 h-5 inline" />
                  Get Directions
                </button>
                <button className="text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: 'var(--canyon-red)' }}>
                  <Camera className="mr-2 w-5 h-5 inline" />
                  AR Experience
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white bg-opacity-10 rounded-xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Users className="text-yellow-200 w-12 h-12" />
                  </div>
                  {/* Template-Specific Content */}
                  {renderTemplateContent(destination, templateType)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Bar with Photo Gallery */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: 'var(--great-salt-blue)' }}>Open Now</div>
                <div className="text-xs text-gray-600">Check Local Hours</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: 'var(--canyon-red)' }}>
                  {destination.familyFriendly === 'true' ? 'Family' : 'Adventure'}
                </div>
                <div className="text-xs text-gray-600">
                  {destination.familyFriendly === 'true' ? 'Kid Friendly' : 'Adults'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold" style={{ color: 'var(--navy-ridge)' }}>
                  {destination.difficulty || 'Easy'}
                </div>
                <div className="text-xs text-gray-600">Difficulty Level</div>
              </div>
            </div>
            
            {/* Photo Gallery */}
            {destination.photos && destination.photos.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {destination.photos.slice(0, 4).map((photo, index) => {
                  const photoUrl = typeof photo === 'string' ? photo : (photo.url || getPhotoUrl((photo as any).photo_reference));
                  // Skip placeholder URLs
                  if (!photoUrl || photoUrl.includes('via.placeholder.com')) return null;
                  
                  return (
                    <div key={index} className="flex-shrink-0">
                      <img
                        src={photoUrl}
                        alt={typeof photo === 'object' ? photo.caption || destination.name : destination.name}
                        className="w-24 h-16 object-cover rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          // Could implement lightbox here
                          window.open(photoUrl, '_blank');
                        }}
                      />
                    </div>
                  );
                }).filter(Boolean)}
                {destination.photos.length > 4 && (
                  <div className="flex-shrink-0 w-24 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-xs font-medium">
                    +{destination.photos.length - 4} more
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Insider Story Block */}
            <div className="rounded-xl p-8 shadow-lg border-l-4"
                 style={{ 
                   background: 'linear-gradient(145deg, var(--rocky-road) 0%, var(--wasatch-white) 100%)',
                   borderLeftColor: 'var(--pioneer-gold)'
                 }}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                     style={{ backgroundColor: 'var(--pioneer-gold)' }}>
                  <Users className="text-white text-lg w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-montserrat" style={{ color: 'var(--navy-ridge)' }}>The Insider Story</h2>
                  <p className="text-gray-600">Local knowledge you won't find anywhere else</p>
                </div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  {destination.description}
                </p>
                {destination.highlights && destination.highlights.length > 0 && (
                  <div className="space-y-2 mb-6">
                    {destination.highlights.map((highlight, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        {highlight}
                      </p>
                    ))}
                  </div>
                )}
                <div className="p-4 mt-6 border-l-4" 
                     style={{ backgroundColor: 'var(--rocky-road)', borderLeftColor: 'var(--pioneer-gold)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--navy-ridge)' }}>
                    <Lightbulb className="inline w-4 h-4 mr-2" style={{ color: 'var(--pioneer-gold)' }} />
                    Pro Tip: {destination.bestTimeToVisit || `Best visited during ${destination.timeNeeded || 'daylight hours'} for the full experience.`}
                  </p>
                </div>
              </div>
            </div>



            {/* Activities & Highlights */}
            {destination.activities && destination.activities.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 font-montserrat" style={{ color: 'var(--navy-ridge)' }}>What You Can Do</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.activities.map((activity, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                           style={{ backgroundColor: 'var(--great-salt-blue)' }}>
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 font-medium">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Gear */}
            {recommendedGear.length > 0 && (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold mb-6 font-montserrat" style={{ color: 'var(--navy-ridge)' }}>Gear You Might Need</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recommendedGear.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-green-600">{item.price}</span>
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                <span className="text-sm text-gray-600">{item.rating}</span>
                              </div>
                            </div>
                            <a 
                              href={item.affiliate_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="transition-colors"
                              style={{ color: 'var(--great-salt-blue)' }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  * We may earn a commission from purchases made through these links, at no extra cost to you.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Essential Info - No Stats, Only Qualitative Information */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 font-montserrat" style={{ color: 'var(--navy-ridge)' }}>Essential Info</h3>
              <div className="space-y-4">
                {destination.pricing && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                      <span className="text-gray-700">Entry Fee</span>
                    </div>
                    <span className="font-bold text-green-600">{destination.pricing}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-600" />
                    <span className="text-gray-700">Family Friendly</span>
                  </div>
                  <span className="font-bold text-purple-600">
                    {destination.familyFriendly === 'true' ? 'Yes' : 'Adults'}
                  </span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 font-montserrat" style={{ color: 'var(--navy-ridge)' }}>Location</h3>
              <p className="text-gray-700 mb-4">{destination.address}</p>
              <button className="w-full text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity font-semibold"
                      style={{ backgroundColor: 'var(--great-salt-blue)' }}>
                <MapPin className="w-5 h-5 inline mr-2" />
                Get Directions
              </button>
            </div>

            {/* Weather Widget - No Temperature Stats */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4 font-montserrat" style={{ color: 'var(--navy-ridge)' }}>Current Weather</h3>
              <div className="text-center">
                <div className="text-gray-600 mb-2">Partly Cloudy</div>
                <div className="text-sm text-gray-500">Perfect for outdoor activities</div>
              </div>
            </div>

            {/* Tags */}
            {destination.tags && destination.tags.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 font-montserrat" style={{ color: 'var(--navy-ridge)' }}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {destination.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ 
                        backgroundColor: 'rgba(0, 135, 200, 0.1)', 
                        color: 'var(--great-salt-blue)' 
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}