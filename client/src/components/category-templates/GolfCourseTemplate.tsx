import React, { useState } from 'react';
import { MapPin, Phone, Globe, Clock, DollarSign, Star, Car, Users, Calendar } from 'lucide-react';
import { PhotoErrorBoundary } from '../error-boundary';
import { PhotoDiagnostic } from '../photo-diagnostic';
import { PhotoTest } from '../photo-test';
import { getMainPhoto } from '../../utils/getPhotoUrl';

// Enhanced photo component with error handling
const SafePhoto: React.FC<{ 
  src: string; 
  alt: string; 
  className?: string;
  fallback?: React.ReactNode;
}> = ({ src, alt, className, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return fallback || (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <div className="text-gray-500 text-center">
          <div className="text-2xl mb-2">⛳</div>
          <div className="text-sm">Photo unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <PhotoErrorBoundary>
      <img 
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
      {isLoading && (
        <div className={`${className} bg-gray-200 flex items-center justify-center`}>
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      )}
    </PhotoErrorBoundary>
  );
};

const GolfCourseTemplate: React.FC<{ destination: any }> = ({ destination }) => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  
  // Get the best available photo
  const mainPhotoUrl = getMainPhoto(destination);
  
  // Development mode diagnostic toggle
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Golf-specific data extraction
  const golfData = {
    courseType: destination.course_type || 'Public',
    holes: destination.holes || 18,
    par: destination.par || 72,
    yardage: destination.yardage || 6500,
    greenFees: destination.green_fees || {},
    hasGolfCarts: destination.has_golf_carts !== false,
    hasProShop: destination.has_pro_shop !== false,
    hasDrivingRange: destination.has_driving_range !== false,
    hasGolfLessons: destination.has_golf_lessons || false,
    golfPhone: destination.golf_phone,
    golfActivities: destination.golf_activities || [],
    recommendedGear: destination.recommended_golf_gear || []
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-96 bg-gradient-to-r from-green-600 to-green-800">
            {mainPhotoUrl ? (
              <SafePhoto 
                src={mainPhotoUrl}
                alt={destination.name || 'Golf Course'}
                className="w-full h-full object-cover"
                fallback={
                  <div className="flex items-center justify-center h-full text-white text-4xl font-bold">
                    ⛳ {destination.name || 'Golf Course'}
                  </div>
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-4xl font-bold">
                ⛳ {destination.name || 'Golf Course'}
              </div>
            )}
            
            {/* Golf Course Badge */}
            <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Golf Course
            </div>
          </div>

          {/* Development Diagnostic Toggle */}
          {isDevelopment && (
            <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
              <button
                onClick={() => setShowDiagnostic(!showDiagnostic)}
                className="text-blue-600 text-sm hover:text-blue-800"
              >
                {showDiagnostic ? 'Hide' : 'Show'} Photo Diagnostic
              </button>
            </div>
          )}

          {/* Photo Diagnostic */}
          {isDevelopment && showDiagnostic && (
            <>
              <PhotoTest destination={destination} />
              <PhotoDiagnostic destination={destination} />
            </>
          )}

          {/* Content Section */}
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ⛳ {destination.name}
            </h1>
            
            {destination.description && (
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                {destination.description}
              </p>
            )}

            {/* Golf Course Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{golfData.holes}</div>
                <div className="text-sm text-green-700">Holes</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{golfData.par}</div>
                <div className="text-sm text-blue-700">Par</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{golfData.yardage}</div>
                <div className="text-sm text-purple-700">Yards</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{golfData.courseType}</div>
                <div className="text-sm text-orange-700">Type</div>
              </div>
            </div>

            {/* Green Fees */}
            {Object.keys(golfData.greenFees).length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-green-600" />
                  Green Fees
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {golfData.greenFees.weekday && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="font-semibold text-green-800">Weekday</div>
                      <div className="text-2xl font-bold text-green-600">${golfData.greenFees.weekday}</div>
                    </div>
                  )}
                  {golfData.greenFees.weekend && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="font-semibold text-blue-800">Weekend</div>
                      <div className="text-2xl font-bold text-blue-600">${golfData.greenFees.weekend}</div>
                    </div>
                  )}
                  {golfData.greenFees.twilight && (
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="font-semibold text-purple-800">Twilight</div>
                      <div className="text-2xl font-bold text-purple-600">${golfData.greenFees.twilight}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amenities */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⛳</span>
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${golfData.hasGolfCarts ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                  <div className="font-semibold">Golf Carts</div>
                  <div className="text-sm">{golfData.hasGolfCarts ? 'Available' : 'Not Available'}</div>
                </div>
                <div className={`p-4 rounded-lg ${golfData.hasProShop ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                  <div className="font-semibold">Pro Shop</div>
                  <div className="text-sm">{golfData.hasProShop ? 'Available' : 'Not Available'}</div>
                </div>
                <div className={`p-4 rounded-lg ${golfData.hasDrivingRange ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                  <div className="font-semibold">Driving Range</div>
                  <div className="text-sm">{golfData.hasDrivingRange ? 'Available' : 'Not Available'}</div>
                </div>
                <div className={`p-4 rounded-lg ${golfData.hasGolfLessons ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}`}>
                  <div className="font-semibold">Golf Lessons</div>
                  <div className="text-sm">{golfData.hasGolfLessons ? 'Available' : 'Not Available'}</div>
                </div>
              </div>
            </div>

            {/* Contact & Booking */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-6 w-6 text-green-600" />
                Contact & Booking
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {golfData.golfPhone && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-2">Phone</div>
                    <div className="text-lg text-gray-700">{golfData.golfPhone}</div>
                  </div>
                )}
                {destination.address && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </div>
                    <div className="text-gray-700">{destination.address}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {destination.drive_minutes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Drive Time
                  </h3>
                  <p className="text-gray-600">{destination.drive_minutes} minutes</p>
                </div>
              )}

              {destination.rating && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Rating
                  </h3>
                  <p className="text-gray-600">{destination.rating}/5</p>
                </div>
              )}
            </div>

            {/* Photo Gallery */}
            {destination.photos && destination.photos.length > 1 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Course Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {destination.photos.slice(1).map((photo: any, index: number) => {
                    const photoUrl = photo.url || photo.photo_url;
                    if (!photoUrl) return null;
                    
                    return (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <SafePhoto 
                          src={`/api/photo-proxy?url=${encodeURIComponent(photoUrl)}`}
                          alt={photo.alt_text || `Golf course photo ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-4">Ready to Play?</h3>
              <p className="text-green-700 mb-4">
                Book your tee time and experience this amazing golf course in Utah!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
                  Book Tee Time
                </button>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  View Course Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GolfCourseTemplate; 