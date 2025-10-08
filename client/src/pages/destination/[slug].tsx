import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { fetchDestinationBySlug, Destination } from "../../utils/destinationData";
import { MapPin, Clock, Star, Phone, Globe, Calendar, Users, Dog, Baby, Car, Coffee, Camera, Mountain, Heart } from "lucide-react";
import SourceAttribution from "../../components/SourceAttribution";
import TripKitUpsell from "../../components/TripKitUpsell";

export default function DestinationDetail() {
  const [, setLocation] = useLocation();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get slug from URL
    const pathParts = window.location.pathname.split('/');
    const slug = pathParts[pathParts.length - 1];

    // Fetch destination by slug
    const loadDestination = async () => {
      try {
        const foundDestination = await fetchDestinationBySlug(slug);
        
        if (foundDestination) {
          setDestination(foundDestination);
        } else {
          setError("Destination not found");
        }
      } catch (error) {
        console.error('Error loading destination:', error);
        setError("Failed to load destination");
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destination...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination Not Found</h1>
          <p className="text-gray-600 mb-6">{error || "The destination you're looking for doesn't exist."}</p>
          <button
            onClick={() => setLocation("/destinations")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        <img
          src={destination.photoUrl}
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/default-fallback.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{destination.name}</h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-lg">{destination.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-1" />
                <span className="text-lg">{destination.driveTime} min from SLC</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-semibold">{destination.category}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Mountain className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{destination.subcategory}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-600">Best Time</p>
                  <p className="font-semibold">{destination.bestTimeToVisit}</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Heart className="w-6 h-6 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-600">Difficulty</p>
                  <p className="font-semibold">{destination.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {destination.name}</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {destination.description_long || destination.description}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                  <ul className="space-y-2">
                    {destination.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Activities</h3>
                  <ul className="space-y-2">
                    {destination.activities.map((activity, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Local Tips */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Local Tips</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Packing List</h3>
                  <ul className="space-y-2">
                    {destination.packingList.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Pro Tips</h3>
                  <ul className="space-y-2">
                    {destination.localTips.map((tip, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{destination.address_full || destination.address}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{destination.driveTime} minutes from Salt Lake City</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{destination.rating.toFixed(1)} out of 5 stars</span>
                </div>
                {destination.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={destination.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                {destination.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <a href={`tel:${destination.phone}`} className="text-blue-600 hover:underline">
                      {destination.phone}
                    </a>
                  </div>
                )}
                {destination.hours && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-700">{destination.hours}</span>
                  </div>
                )}
                {destination.priceRange && (
                  <div className="flex items-center">
                    <span className="text-gray-700 font-semibold">{destination.priceRange}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {destination.isFamilyFriendly && (
                  <div className="flex items-center">
                    <Baby className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">Family Friendly</span>
                  </div>
                )}
                {destination.isPetFriendly && (
                  <div className="flex items-center">
                    <Dog className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">Pet Friendly</span>
                  </div>
                )}
                {destination.hasRestrooms && (
                  <div className="flex items-center">
                    <Coffee className="w-5 h-5 text-purple-600 mr-2" />
                    <span className="text-sm text-gray-700">Restrooms</span>
                  </div>
                )}
                {destination.hasPlayground && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-gray-700">Playground</span>
                  </div>
                )}
                {destination.parkingFree && (
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">Free Parking</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Camera className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-sm text-gray-700">Photo Opportunities</span>
                </div>
              </div>
            </div>

            {/* Nearby Attractions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Attractions</h3>
              <ul className="space-y-2">
                {destination.nearbyAttractions.map((attraction, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{attraction}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Special Badges */}
            {(destination.isOlympicVenue || destination.isFeatured) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Recognition</h3>
                <div className="space-y-2">
                  {destination.isOlympicVenue && (
                    <div className="flex items-center p-3 bg-yellow-100 rounded-lg">
                      <span className="text-2xl mr-2">🏅</span>
                      <span className="text-sm font-semibold text-yellow-800">Olympic Venue</span>
                    </div>
                  )}
                  {destination.isFeatured && (
                    <div className="flex items-center p-3 bg-blue-100 rounded-lg">
                      <Star className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-semibold text-blue-800">Featured Destination</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TripKit Upsell */}
        <div className="mt-8">
          <TripKitUpsell
            destinationId={destination.id}
            destinationCategory={destination.category}
            destinationTheme={destination.subcategory}
          />
        </div>

        {/* Source Attribution */}
        <div className="mt-8">
          <SourceAttribution destinationId={destination.id} />
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setLocation("/destinations")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Back to All Destinations
          </button>
        </div>
      </div>
    </div>
  );
} 