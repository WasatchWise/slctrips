import React, { useState } from 'react';
import { PhotoErrorBoundary } from '../error-boundary';
import { PhotoDiagnostic } from '../photo-diagnostic';
import { PhotoTest } from '../photo-test';
import { getMainPhoto } from '../../utils/getPhotoUrl';
import GolfCourseTemplate from './GolfCourseTemplate';
import { AffiliateGearModule } from '../AffiliateGearModule';

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
          <div className="text-2xl mb-2">📷</div>
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

// Simple fallback template that works with any data structure
const FallbackTemplate: React.FC<{ destination: any }> = ({ destination }) => {
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  
  // Get the best available photo
  const mainPhotoUrl = getMainPhoto(destination);
  
  // Development mode diagnostic toggle
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600">
            {mainPhotoUrl ? (
              <SafePhoto 
                src={mainPhotoUrl}
                alt={destination.name || 'Destination'}
                className="w-full h-full object-cover"
                fallback={
                  <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                    {destination.name || 'Destination'}
                  </div>
                }
              />
            ) : (
              <div className="flex items-center justify-center h-full text-white text-2xl font-bold">
                {destination.name || 'Destination'}
              </div>
            )}
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
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {destination.name || 'Destination'}
            </h1>
            
            {destination.description && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {destination.description}
              </p>
            )}

            {destination.description_short && (
              <p className="text-gray-700 mb-4">
                {destination.description_short}
              </p>
            )}

            {destination.description_long && (
              <div className="prose max-w-none mb-6">
                <p className="text-gray-600 leading-relaxed">
                  {destination.description_long}
                </p>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {destination.address && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">{destination.address}</p>
                </div>
              )}

              {destination.drive_minutes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Drive Time</h3>
                  <p className="text-gray-600">{destination.drive_minutes} minutes</p>
                </div>
              )}

              {destination.driveTime && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Drive Time</h3>
                  <p className="text-gray-600">{destination.driveTime} minutes</p>
                </div>
              )}

              {destination.rating && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Rating</h3>
                  <p className="text-gray-600">{destination.rating}/5</p>
                </div>
              )}
            </div>

            {/* Photo Gallery */}
            {destination.photos && destination.photos.length > 1 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {destination.photos.slice(1).map((photo: any, index: number) => {
                    const photoUrl = photo.url || photo.photo_url;
                    if (!photoUrl) return null;

                    return (
                      <div key={index} className="aspect-square overflow-hidden rounded-lg">
                        <SafePhoto
                          src={`/api/photo-proxy?url=${encodeURIComponent(photoUrl)}`}
                          alt={photo.alt_text || `Photo ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Affiliate Gear Module */}
            {destination.id && (
              <div className="mt-12 mb-6">
                <AffiliateGearModule
                  destinationId={destination.id}
                  destinationName={destination.name}
                  maxProducts={4}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CategoryTemplateEngineProps {
  destination: any;
}

const CategoryTemplateEngine: React.FC<CategoryTemplateEngineProps> = ({ destination }) => {
  // Check if this is a golf course destination
  const isGolfCourse = destination.category === 'golf' || 
                       destination.subcategory === 'golf' ||
                       destination.course_type ||
                       destination.holes ||
                       destination.par ||
                       destination.yardage;

  // Use golf course template for golf destinations
  if (isGolfCourse) {
    return <GolfCourseTemplate destination={destination} />;
  }

  // Use fallback template for other destinations
  return <FallbackTemplate destination={destination} />;
};

export default CategoryTemplateEngine;