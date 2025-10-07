import React, { useState, useEffect } from 'react';
import { DestinationTemplateProps } from '@/types/destination-types';
import { getTemplateColors } from '../../utils/destination-template-detector';
import { Gem, Clock, MapPin, Users, Lock, Calendar, Heart, Share2 } from 'lucide-react';

// Placeholder components - these would need to be created
const ExclusivityBadge: React.FC<{ level?: string }> = ({ level = 'standard' }) => (
  <div className={`exclusivity-badge ${level}`}>
    <Gem className="w-4 h-4" />
    <span>{level === 'premium' ? 'Premium Gem' : 'Hidden Gem'}</span>
  </div>
);

const LocalInsight: React.FC<{ 
  story?: string; 
  source?: string; 
  verified?: boolean; 
}> = ({ story, source, verified }) => (
  <div className="local-insight">
    <div className="insight-header">
      <h3>Local Insider Story</h3>
      {verified && <span className="verified-badge">✓ Verified by Locals</span>}
    </div>
    <p className="story-content">{story}</p>
    {source && (
      <p className="story-source">— {source}</p>
    )}
  </div>
);

const SeasonalTiming: React.FC<{ 
  bestSeasons?: string[]; 
  worstSeasons?: string[]; 
  timeOfDay?: string; 
  crowdCalendar?: any; 
}> = ({ bestSeasons = [], worstSeasons = [], timeOfDay, crowdCalendar }) => (
  <div className="seasonal-timing">
    <div className="timing-grid">
      <div className="best-seasons">
        <h4>Best Seasons</h4>
        <div className="season-tags">
          {bestSeasons.map((season, index) => (
            <span key={index} className="season-tag best">{season}</span>
          ))}
        </div>
      </div>
      <div className="worst-seasons">
        <h4>Avoid These Seasons</h4>
        <div className="season-tags">
          {worstSeasons.map((season, index) => (
            <span key={index} className="season-tag worst">{season}</span>
          ))}
        </div>
      </div>
      <div className="time-of-day">
        <h4>Best Time of Day</h4>
        <span className="time-badge">{timeOfDay || 'Morning'}</span>
      </div>
    </div>
  </div>
);

const CrowdMeterVisual: React.FC<{ level: string }> = ({ level }) => (
  <div className="crowd-meter">
    <div className="meter-bar">
      <div 
        className={`meter-fill ${level}`} 
        style={{ 
          width: level === 'low' ? '25%' : 
                 level === 'medium' ? '50%' : 
                 level === 'high' ? '75%' : '100%' 
        }}
      />
    </div>
    <span className="crowd-label">{level} crowds</span>
  </div>
);

const SecretAccessMap: React.FC<{ 
  coordinates?: any; 
  parkingSpot?: string; 
  landmarks?: string[]; 
}> = ({ coordinates, parkingSpot, landmarks = [] }) => (
  <div className="secret-access-map">
    <h4>Secret Access Point</h4>
    <div className="map-container">
      <div className="map-placeholder">
        <MapPin className="w-6 h-6" />
        <p>Interactive map showing hidden access</p>
      </div>
    </div>
    {parkingSpot && (
      <div className="parking-info">
        <h5>Secret Parking</h5>
        <p>{parkingSpot}</p>
      </div>
    )}
    {landmarks.length > 0 && (
      <div className="landmarks">
        <h5>Look for These Landmarks</h5>
        <ul>
          {landmarks.map((landmark, index) => (
            <li key={index}>{landmark}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const RelatedDestinations: React.FC<{ 
  currentId: string; 
  category: string; 
  maxDistance: number; 
  limit: number; 
}> = ({ currentId, category, maxDistance, limit }) => (
  <div className="related-destinations">
    <div className="destination-cards">
      {[1, 2, 3].map((i) => (
        <div key={i} className="destination-card">
          <div className="card-image">
            <img src={`/assets/hidden-gem-${i}.jpg`} alt="Hidden gem" />
          </div>
          <div className="card-content">
            <h4>Secret Spot #{i}</h4>
            <p>Another local favorite nearby</p>
            <span className="distance">{Math.floor(Math.random() * 20) + 5} miles away</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TripKitPromotion: React.FC<{ 
  title: string; 
  kitSlug: string; 
  price: number; 
  features: string[]; 
}> = ({ title, kitSlug, price, features }) => (
  <div className="tripkit-promotion">
    <div className="promo-content">
      <h3>{title}</h3>
      <div className="price">${price}</div>
      <ul className="features">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button className="buy-now-btn">
        <Lock className="w-4 h-4" />
        Unlock Premium Content
      </button>
    </div>
  </div>
);

const HiddenGemsTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory 
}) => {
  const colors = getTemplateColors('hidden-gems');
  const [insiderTips, setInsiderTips] = useState<any[]>([]);
  const [bestVisitTimes, setBestVisitTimes] = useState<any[]>([]);
  
  // Hidden gems specific features
  const isPremiumOnly = destination.premium_only || false;
  const crowdLevel = destination.crowd_level || 'low';
  const bestTimeOfDay = destination.best_time_of_day || 'morning';
  const hasSecretAccess = destination.secret_access_details || false;
  const isLocalSecret = subcategory?.includes('local-secret') || false;
  const isRecentlyDiscovered = subcategory?.includes('recently-discovered') || false;
  const isLocalsOnly = subcategory?.includes('locals-only') || false;
  
  useEffect(() => {
    // Simulate fetching insider tips
    setInsiderTips([
      {
        name: "Sarah M.",
        local_since: "2018",
        content: "Go early on weekdays - you'll have the place to yourself!",
        avatar_url: "/assets/local-avatar-1.jpg"
      },
      {
        name: "Mike T.",
        local_since: "2015",
        content: "The secret parking spot is behind the old gas station.",
        avatar_url: "/assets/local-avatar-2.jpg"
      }
    ]);
    
    setBestVisitTimes([
      { day: "Monday", time: "6:00 AM", crowd: "Empty" },
      { day: "Wednesday", time: "4:00 PM", crowd: "Low" },
      { day: "Saturday", time: "7:00 AM", crowd: "Medium" }
    ]);
  }, [destination.id]);
  
  return (
    <div className="hidden-gems-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Secret location hero with exclusivity badging */}
      <section className="exclusive-hero">
        <div className="hero-image">
          <img 
            src={destination.image_url ? `/api/photo-proxy?url=${encodeURIComponent(destination.image_url)}` : '/assets/default-hidden-gem.jpg'} 
            alt={destination.name}
            className="hero-bg"
          />
          <div className="hero-overlay">
            <div className="hero-content">
              <h1>{destination.name}</h1>
              <ExclusivityBadge level={destination.exclusivity_level || 'standard'} />
              <p className="hero-tagline">{destination.description_short}</p>
              
              {isPremiumOnly && (
                <div className="premium-banner">
                  <span className="premium-icon">✦</span> Premium Destination
                </div>
              )}
              
              <div className="hero-stats">
                <span className="drive-time">{destination.driveTime} min from SLC</span>
                <span className="crowd-level">
                  <Users className="w-4 h-4" />
                  {crowdLevel} crowds
                </span>
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
      
      {/* Local insider context - the secret story */}
      <section className="insider-story">
        <h2>The Secret Story</h2>
        <LocalInsight 
          story={destination.insider_story}
          source={destination.story_source}
          verified={destination.verified_by_locals}
        />
      </section>
      
      {/* Best timing to avoid crowds */}
      <section className="optimal-timing">
        <h2>When To Go</h2>
        <SeasonalTiming 
          bestSeasons={destination.best_seasons}
          worstSeasons={destination.worst_seasons}
          timeOfDay={bestTimeOfDay}
          crowdCalendar={destination.crowd_calendar}
        />
        <div className="crowd-meter">
          <h3>Current Crowd Level</h3>
          <CrowdMeterVisual level={crowdLevel} />
        </div>
      </section>
      
      {/* Secret access instructions (premium content) */}
      {hasSecretAccess && (
        <section className="secret-access premium-content">
          <h2>Secret Access</h2>
          {isPremiumOnly ? (
            <div className="secret-directions">
              <p>{destination.secret_access_details}</p>
              <div className="secret-map">
                <SecretAccessMap 
                  coordinates={destination.secret_coordinates}
                  parkingSpot={destination.secret_parking}
                  landmarks={destination.secret_landmarks}
                />
              </div>
            </div>
          ) : (
            <div className="premium-teaser">
              <Lock className="w-8 h-8" />
              <h3>Unlock Secret Access</h3>
              <p>Get the insider directions and parking spot known only to locals...</p>
              <button className="unlock-btn">
                <Lock className="w-4 h-4" />
                Unlock Premium Content
              </button>
            </div>
          )}
        </section>
      )}
      
      {/* Insider tips from locals */}
      <section className="insider-tips">
        <h2>Local Insider Tips</h2>
        <div className="tips-container">
          {insiderTips.map((tip, index) => (
            <div key={index} className="insider-tip">
              <div className="tip-avatar">
                <img src={tip.avatar_url} alt={`${tip.name}, local since ${tip.local_since}`} />
              </div>
              <div className="tip-content">
                <h4>{tip.name} <span className="local-years">local since {tip.local_since}</span></h4>
                <p>"{tip.content}"</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Cross-promotion to other hidden gems */}
      <section className="more-secrets">
        <h2>More Hidden Gems Nearby</h2>
        <div className="gems-container">
          <RelatedDestinations 
            currentId={destination.id}
            category="hidden-gems"
            maxDistance={50}
            limit={3}
          />
        </div>
      </section>
      
      {/* TripKit promotion for premium content */}
      <section className="tripkit-promo">
        <TripKitPromotion 
          title="Unlock 37 More Hidden Gems"
          kitSlug="hidden-gems-of-utah"
          price={19.99}
          features={[
            "Secret parking spots locals use",
            "Best timing to avoid crowds",
            "Hidden photo spots Instagram hasn't discovered",
            "Access instructions for hard-to-find locations"
          ]}
        />
      </section>
    </div>
  );
};

export default HiddenGemsTemplate; 