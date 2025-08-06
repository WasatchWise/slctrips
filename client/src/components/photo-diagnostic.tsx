import React, { useState, useEffect } from 'react';
import { Camera, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface PhotoDiagnosticProps {
  destination: any;
}

interface DiagnosticResult {
  hasPhotos: boolean;
  photoCount: number;
  photoUrls: string[];
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export function PhotoDiagnostic({ destination }: PhotoDiagnosticProps) {
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runDiagnostic = async () => {
      const result: DiagnosticResult = {
        hasPhotos: false,
        photoCount: 0,
        photoUrls: [],
        errors: [],
        warnings: [],
        suggestions: []
      };

      try {
        // Check if destination has photos array
        if (destination.photos && Array.isArray(destination.photos)) {
          result.photoCount = destination.photos.length;
          result.hasPhotos = result.photoCount > 0;
          
          destination.photos.forEach((photo: any, index: number) => {
            if (typeof photo === 'string') {
              result.photoUrls.push(photo);
              if (photo.includes('via.placeholder.com')) {
                result.warnings.push(`Photo ${index + 1} is a placeholder`);
              }
            } else if (photo && typeof photo === 'object') {
              if (photo.url) {
                result.photoUrls.push(photo.url);
                if (photo.url.includes('via.placeholder.com')) {
                  result.warnings.push(`Photo ${index + 1} is a placeholder`);
                }
              } else {
                result.errors.push(`Photo ${index + 1} has no URL`);
              }
            } else {
              result.errors.push(`Photo ${index + 1} has invalid format`);
            }
          });
        } else {
          result.warnings.push('No photos array found');
        }

        // Check for photo_url field
        if (destination.photo_url) {
          result.photoUrls.push(destination.photo_url);
          if (!result.hasPhotos) {
            result.hasPhotos = true;
            result.photoCount = 1;
          }
        }

        // Check for cover_photo_url field
        if (destination.cover_photo_url) {
          result.photoUrls.push(destination.cover_photo_url);
          if (!result.hasPhotos) {
            result.hasPhotos = true;
            result.photoCount = 1;
          }
        }

        // Check for places_data
        if (destination.places_data?.photos) {
          result.suggestions.push('Google Places photos available in places_data');
        }

        // Generate suggestions
        if (!result.hasPhotos) {
          result.suggestions.push('No photos found - consider adding photos to the destination data');
          result.suggestions.push('Check if photo enhancement system is working');
        }

        if (result.photoUrls.length > 0) {
          result.suggestions.push('Photos found - check if photo proxy endpoints are working');
        }

        setDiagnostic(result);
      } catch (error) {
        setDiagnostic({
          hasPhotos: false,
          photoCount: 0,
          photoUrls: [],
          errors: [`Diagnostic error: ${error}`],
          warnings: [],
          suggestions: ['Check console for more details']
        });
      } finally {
        setIsLoading(false);
      }
    };

    runDiagnostic();
  }, [destination]);

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          <span className="text-blue-800">Running photo diagnostic...</span>
        </div>
      </div>
    );
  }

  if (!diagnostic) {
    return null;
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-800">Photo Diagnostic</h3>
        {diagnostic.hasPhotos ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
        )}
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status:</span>
          <span className={diagnostic.hasPhotos ? 'text-green-600' : 'text-yellow-600'}>
            {diagnostic.hasPhotos ? 'Photos Found' : 'No Photos'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Photo Count:</span>
          <span>{diagnostic.photoCount}</span>
        </div>

        {diagnostic.photoUrls.length > 0 && (
          <div>
            <span className="font-medium">Photo URLs:</span>
            <div className="mt-1 space-y-1">
              {diagnostic.photoUrls.map((url, index) => (
                <div key={index} className="text-xs bg-white p-2 rounded border break-all">
                  {url}
                </div>
              ))}
            </div>
          </div>
        )}

        {diagnostic.errors.length > 0 && (
          <div>
            <span className="font-medium text-red-600">Errors:</span>
            <ul className="mt-1 space-y-1">
              {diagnostic.errors.map((error, index) => (
                <li key={index} className="text-xs text-red-600">• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {diagnostic.warnings.length > 0 && (
          <div>
            <span className="font-medium text-yellow-600">Warnings:</span>
            <ul className="mt-1 space-y-1">
              {diagnostic.warnings.map((warning, index) => (
                <li key={index} className="text-xs text-yellow-600">• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {diagnostic.suggestions.length > 0 && (
          <div>
            <span className="font-medium text-blue-600">Suggestions:</span>
            <ul className="mt-1 space-y-1">
              {diagnostic.suggestions.map((suggestion, index) => (
                <li key={index} className="text-xs text-blue-600">• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 