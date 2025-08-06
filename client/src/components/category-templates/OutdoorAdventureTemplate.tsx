import React from 'react';
import { getTemplateColors } from '../../utils/destination-template-detector';
import { Mountain, MapPin, Clock, AlertTriangle, Thermometer, Sun, Cloud, Heart, Users, Car, Tent, Compass, Share2, Bookmark, Star, Navigation, Camera, Calendar } from 'lucide-react';
import AmazonProductCTA from '../AmazonProductCTA';
import { SEOHead } from '../seo-head';
import { StructuredData } from '../structured-data';

interface DestinationTemplateProps {
  destination: any;
  subcategory?: string;
  strategicRole?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// Subcategory-specific components
const HotSprings: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="hot-springs-specific">
    <div className="spring-info">
      <h3>Hot Spring Details</h3>
      <div className="spring-stats">
        <div className="temperature">
          <Thermometer className="w-4 h-4" />
          <span>{destination.spring_temperature || '104°F'}</span>
        </div>
        <div className="depth">
          <span>Depth: {destination.spring_depth || '3-5 feet'}</span>
        </div>
        <div className="access">
          <span>Access: {destination.spring_access || 'Easy'}</span>
        </div>
      </div>
      {destination.clothing_optional && (
        <div className="clothing-notice">
          <AlertTriangle className="w-4 h-4" />
          <span>Clothing optional area</span>
        </div>
      )}
    </div>
  </div>
);

const SlotCanyon: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="slot-canyon-specific">
    <div className="canyon-info">
      <h3>Slot Canyon Details</h3>
      <div className="canyon-stats">
        <div className="width">
          <span>Narrowest: {destination.canyon_width || '2-3 feet'}</span>
        </div>
        <div className="depth">
          <span>Depth: {destination.canyon_depth || '50-100 feet'}</span>
        </div>
        <div className="difficulty">
          <span>Difficulty: {destination.canyon_difficulty || 'Moderate'}</span>
        </div>
      </div>
      {destination.flash_flood_risk && (
        <div className="flood-warning">
          <AlertTriangle className="w-4 h-4" />
          <span>Flash flood risk - check weather</span>
        </div>
      )}
    </div>
  </div>
);

const ViaFerrata: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="via-ferrata-specific">
    <div className="ferrata-info">
      <h3>Via Ferrata Details</h3>
      <div className="ferrata-stats">
        <div className="length">
          <span>Length: {destination.ferrata_length || '500 meters'}</span>
        </div>
        <div className="elevation">
          <span>Elevation gain: {destination.ferrata_elevation || '200m'}</span>
        </div>
        <div className="rating">
          <span>Rating: {destination.ferrata_rating || 'C/D'}</span>
        </div>
      </div>
      <div className="equipment-required">
        <h4>Required Equipment</h4>
        <ul>
          <li>Via ferrata kit</li>
          <li>Helmet</li>
          <li>Harness</li>
          <li>Sturdy shoes</li>
        </ul>
      </div>
    </div>
  </div>
);

const HikingTrail: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="hiking-trail-specific">
    <div className="trail-info">
      <h3>Trail Details</h3>
      <div className="trail-stats">
        <div className="distance">
          <span>Distance: {destination.trail_distance || '3.2 miles'}</span>
        </div>
        <div className="elevation-gain">
          <span>Elevation: {destination.trail_elevation || '800 ft'}</span>
        </div>
        <div className="difficulty">
          <span>Difficulty: {destination.trail_difficulty || 'Moderate'}</span>
        </div>
        <div className="duration">
          <Clock className="w-4 h-4" />
          <span>{destination.trail_duration || '2-3 hours'}</span>
        </div>
      </div>
      <div className="trail-features">
        <h4>Trail Features</h4>
        <div className="features-grid">
          {destination.trail_features?.map((feature: string, index: number) => (
            <span key={index} className="feature-tag">{feature}</span>
          )) || ['Scenic views', 'Wildlife', 'Wildflowers']}
        </div>
      </div>
    </div>
  </div>
);

const BackcountryCamping: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="backcountry-camping-specific">
    <div className="camping-info">
      <h3>Backcountry Camping</h3>
      <div className="camping-stats">
        <div className="permit-required">
          <span>Permit: {destination.permit_required ? 'Required' : 'Not required'}</span>
        </div>
        <div className="capacity">
          <Tent className="w-4 h-4" />
          <span>Capacity: {destination.camping_capacity || '6 sites'}</span>
        </div>
        <div className="water">
          <span>Water: {destination.water_available ? 'Available' : 'Bring your own'}</span>
        </div>
      </div>
      <div className="camping-rules">
        <h4>Camping Rules</h4>
        <ul>
          <li>Leave No Trace principles</li>
          <li>Bear-proof food storage required</li>
          <li>Camp at least 200 feet from water</li>
          <li>Pack out all waste</li>
        </ul>
      </div>
    </div>
  </div>
);

const MountainBiking: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="mountain-biking-specific">
    <div className="biking-info">
      <h3>Mountain Biking Trail</h3>
      <div className="biking-stats">
        <div className="trail-type">
          <span>Type: {destination.bike_trail_type || 'Single track'}</span>
        </div>
        <div className="technical-level">
          <span>Technical: {destination.bike_technical_level || 'Intermediate'}</span>
        </div>
        <div className="elevation">
          <span>Elevation: {destination.bike_elevation || '1,200 ft'}</span>
        </div>
      </div>
      <div className="bike-features">
        <h4>Trail Features</h4>
        <div className="features-grid">
          {destination.bike_features?.map((feature: string, index: number) => (
            <span key={index} className="feature-tag">{feature}</span>
          )) || ['Flow sections', 'Technical climbs', 'Downhill descents']}
        </div>
      </div>
    </div>
  </div>
);

const WaterSport: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="water-sport-specific">
    <div className="water-info">
      <h3>Water Sport Details</h3>
      <div className="water-stats">
        <div className="water-type">
          <span>Type: {destination.water_type || 'Lake'}</span>
        </div>
        <div className="water-temp">
          <Thermometer className="w-4 h-4" />
          <span>{destination.water_temperature || '65°F'}</span>
        </div>
        <div className="activities">
          <span>Activities: {destination.water_activities?.join(', ') || 'Kayaking, Paddleboarding'}</span>
        </div>
      </div>
      <div className="equipment-rental">
        <h4>Equipment Available</h4>
        <div className="rental-options">
          {destination.equipment_rental?.map((item: string, index: number) => (
            <span key={index} className="rental-item">{item}</span>
          )) || ['Kayaks', 'Paddleboards', 'Life jackets']}
        </div>
      </div>
    </div>
  </div>
);

const WinterSport: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="winter-sport-specific">
    <div className="winter-info">
      <h3>Winter Sport Details</h3>
      <div className="winter-stats">
        <div className="snow-depth">
          <span>Snow depth: {destination.snow_depth || '24 inches'}</span>
        </div>
        <div className="temperature">
          <Thermometer className="w-4 h-4" />
          <span>{destination.winter_temp || '25°F'}</span>
        </div>
        <div className="activities">
          <span>Activities: {destination.winter_activities?.join(', ') || 'Skiing, Snowshoeing'}</span>
        </div>
      </div>
      <div className="season-info">
        <h4>Season Information</h4>
        <p>Best season: {destination.winter_season || 'December - March'}</p>
        <p>Conditions: {destination.snow_conditions || 'Powder'}</p>
      </div>
    </div>
  </div>
);

const RockArt: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="rock-art-specific">
    <div className="art-info">
      <h3>Rock Art Details</h3>
      <div className="art-stats">
        <div className="age">
          <span>Estimated age: {destination.art_age || '1,000-2,000 years'}</span>
        </div>
        <div className="culture">
          <span>Culture: {destination.art_culture || 'Fremont'}</span>
        </div>
        <div className="access">
          <span>Access: {destination.art_access || 'Easy walk'}</span>
        </div>
      </div>
      <div className="preservation-notice">
        <AlertTriangle className="w-4 h-4" />
        <p>Please do not touch the rock art. These are fragile cultural resources.</p>
      </div>
    </div>
  </div>
);

const ScenicDrive: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="scenic-drive-specific">
    <div className="drive-info">
      <h3>Scenic Drive Details</h3>
      <div className="drive-stats">
        <div className="distance">
          <Car className="w-4 h-4" />
          <span>{destination.drive_distance || '12 miles'}</span>
        </div>
        <div className="duration">
          <Clock className="w-4 h-4" />
          <span>{destination.drive_duration || '45 minutes'}</span>
        </div>
        <div className="road-type">
          <span>Road: {destination.road_type || 'Paved'}</span>
        </div>
      </div>
      <div className="viewpoints">
        <h4>Scenic Viewpoints</h4>
        <div className="viewpoint-list">
          {destination.viewpoints?.map((viewpoint: string, index: number) => (
            <div key={index} className="viewpoint">
              <MapPin className="w-3 h-3" />
              <span>{viewpoint}</span>
            </div>
          )) || ['Overlook Point', 'Valley Vista', 'Summit View']}
        </div>
      </div>
    </div>
  </div>
);

const ClimbingRoute: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="climbing-route-specific">
    <div className="climbing-info">
      <h3>Climbing Route Details</h3>
      <div className="climbing-stats">
        <div className="grade">
          <span>Grade: {destination.climbing_grade || '5.10a'}</span>
        </div>
        <div className="height">
          <span>Height: {destination.route_height || '80 feet'}</span>
        </div>
        <div className="type">
          <span>Type: {destination.climbing_type || 'Sport'}</span>
        </div>
        <div className="bolts">
          <span>Bolts: {destination.bolt_count || '8'}</span>
        </div>
      </div>
      <div className="climbing-notes">
        <h4>Route Notes</h4>
        <p>{destination.route_description || 'Classic route with great holds and exposure.'}</p>
      </div>
    </div>
  </div>
);

const WildlifeViewing: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="wildlife-viewing-specific">
    <div className="wildlife-info">
      <h3>Wildlife Viewing</h3>
      <div className="wildlife-stats">
        <div className="best-time">
          <Clock className="w-4 h-4" />
          <span>Best time: {destination.wildlife_best_time || 'Dawn/Dusk'}</span>
        </div>
        <div className="season">
          <span>Season: {destination.wildlife_season || 'Year-round'}</span>
        </div>
      </div>
      <div className="species-list">
        <h4>Common Species</h4>
        <div className="species-grid">
          {destination.wildlife_species?.map((species: string, index: number) => (
            <span key={index} className="species-tag">{species}</span>
          )) || ['Mule Deer', 'Elk', 'Bighorn Sheep', 'Golden Eagle']}
        </div>
      </div>
      <div className="viewing-tips">
        <h4>Viewing Tips</h4>
        <ul>
          <li>Bring binoculars or spotting scope</li>
          <li>Move slowly and quietly</li>
          <li>Stay on designated trails</li>
          <li>Keep your distance</li>
        </ul>
      </div>
    </div>
  </div>
);

const FishingSpot: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="fishing-spot-specific">
    <div className="fishing-info">
      <h3>Fishing Details</h3>
      <div className="fishing-stats">
        <div className="fish-species">
          <span>Species: {destination.fish_species?.join(', ') || 'Rainbow Trout, Brown Trout'}</span>
        </div>
        <div className="best-season">
          <span>Best season: {destination.fishing_season || 'Spring - Fall'}</span>
        </div>
        <div className="license-required">
          <span>License: {destination.fishing_license_required ? 'Required' : 'Not required'}</span>
        </div>
      </div>
      <div className="fishing-tips">
        <h4>Fishing Tips</h4>
        <ul>
          <li>Best time: {destination.fishing_best_time || 'Early morning'}</li>
          <li>Recommended bait: {destination.recommended_bait || 'Artificial flies'}</li>
          <li>Technique: {destination.fishing_technique || 'Fly fishing'}</li>
        </ul>
      </div>
    </div>
  </div>
);

const StargazingSite: React.FC<{ destination: any }> = ({ destination }) => (
  <div className="stargazing-site-specific">
    <div className="stargazing-info">
      <h3>Stargazing Details</h3>
      <div className="stargazing-stats">
        <div className="dark-sky-rating">
          <Sun className="w-4 h-4" />
          <span>Dark Sky Rating: {destination.dark_sky_rating || 'Bortle 2'}</span>
        </div>
        <div className="best-time">
          <span>Best time: {destination.stargazing_best_time || 'New moon'}</span>
        </div>
        <div className="elevation">
          <span>Elevation: {destination.site_elevation || '7,500 ft'}</span>
        </div>
      </div>
      <div className="celestial-events">
        <h4>Celestial Events</h4>
        <div className="events-list">
          {destination.celestial_events?.map((event: string, index: number) => (
            <span key={index} className="event-tag">{event}</span>
          )) || ['Meteor showers', 'Milky Way visibility', 'Planet viewing']}
        </div>
      </div>
      <div className="stargazing-tips">
        <h4>Stargazing Tips</h4>
        <ul>
          <li>Let your eyes adjust for 20-30 minutes</li>
          <li>Use red light to preserve night vision</li>
          <li>Check moon phase before visiting</li>
          <li>Bring warm clothing</li>
        </ul>
      </div>
    </div>
  </div>
);

// Subcategory component mapping
const SubcategoryComponentMapping: Record<string, React.FC<{ destination: any }>> = {
  'hot-springs': HotSprings,
  'slot-canyon': SlotCanyon,
  'via-ferrata': ViaFerrata,
  'hiking-trail': HikingTrail,
  'backcountry-camping': BackcountryCamping,
  'mountain-biking': MountainBiking,
  'water-sport': WaterSport,
  'winter-sport': WinterSport,
  'rock-art': RockArt,
  'scenic-drive': ScenicDrive,
  'climbing-route': ClimbingRoute,
  'wildlife-viewing': WildlifeViewing,
  'fishing-spot': FishingSpot,
  'stargazing-site': StargazingSite
};

const OutdoorAdventureTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory,
  strategicRole,
  primaryColor,
  secondaryColor,
  accentColor
}) => {
  const colors = getTemplateColors('outdoor-adventure');
  
  // Determine which subcategory component to render
  const SubcategoryComponent = subcategory && SubcategoryComponentMapping[subcategory]
    ? SubcategoryComponentMapping[subcategory]
    : null;
  
  // Outdoor adventure specific features
  const isWeatherDependent = destination.is_weather_dependent || false;
  const hasPermitRequired = destination.permit_required || false;
  const isSeasonal = destination.is_seasonal || false;
  const difficultyLevel = destination.difficulty_level || 'moderate';
  
  // Mock affiliate products for outdoor adventures
  const affiliateProducts = [
    {
      id: '1',
      name: 'Osprey Atmos AG 65 Backpack',
      asin: 'B00X7VR79O',
      category: 'Backpacks',
      affiliateLink: 'https://amzn.to/3Hfs94J',
      imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
      description: 'Lightweight, comfortable backpack perfect for multi-day hikes'
    },
    {
      id: '2',
      name: 'Black Diamond Distance Carbon FLZ Trekking Poles',
      asin: 'B07C2VJLXG',
      category: 'Trekking Poles',
      affiliateLink: 'https://amzn.to/3Hfs94J',
      imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
      description: 'Ultralight carbon fiber trekking poles for challenging terrain'
    },
    {
      id: '3',
      name: 'Garmin inReach Mini 2 Satellite Communicator',
      asin: 'B08QJ7V3B8',
      category: 'Safety & Communication',
      affiliateLink: 'https://amzn.to/3Hfs94J',
      imageUrl: 'https://m.media-amazon.com/images/I/71QKQf0qHhL._AC_SL1500_.jpg',
      description: 'Essential safety device for remote adventures'
    }
  ];

  // SEO and structured data
  const seoData = {
    title: `${destination.name} - Outdoor Adventure Guide | SLCTrips`,
    description: `Discover ${destination.name}, a premier outdoor adventure destination near Salt Lake City. Get trail info, gear recommendations, and insider tips for your Utah adventure.`,
    keywords: ['outdoor adventure', 'hiking', 'Utah', 'Salt Lake City', destination.name, 'trail guide'],
    image: destination.photos?.[0]?.url || destination.image_url,
    url: `https://www.slctrips.com/destinations/${destination.id}`,
    type: 'destination',
    location: {
      name: destination.name,
      address: destination.address,
      lat: destination.latitude,
      lng: destination.longitude
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Visit ${destination.name}`,
        text: `Check out this amazing outdoor adventure at ${destination.name}!`,
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    // Add to favorites functionality
    fetch('/api/user/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationId: destination.id })
    }).then(() => {
      alert('Added to favorites!');
    }).catch(console.error);
  };
  
  return (
    <>
      <SEOHead {...seoData} />
      <StructuredData 
        destination={{
          id: destination.id,
          name: destination.name,
          description: destination.description,
          category: destination.category || 'outdoor-adventure',
          photos: destination.photos?.map((p: any) => p.url) || [],
          address: destination.address,
          coordinates: destination.coordinates,
          phone: destination.phone,
          pricing: destination.pricing,
          subscriptionTier: destination.subscriptionTier,
          hours: destination.hours,
          rating: destination.rating,
          isOlympicVenue: destination.isOlympicVenue
        }}
      />
      <div className="outdoor-adventure-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Hero section with outdoor imagery */}
      <section className="outdoor-hero">
        <div className="hero-image">
          <img 
            src={destination.photos && destination.photos.length > 0 
              ? `/api/photo-proxy?url=${encodeURIComponent(destination.photos[0].url)}` 
              : destination.image_url 
                ? `/api/photo-proxy?url=${encodeURIComponent(destination.image_url)}` 
                : '/assets/default-outdoor.jpg'} 
            alt={destination.photos && destination.photos.length > 0 ? destination.photos[0].alt_text : destination.name}
            className="hero-bg"
          />
          <div className="hero-overlay">
            <div className="outdoor-badges">
              {hasPermitRequired && (
                <div className="permit-badge">
                  <AlertTriangle className="w-4 h-4" />
                  Permit Required
                </div>
              )}
              {isWeatherDependent && (
                <div className="weather-badge">
                  <Cloud className="w-4 h-4" />
                  Weather Dependent
                </div>
              )}
              {isSeasonal && (
                <div className="seasonal-badge">
                  <Sun className="w-4 h-4" />
                  Seasonal
                </div>
              )}
            </div>
            
            <div className="hero-content">
              <h1>{destination.name}</h1>
              <div className="difficulty-level">
                <span className={`difficulty-badge ${difficultyLevel}`}>
                  {difficultyLevel.toUpperCase()}
                </span>
              </div>
              
              <div className="hero-stats">
                <span className="drive-time">{destination.driveTime} min from SLC</span>
                <span className="elevation">
                  <Mountain className="w-4 h-4" />
                  {destination.elevation || '6,500 ft'}
                </span>
              </div>

              {/* Social Actions */}
              <div className="social-actions">
                <button 
                  onClick={handleShare}
                  className="share-btn"
                  title="Share this destination"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button 
                  onClick={handleBookmark}
                  className="bookmark-btn"
                  title="Add to favorites"
                >
                  <Bookmark className="w-4 h-4" />
                  Save
                </button>
                <button 
                  className="rate-btn"
                  title="Rate this destination"
                >
                  <Star className="w-4 h-4" />
                  Rate
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Photo Gallery */}
      {destination.photos && destination.photos.length > 1 && (
        <section className="photo-gallery">
          <h2>Destination Photos</h2>
          <div className="gallery-grid">
            {destination.photos.slice(1).map((photo: any, index: number) => (
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
      
      {/* Weather and conditions */}
      <section className="weather-conditions">
        <h2>Current Conditions</h2>
        <div className="conditions-grid">
          <div className="weather-card">
            <Sun className="w-5 h-5" />
            <div className="weather-info">
              <span className="temperature">{destination.current_temp || '65°F'}</span>
              <span className="condition">{destination.weather_condition || 'Sunny'}</span>
            </div>
          </div>
          <div className="wind-card">
            <Cloud className="w-5 h-5" />
            <div className="wind-info">
              <span className="wind-speed">{destination.wind_speed || '5 mph'}</span>
              <span className="wind-direction">{destination.wind_direction || 'SW'}</span>
            </div>
          </div>
          {destination.visibility && (
            <div className="visibility-card">
              <Cloud className="w-5 h-5" />
              <div className="visibility-info">
                <span className="visibility">{destination.visibility}</span>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Subcategory-specific component */}
      {SubcategoryComponent && (
        <section className={`subcategory-section ${subcategory}`}>
          <SubcategoryComponent destination={destination} />
        </section>
      )}
      
      {/* Safety information */}
      <section className="safety-info">
        <h2>Safety Information</h2>
        <div className="safety-grid">
          <div className="safety-card">
            <AlertTriangle className="w-5 h-5" />
            <h3>Emergency Contacts</h3>
            <p>911 for emergencies</p>
            <p>Park Ranger: {destination.ranger_contact || '(435) 123-4567'}</p>
          </div>
          <div className="safety-card">
            <Compass className="w-5 h-5" />
            <h3>Navigation</h3>
            <p>Download offline maps</p>
            <p>Bring compass/GPS</p>
          </div>
          <div className="safety-card">
            <Users className="w-5 h-5" />
            <h3>Group Size</h3>
            <p>Recommended: {destination.recommended_group_size || '2-4 people'}</p>
            <p>Never hike alone</p>
          </div>
        </div>
      </section>
      
      {/* Equipment and preparation */}
      <section className="equipment-prep">
        <h2>Equipment & Preparation</h2>
        <div className="equipment-grid">
          <div className="essential-gear">
            <h3>Essential Gear</h3>
            <ul>
              {destination.essential_gear?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || [
                'Water (2+ liters per person)',
                'Snacks and food',
                'First aid kit',
                'Weather-appropriate clothing',
                'Sturdy footwear',
                'Map and compass'
              ]}
            </ul>
          </div>
          <div className="recommended-gear">
            <h3>Recommended Gear</h3>
            <ul>
              {destination.recommended_gear?.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              )) || [
                'Headlamp/flashlight',
                'Multi-tool',
                'Emergency shelter',
                'Fire starter',
                'Sunscreen and hat'
              ]}
            </ul>
          </div>
        </div>
      </section>
      
      {/* Similar outdoor adventures */}
      <section className="similar-adventures">
        <h2>More Outdoor Adventures</h2>
        <div className="adventures-grid">
          <div className="adventure-card coming-soon">
            <div className="card-image">
              <div className="placeholder-image">
                <Mountain className="w-8 h-8" />
              </div>
            </div>
            <div className="card-content">
              <h4>Nearby Destinations</h4>
              <p>Discover more outdoor adventures in this area</p>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
          <div className="adventure-card coming-soon">
            <div className="card-image">
              <div className="placeholder-image">
                <Tent className="w-8 h-8" />
              </div>
            </div>
            <div className="card-content">
              <h4>Related Trails</h4>
              <p>Explore connected hiking routes</p>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
          <div className="adventure-card coming-soon">
            <div className="card-image">
              <div className="placeholder-image">
                <Compass className="w-8 h-8" />
              </div>
            </div>
            <div className="card-content">
              <h4>Seasonal Activities</h4>
              <p>Year-round adventure options</p>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* TripKit promotion */}
      <section className="tripkit-promo">
        <div className="tripkit-promotion">
          <div className="promo-content">
            <h3>Complete Outdoor Adventure Guide</h3>
            <div className="price">$19.99</div>
            <ul className="features">
              <li>50+ hand-picked outdoor destinations</li>
              <li>Detailed trail maps and GPS coordinates</li>
              <li>Seasonal recommendations and timing</li>
              <li>Safety tips and emergency procedures</li>
            </ul>
            <button className="buy-now-btn">
              <Mountain className="w-4 h-4" />
              Get Adventure Guide
            </button>
          </div>
        </div>
      </section>

      {/* Affiliate Gear Recommendations */}
      <section className="affiliate-gear">
        <AmazonProductCTA
          products={affiliateProducts.map(product => ({
            productName: product.name,
            asin: product.asin,
            affiliateLink: product.affiliateLink,
            description: product.description,
            imageUrl: product.imageUrl,
            category: product.category
          }))}
          title="Recommended Gear for This Adventure"
          showDisclosure={true}
          maxProducts={3}
          className="mt-8"
        />
      </section>
    </div>
    </>
  );
};

export default OutdoorAdventureTemplate;