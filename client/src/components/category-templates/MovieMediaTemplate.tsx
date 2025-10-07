import React, { useState } from 'react';
import { DestinationTemplateProps } from '@/types/destination-types';
import { getTemplateColors } from '../../utils/destination-template-detector';
import { Camera, Film, Instagram, Share2, Play, Calendar, MapPin, Star } from 'lucide-react';

// Placeholder components - these would need to be created
const FilmSceneComparison: React.FC<{ 
  realLocation?: string; 
  filmShot?: string; 
}> = ({ realLocation, filmShot }) => {
  const [activeView, setActiveView] = useState<'real' | 'film'>('real');
  
  return (
    <section className="film-scene-comparison">
      <h2>Film Location Comparison</h2>
      <div className="comparison-container">
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${activeView === 'real' ? 'active' : ''}`}
            onClick={() => setActiveView('real')}
          >
            <Camera className="w-4 h-4" />
            Real Location
          </button>
          <button 
            className={`toggle-btn ${activeView === 'film' ? 'active' : ''}`}
            onClick={() => setActiveView('film')}
          >
            <Film className="w-4 h-4" />
            Film Scene
          </button>
        </div>
        <div className="image-display">
          {activeView === 'real' ? (
            <img 
              src={realLocation || '/assets/default-location.jpg'} 
              alt="Real location"
              className="comparison-image"
            />
          ) : (
            <img 
              src={filmShot || '/assets/default-film-scene.jpg'} 
              alt="Film scene"
              className="comparison-image"
            />
          )}
        </div>
      </div>
    </section>
  );
};

const ARExperienceTrigger: React.FC<{ 
  sceneId?: string; 
  previewImage?: string; 
}> = ({ sceneId, previewImage }) => (
  <section className="ar-experience">
    <h2>AR Experience</h2>
    <div className="ar-container">
      <div className="ar-preview">
        <img 
          src={previewImage || '/assets/ar-preview.jpg'} 
          alt="AR Experience Preview"
          className="ar-preview-image"
        />
        <div className="ar-overlay">
          <Play className="w-8 h-8 text-white" />
          <p>Tap to launch AR experience</p>
        </div>
      </div>
      <button className="ar-launch-btn">
        <Play className="w-4 h-4" />
        Launch AR Experience
      </button>
    </div>
  </section>
);

const FilmHistoryTimeline: React.FC<{ films?: any[] }> = ({ films = [] }) => (
  <section className="film-history">
    <h2>Film & Media Appearances</h2>
    {films.length > 0 ? (
      <div className="timeline">
        {films.map((film, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker">
              <Film className="w-4 h-4" />
            </div>
            <div className="timeline-content">
              <h3>{film.title}</h3>
              <p className="film-year">{film.year}</p>
              <p className="film-role">{film.role || 'Featured Location'}</p>
              {film.description && (
                <p className="film-description">{film.description}</p>
              )}
              {film.rating && (
                <div className="film-rating">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{film.rating}/10</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="no-films">No film appearances recorded yet</p>
    )}
  </section>
);

const ViralShareCard: React.FC<{ 
  location: any; 
  shareText: string; 
}> = ({ location, shareText }) => {
  const hashtags = [
    `#${location.name.replace(/\s+/g, '')}`,
    '#SLCTrips',
    '#MovieLocations',
    '#FilmSpots',
    '#UtahFilm'
  ].join(' ');

  return (
    <section className="viral-share">
      <h2>Share Your Movie Moment</h2>
      <div className="share-card">
        <div className="share-preview">
          <img 
            src={location.image_url ? `/api/photo-proxy?url=${encodeURIComponent(location.image_url)}` : '/assets/default-location.jpg'} 
            alt={location.name}
            className="share-image"
          />
          <div className="share-overlay">
            <div className="share-text">
              <h3>{location.name}</h3>
              <p>{shareText}</p>
            </div>
          </div>
        </div>
        <div className="share-actions">
          <button className="share-btn instagram">
            <Instagram className="w-4 h-4" />
            Share on Instagram
          </button>
          <button className="share-btn tiktok">
            <Share2 className="w-4 h-4" />
            Share on TikTok
          </button>
          <button className="share-btn twitter">
            <Share2 className="w-4 h-4" />
            Share on Twitter
          </button>
        </div>
        <div className="hashtags">
          <p>Use these hashtags for maximum reach:</p>
          <p className="hashtag-list">{hashtags}</p>
        </div>
      </div>
    </section>
  );
};

const MediaGallery: React.FC<{ media?: any[] }> = ({ media = [] }) => (
  <section className="media-gallery">
    <h2>Media Gallery</h2>
    <div className="gallery-grid">
      {media.map((item, index) => (
        <div key={index} className="gallery-item">
          <img 
            src={`/api/photo-proxy?url=${encodeURIComponent(item.url)}`}
            alt={item.caption || 'Media content'}
            className="gallery-image"
          />
          {item.caption && (
            <p className="gallery-caption">{item.caption}</p>
          )}
        </div>
      ))}
    </div>
  </section>
);

const SocialMediaTips: React.FC<{ destination: any }> = ({ destination }) => (
  <section className="social-media-tips">
    <h2>Social Media Tips</h2>
    <div className="tips-grid">
      <div className="tip-card">
        <h3>Best Photo Angles</h3>
        <ul>
          <li>Recreate famous film shots</li>
          <li>Use dramatic lighting</li>
          <li>Include recognizable landmarks</li>
          <li>Capture the same perspective as the film</li>
        </ul>
      </div>
      <div className="tip-card">
        <h3>Optimal Posting Times</h3>
        <ul>
          <li>Golden hour for dramatic lighting</li>
          <li>Weekends for maximum engagement</li>
          <li>Evening hours for entertainment content</li>
          <li>Holiday weekends for travel content</li>
        </ul>
      </div>
      <div className="tip-card">
        <h3>Content Ideas</h3>
        <ul>
          <li>Before/after comparisons</li>
          <li>Behind-the-scenes stories</li>
          <li>Film trivia and facts</li>
          <li>Local insider knowledge</li>
        </ul>
      </div>
    </div>
  </section>
);

const MovieMediaTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory 
}) => {
  const colors = getTemplateColors('movie-media');
  
  // Media-specific features
  const hasARExperience = destination.ar_experience_available || false;
  const isFilmLocation = subcategory?.includes('film') || 
                        subcategory?.includes('hollywood') || 
                        subcategory?.includes('tv') || false;
  const isInstagramFamous = subcategory?.includes('instagram') || 
                           subcategory?.includes('viral') || false;
  const isTikTokViral = subcategory?.includes('tiktok') || false;
  
  return (
    <div className="movie-media-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Hero section with film location imagery */}
      <section className="media-hero">
        <div className="hero-image">
          <img 
            src={destination.image_url ? `/api/photo-proxy?url=${encodeURIComponent(destination.image_url)}` : '/assets/default-film-location.jpg'} 
            alt={destination.name}
            className="hero-bg"
          />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>{destination.name}</h1>
              <p className="media-tagline">{destination.description_short}</p>
              <div className="media-badges">
                {isFilmLocation && <span className="badge film">Film Location</span>}
                {isInstagramFamous && <span className="badge instagram">Instagram Famous</span>}
                {isTikTokViral && <span className="badge tiktok">TikTok Viral</span>}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Insider Story */}
      {destination.insider_story && (
        <section className="insider-story">
          <div className="dan-avatar">
            <img src="/assets/dan-avatar.png" alt="Dan the Wasatch Sasquatch" />
          </div>
          <div className="story-content">
            <h3>Dan's Insider Intel</h3>
            <p>{destination.insider_story}</p>
            {destination.pro_tip && (
              <div className="pro-tip">
                <strong>Pro Tip:</strong> {destination.pro_tip}
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Before/After film location slider */}
      {isFilmLocation && (
        <FilmSceneComparison
          realLocation={Array.isArray(destination.images) ? destination.images[0] : undefined}
          filmShot={Array.isArray(destination.images) && destination.images.length > 1 ? destination.images[1] : undefined}
        />
      )}
      
      {/* AR scene recreation trigger */}
      {hasARExperience && (
        <ARExperienceTrigger 
          sceneId={destination.ar_experience_id}
          previewImage={destination.ar_preview}
        />
      )}
      
      {/* Film history timeline */}
      <FilmHistoryTimeline films={destination.media_appearances} />
      
      {/* Media gallery */}
      {destination.media_gallery && destination.media_gallery.length > 0 && (
        <MediaGallery media={destination.media_gallery} />
      )}
      
      {/* Social media tips */}
      <SocialMediaTips destination={destination} />
      
      {/* Cross-category recommendations */}
      <section className="cross-category-recommendations">
        <h2>Perfect Combinations</h2>
        <div className="recommendation-grid">
          <div className="combo-card">
            <span className="combo-type">Film & Food</span>
            <h3>Nearby Restaurants</h3>
            <p>Dine where the stars ate</p>
          </div>
          <div className="combo-card">
            <span className="combo-type">Photo & Adventure</span>
            <h3>Outdoor Activities</h3>
            <p>Combine filming with adventure</p>
          </div>
          <div className="combo-card">
            <span className="combo-type">Culture & Media</span>
            <h3>Cultural Sites</h3>
            <p>Explore the area's rich history</p>
          </div>
        </div>
      </section>
      
      {/* Viral-optimized share cards */}
      <ViralShareCard 
        location={destination}
        shareText={`Did you know "${destination.name}" was in ${destination.media_appearances?.[0]?.title || 'famous films'}?`}
      />
    </div>
  );
};

export default MovieMediaTemplate; 