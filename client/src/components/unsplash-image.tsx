import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

interface UnsplashImageProps {
  destination: string;
  category?: string;
  className?: string;
  alt?: string;
  categoryColor?: string;
}

interface UnsplashPhoto {
  url: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}

export function UnsplashImage({ destination, category, className, alt, categoryColor }: UnsplashImageProps) {
  const [photo, setPhoto] = useState<UnsplashPhoto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPhoto() {
      try {
        const response = await fetch(`/api/unsplash-photo?destination=${encodeURIComponent(destination)}&category=${encodeURIComponent(category || '')}`);
        
        if (response.ok) {
          const photoData = await response.json();
          setPhoto(photoData);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchPhoto();
  }, [destination, category]);

  if (loading) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !photo) {
    // Create a branded placeholder with the first word of the destination
    const firstWord = destination.split(' ')[0];
    const gradientColor = categoryColor || '#0087c8';
    
    return (
      <div 
        className={`${className} flex items-center justify-center text-white font-semibold text-sm text-center p-2`}
        style={{ 
          background: `linear-gradient(135deg, ${gradientColor}, ${gradientColor}99)` 
        }}
      >
        <div className="flex flex-col items-center">
          <MapPin className="w-4 h-4 mb-1 opacity-80" />
          <span className="leading-tight">{firstWord}</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src={photo.url} 
      alt={photo.alt || alt || destination}
      className={className}
      loading="lazy"
    />
  );
}