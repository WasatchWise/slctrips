import React, { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { MapPin, Clock, Mountain, Star, Share2, Heart, Navigation, Camera } from 'lucide-react';
import AffiliateRecommendations from '../../components/affiliate-recommendations';

interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  category: string;
  subcategory: string;
  drive_time: number;
  photos: string[];
  latitude: number;
  longitude: number;
  status: string;
  best_time_to_visit: string;
  difficulty_level: string;
  accessibility: string;
  tips: string[];
  nearby_attractions: string[];
}

export default function DestinationDetail() {
  const [, params] = useRoute('/destination/:slug');
  const slug = params?.slug;
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchDestination();
    }
  }, [slug]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/destinations/${slug}`);
      
      if (!response.ok) {
        throw new Error('Destination not found');
      }

      const data = await response.json();
      setDestination(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load destination');
    } finally {
      setLoading(false);
    }
  };

  const formatDriveTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'difficult':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'national parks':
        return <Mountain className="w-5 h-5" />;
      case 'state parks':
        return <MapPin className="w-5 h-5" />;
      case 'hiking trails':
        return <Mountain className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

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
          <p className="text-gray-600 mb-4">{error || 'The destination you\'re looking for doesn\'t exist.'}</p>
          <a href="/destinations" className="text-blue-600 hover:text-blue-800 underline">
            Browse all destinations
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-900">
        {destination.photos && destination.photos.length > 0 ? (
          <img
            src={destination.photos[selectedPhoto]}
            alt={destination.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
            <Camera className="w-16 h-16 text-white opacity-50" />
          </div>
        )}
        
        {/* Photo Gallery Thumbnails */}
        {destination.photos && destination.photos.length > 1 && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex space-x-2 overflow-x-auto">
              {destination.photos.map((photo, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPhoto(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedPhoto === index ? 'border-white' : 'border-transparent'
                  }`}
                >
                  <img
                    src={photo}
                    alt={`${destination.name} photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-8 w-full">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {getCategoryIcon(destination.category)}
                  <span className="text-white text-sm font-medium">
                    {destination.category}
                  </span>
                </div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {destination.name}
                </h1>
                <div className="flex items-center space-x-4 text-white text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDriveTime(destination.drive_time)} from SLC</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{destination.subcategory}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {destination.description}
              </p>
              {destination.long_description && (
                <p className="text-gray-700 leading-relaxed">
                  {destination.long_description}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Best Time to Visit</h3>
                  <p className="text-gray-700">{destination.best_time_to_visit}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Difficulty Level</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(destination.difficulty_level)}`}>
                    {destination.difficulty_level}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
                  <p className="text-gray-700">{destination.accessibility}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Drive Time</h3>
                  <p className="text-gray-700">{formatDriveTime(destination.drive_time)} from Salt Lake City</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            {destination.tips && destination.tips.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips & Advice</h2>
                <ul className="space-y-2">
                  {destination.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Nearby Attractions */}
            {destination.nearby_attractions && destination.nearby_attractions.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Nearby Attractions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destination.nearby_attractions.map((attraction, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">{attraction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions</span>
                </button>
                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-4 h-4" />
                  <span>Share Location</span>
                </button>
                <button className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2">
                  <Heart className="w-4 h-4" />
                  <span>Add to Favorites</span>
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  destination.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {destination.status}
                </span>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
              <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Map coming soon</p>
                  <p className="text-sm">Lat: {destination.latitude}</p>
                  <p className="text-sm">Lng: {destination.longitude}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Affiliate Recommendations */}
        <div className="mt-8">
          <AffiliateRecommendations 
            destinationId={destination.id}
            maxItems={6}
            showUtahSpecific={true}
          />
        </div>
      </div>
    </div>
  );
} 