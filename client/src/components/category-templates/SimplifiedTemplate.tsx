import React from 'react';

interface SimplifiedTemplateProps {
  destination: {
    id: string;
    name: string;
    description?: string;
    description_short?: string;
    description_long?: string;
    address?: string;
    address_full?: string;
    photos?: Array<{
      url: string;
      alt_text?: string;
      caption?: string;
    }>;
    photo_url?: string;
    cover_photo_url?: string;
    drive_minutes?: number;
    driveTime?: number;
    coordinates?: { lat: number; lng: number };
    rating?: number;
    category?: string;
  };
}

const SimplifiedTemplate: React.FC<SimplifiedTemplateProps> = ({ destination }) => {
  const heroPhoto = destination.photos && destination.photos.length > 0 
    ? destination.photos[0] 
    : { url: destination.cover_photo_url || destination.photo_url || '', alt_text: destination.name };

  return (
    <div className="destination-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-image">
          <img 
            src={heroPhoto.url ? `/api/photo-proxy?url=${encodeURIComponent(heroPhoto.url)}` : '/assets/default-destination.jpg'} 
            alt={heroPhoto.alt_text || destination.name}
            className="hero-bg"
          />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>{destination.name}</h1>
              <p className="hero-description">
                {destination.description_short || destination.description || 'Explore this amazing destination'}
              </p>
              <div className="hero-meta">
                {destination.drive_minutes && (
                  <span className="drive-time">{destination.drive_minutes} min from SLC</span>
                )}
                {destination.rating && (
                  <span className="rating">★ {destination.rating}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="content-sections">
        <div className="content-grid">
          {/* Experience & History */}
          <div className="content-card">
            <h2>Experience & History</h2>
            <p>{destination.description_long || destination.description_short || destination.description || 'Discover the unique experiences and rich history of this destination.'}</p>
          </div>

          {/* Visitor Information */}
          <div className="content-card visitor-info">
            <h2>Visitor Information</h2>
            {destination.address_full && (
              <div className="info-item">
                <span className="icon">📍</span>
                <span>{destination.address_full}</span>
              </div>
            )}
            {destination.drive_minutes && (
              <div className="info-item">
                <span className="icon">⏱️</span>
                <span>{destination.drive_minutes} minutes from Salt Lake City</span>
              </div>
            )}
            <div className="action-buttons">
              <button className="btn-primary">Plan Your Visit</button>
              <button className="btn-secondary">Get Directions</button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      {destination.photos && destination.photos.length > 1 && (
        <section className="photo-gallery">
          <h2>Destination Photos</h2>
          <div className="gallery-grid">
            {destination.photos.slice(1).map((photo, index) => (
              <div key={index} className="gallery-item">
                <img 
                  src={`/api/photo-proxy?url=${encodeURIComponent(photo.url)}`}
                  alt={photo.alt_text || `Photo ${index + 2} of ${destination.name}`}
                  className="gallery-image"
                />
                {photo.caption && (
                  <p className="photo-caption">{photo.caption}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SimplifiedTemplate; 