import React, { useState } from 'react';
import { DestinationTemplateProps } from '@/types/destination-types';
import { getTemplateColors } from '../../utils/destination-template-detector';
import { Users, Baby, Heart, MapPin, Clock, CheckCircle, AlertTriangle, Sun, Cloud, Calendar } from 'lucide-react';

// Age ranges for filtering
const AGE_RANGES = {
  toddler: { min: 1, max: 3, label: "Toddlers (1-3)" },
  preschool: { min: 4, max: 5, label: "Preschool (4-5)" },
  elementary: { min: 6, max: 11, label: "Elementary (6-11)" },
  teen: { min: 12, max: 17, label: "Teens (12-17)" }
};

// Placeholder components - these would need to be created
const AgeFilter: React.FC<{ 
  ageRanges: any[]; 
  selectedRange: string | null; 
  onRangeSelect: (range: string) => void; 
  destinationAgeRange: { min: number; max: number }; 
}> = ({ ageRanges, selectedRange, onRangeSelect, destinationAgeRange }) => (
  <div className="age-filter">
    <div className="filter-buttons">
      {ageRanges.map((range) => {
        const isCompatible = range.min <= destinationAgeRange.max && range.max >= destinationAgeRange.min;
        const isSelected = selectedRange === range.label;
        
        return (
          <button
            key={range.label}
            className={`age-button ${isSelected ? 'selected' : ''} ${!isCompatible ? 'disabled' : ''}`}
            onClick={() => isCompatible && onRangeSelect(range.label)}
            disabled={!isCompatible}
          >
            {range.label}
            {!isCompatible && <span className="incompatible">Not suitable</span>}
          </button>
        );
      })}
    </div>
  </div>
);

const FamilyAmenities: React.FC<{ 
  amenities?: any[]; 
  hasRestrooms?: boolean; 
  hasFoodOptions?: boolean; 
  hasChangingTables?: boolean; 
  hasNursingArea?: boolean; 
  waterFountains?: boolean; 
  restroomLocations?: any[]; 
}> = ({ amenities = [], hasRestrooms, hasFoodOptions, hasChangingTables, hasNursingArea, waterFountains, restroomLocations }) => (
  <div className="family-amenities">
    <div className="amenities-grid">
      {hasRestrooms && (
        <div className="amenity-item">
          <CheckCircle className="w-4 h-4" />
          <span>Restrooms Available</span>
        </div>
      )}
      {hasFoodOptions && (
        <div className="amenity-item">
          <CheckCircle className="w-4 h-4" />
          <span>Food Options</span>
        </div>
      )}
      {hasChangingTables && (
        <div className="amenity-item">
          <CheckCircle className="w-4 h-4" />
          <span>Changing Tables</span>
        </div>
      )}
      {hasNursingArea && (
        <div className="amenity-item">
          <CheckCircle className="w-4 h-4" />
          <span>Nursing Area</span>
        </div>
      )}
      {waterFountains && (
        <div className="amenity-item">
          <CheckCircle className="w-4 h-4" />
          <span>Water Fountains</span>
        </div>
      )}
      {amenities.map((amenity, index) => (
        <div key={index} className="amenity-item">
          <CheckCircle className="w-4 h-4" />
          <span>{amenity}</span>
        </div>
      ))}
    </div>
    
    {restroomLocations && restroomLocations.length > 0 && (
      <div className="restroom-locations">
        <h4>Restroom Locations</h4>
        <ul>
          {restroomLocations.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const ActivityLevel: React.FC<{ level: string }> = ({ level }) => {
  const getLevelInfo = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return { label: 'Low Activity', color: 'green', icon: '🌱' };
      case 'medium':
        return { label: 'Medium Activity', color: 'yellow', icon: '🌿' };
      case 'high':
        return { label: 'High Activity', color: 'red', icon: '🏃' };
      default:
        return { label: 'Moderate Activity', color: 'blue', icon: '🚶' };
    }
  };
  
  const info = getLevelInfo(level);
  
  return (
    <div className={`activity-level ${info.color}`}>
      <span className="level-icon">{info.icon}</span>
      <span className="level-label">{info.label}</span>
    </div>
  );
};

const FamilyWeatherAlert: React.FC<{ 
  weather?: any; 
  isOutdoor?: boolean; 
  kidFriendlyNotes?: string; 
}> = ({ weather, isOutdoor, kidFriendlyNotes }) => (
  <div className="family-weather-alert">
    <div className="alert-header">
      <Sun className="w-5 h-5" />
      <h3>Weather for Families</h3>
    </div>
    <div className="alert-content">
      <div className="current-weather">
        <span className="temperature">{weather?.temperature || 72}°F</span>
        <span className="condition">{weather?.condition || 'Sunny'}</span>
      </div>
      {isOutdoor && (
        <div className="outdoor-notes">
          <p>{kidFriendlyNotes || 'Great weather for outdoor family activities!'}</p>
        </div>
      )}
    </div>
  </div>
);

const PlaygroundFeatures: React.FC<{ 
  features?: any[]; 
  surfaceType?: string; 
  shadeAvailability?: string; 
}> = ({ features = [], surfaceType, shadeAvailability }) => (
  <div className="playground-features">
    <div className="features-grid">
      {features.map((feature, index) => (
        <div key={index} className="feature-item">
          <CheckCircle className="w-4 h-4" />
          <span>{feature}</span>
        </div>
      ))}
    </div>
    {surfaceType && (
      <div className="surface-info">
        <h4>Surface Type</h4>
        <p>{surfaceType}</p>
      </div>
    )}
    {shadeAvailability && (
      <div className="shade-info">
        <h4>Shade Availability</h4>
        <p>{shadeAvailability}</p>
      </div>
    )}
  </div>
);

const LearningOpportunities: React.FC<{ 
  subjects?: string[]; 
  ageGroups?: string[]; 
  curricularConnections?: any[]; 
}> = ({ subjects = [], ageGroups = [], curricularConnections = [] }) => (
  <div className="learning-opportunities">
    {subjects.length > 0 && (
      <div className="subjects">
        <h4>Educational Subjects</h4>
        <div className="subject-tags">
          {subjects.map((subject, index) => (
            <span key={index} className="subject-tag">{subject}</span>
          ))}
        </div>
      </div>
    )}
    {ageGroups.length > 0 && (
      <div className="age-groups">
        <h4>Appropriate Age Groups</h4>
        <div className="age-tags">
          {ageGroups.map((group, index) => (
            <span key={index} className="age-tag">{group}</span>
          ))}
        </div>
      </div>
    )}
    {curricularConnections.length > 0 && (
      <div className="curricular-connections">
        <h4>Curriculum Connections</h4>
        <ul>
          {curricularConnections.map((connection, index) => (
            <li key={index}>{connection}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const BirthdayOptions: React.FC<{ 
  packages?: any[]; 
  pricing?: any; 
  capacity?: number; 
  reservationLink?: string; 
  amenities?: string[]; 
}> = ({ packages = [], pricing, capacity, reservationLink, amenities = [] }) => (
  <div className="birthday-options">
    {packages.length > 0 && (
      <div className="birthday-packages">
        <h4>Birthday Packages</h4>
        <div className="packages-grid">
          {packages.map((pkg, index) => (
            <div key={index} className="package-card">
              <h5>{pkg.name}</h5>
              <p className="price">${pkg.price}</p>
              <p className="description">{pkg.description}</p>
            </div>
          ))}
        </div>
      </div>
    )}
    {capacity && (
      <div className="capacity-info">
        <h4>Capacity</h4>
        <p>Up to {capacity} children</p>
      </div>
    )}
    {amenities.length > 0 && (
      <div className="birthday-amenities">
        <h4>Birthday Amenities</h4>
        <ul>
          {amenities.map((amenity, index) => (
            <li key={index}>{amenity}</li>
          ))}
        </ul>
      </div>
    )}
    {reservationLink && (
      <div className="reservation-action">
        <button className="reserve-btn">
          <Calendar className="w-4 h-4" />
          Reserve Birthday Party
        </button>
      </div>
    )}
  </div>
);

const FamilyRecommendations: React.FC<{ 
  currentId: string; 
  ageRange?: any; 
  maxDistance: number; 
  limit: number; 
}> = ({ currentId, ageRange, maxDistance, limit }) => (
  <div className="family-recommendations">
    <div className="recommendations-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="recommendation-card">
          <div className="card-image">
            <img src={`/assets/family-${i}.jpg`} alt="Family destination" />
          </div>
          <div className="card-content">
            <h4>Family Spot #{i}</h4>
            <p>Great for families with kids</p>
            <div className="age-range">
              <Users className="w-3 h-3" />
              <span>Ages 3-12</span>
            </div>
            <span className="distance">{Math.floor(Math.random() * 20) + 5} miles away</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const YouthFamilyTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory 
}) => {
  const colors = getTemplateColors('youth-family');
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);
  
  const isPlayground = subcategory?.includes('playground') || false;
  const isIndoor = subcategory?.includes('indoor') || false;
  const isEducational = subcategory?.includes('educational') || false;
  const isBirthday = subcategory?.includes('birthday') || false;
  const isStrollerFriendly = destination.is_stroller_friendly || false;
  
  // Filter activities by selected age range
  const getAgeAppropriateActivities = () => {
    if (!selectedAgeRange) return destination.activities;
    
    const { min, max } = AGE_RANGES[selectedAgeRange as keyof typeof AGE_RANGES];
    return destination.activities?.filter((activity: any) => 
      activity.min_age <= max && activity.max_age >= min
    ) || [];
  };
  
  const ageAppropriateActivities = getAgeAppropriateActivities();
  
  return (
    <div className="youth-family-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Family-focused hero with kid-friendly indicators */}
      <section className="family-hero">
        <div className="hero-image">
          <img 
            src={destination.image_url ? `/api/photo-proxy?url=${encodeURIComponent(destination.image_url)}` : '/assets/default-family.jpg'} 
            alt={destination.name}
            className="hero-bg"
          />
          <div className="hero-overlay">
            <div className="family-badges">
              {destination.is_free && (
                <div className="free-badge">FREE</div>
              )}
              {isStrollerFriendly && (
                <div className="stroller-badge">
                  <Baby className="w-4 h-4" /> Stroller-Friendly
                </div>
              )}
              {destination.has_changing_tables && (
                <div className="changing-table-badge">
                  <CheckCircle className="w-4 h-4" /> Changing Tables
                </div>
              )}
            </div>
            
            <div className="hero-content">
              <h1>{destination.name}</h1>
              <div className="age-range">
                <p>Best for ages {destination.min_age || 3}-{destination.max_age || 12}</p>
              </div>
              
              <div className="hero-stats">
                <span className="drive-time">{destination.driveTime} min from SLC</span>
                <span className="family-rating">
                  <Heart className="w-4 h-4" />
                  Family Favorite
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
      
      {/* Weather recommendations for families */}
      {!isIndoor && (
        <section className="weather-alert">
          <FamilyWeatherAlert 
            weather={destination.current_weather}
            isOutdoor={!isIndoor}
            kidFriendlyNotes={destination.weather_notes_for_families}
          />
        </section>
      )}
      
      {/* Age filter to highlight age-appropriate activities */}
      <section className="age-filter-section">
        <h2>Filter by Age</h2>
        <AgeFilter 
          ageRanges={Object.values(AGE_RANGES)}
          selectedRange={selectedAgeRange}
          onRangeSelect={setSelectedAgeRange}
          destinationAgeRange={{ min: destination.min_age || 3, max: destination.max_age || 12 }}
        />
      </section>
      
      {/* Family amenities - the practical stuff parents need */}
      <section className="family-amenities">
        <h2>Family Amenities</h2>
        <FamilyAmenities 
          amenities={destination.family_amenities}
          hasRestrooms={destination.has_restrooms}
          hasFoodOptions={destination.has_food_options}
          hasChangingTables={destination.has_changing_tables}
          hasNursingArea={destination.has_nursing_area}
          waterFountains={destination.has_water_fountains}
          restroomLocations={destination.restroom_locations}
        />
      </section>
      
      {/* Age-appropriate activities */}
      <section className="activities-section">
        <h2>
          {selectedAgeRange 
            ? `Activities for ${AGE_RANGES[selectedAgeRange as keyof typeof AGE_RANGES].label}`
            : 'Activities for All Ages'}
        </h2>
        
        {ageAppropriateActivities.length > 0 ? (
          <div className="activities-container">
            {ageAppropriateActivities.map((activity, index) => (
              <div key={index} className="activity-card">
                <div className="activity-image">
                  <img src={activity.image || '/assets/default-activity.jpg'} alt={activity.name} />
                </div>
                <div className="activity-content">
                  <h3>{activity.name}</h3>
                  <p className="age-range">Ages {activity.min_age}-{activity.max_age}</p>
                  <ActivityLevel level={activity.activity_level} />
                  <p className="activity-description">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-activities">No activities found for this age range.</p>
        )}
      </section>
      
      {/* Type-specific sections */}
      {isPlayground && (
        <section className="playground-specifics">
          <h2>Playground Details</h2>
          <div className="playground-features">
            <PlaygroundFeatures 
              features={destination.playground_features}
              surfaceType={destination.playground_surface}
              shadeAvailability={destination.shade_availability}
            />
          </div>
        </section>
      )}
      
      {isEducational && (
        <section className="educational-content">
          <h2>Educational Value</h2>
          <div className="learning-opportunities">
            <LearningOpportunities 
              subjects={destination.educational_subjects}
              ageGroups={destination.educational_age_groups}
              curricularConnections={destination.curricular_connections}
            />
          </div>
        </section>
      )}
      
      {isBirthday && (
        <section className="birthday-options">
          <h2>Birthday Party Information</h2>
          <BirthdayOptions 
            packages={destination.birthday_packages}
            pricing={destination.birthday_pricing}
            capacity={destination.birthday_capacity}
            reservationLink={destination.birthday_reservation_link}
            amenities={destination.birthday_amenities}
          />
        </section>
      )}
      
      {/* Parent tips section */}
      <section className="parent-tips">
        <h2>Parent Tips</h2>
        <div className="tips-container">
          {(destination.parent_tips || [
            'Bring extra snacks and water',
            'Pack sunscreen and hats for outdoor activities',
            'Consider bringing a change of clothes',
            'Check for height requirements before visiting'
          ]).map((tip, index) => (
            <div key={index} className="parent-tip">
              <CheckCircle className="w-4 h-4" />
              <p>{tip}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Kid quotes - what kids say about this place */}
      {destination.kid_quotes && (
        <section className="kid-quotes">
          <h2>What Kids Say</h2>
          <div className="quotes-container">
            {destination.kid_quotes.map((quote, index) => (
              <div key={index} className="kid-quote">
                <p className="quote-text">"{quote.text}"</p>
                <p className="quote-attribution">— {quote.name}, age {quote.age}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Family itineraries - how to structure your visit */}
      <section className="family-itineraries">
        <h2>Family Itineraries</h2>
        <div className="itineraries-container">
          {(destination.family_itineraries || [
            {
              title: "Quick Visit (1-2 hours)",
              duration: "1-2 hours",
              description: "Perfect for young children with short attention spans"
            },
            {
              title: "Half-Day Adventure (3-4 hours)",
              duration: "3-4 hours",
              description: "Include lunch and multiple activities"
            },
            {
              title: "Full Day Experience (5-6 hours)",
              duration: "5-6 hours",
              description: "Comprehensive visit with breaks and meals"
            }
          ]).map((itinerary, index) => (
            <div key={index} className="itinerary-card">
              <h3>{itinerary.title}</h3>
              <p className="itinerary-duration">{itinerary.duration}</p>
              <p className="itinerary-description">{itinerary.description}</p>
              <button className="view-itinerary-btn">View Full Itinerary</button>
            </div>
          ))}
        </div>
      </section>
      
      {/* Family-friendly recommendations nearby */}
      <section className="nearby-family-friendly">
        <h2>More Family Adventures Nearby</h2>
        <div className="family-recommendations">
          <FamilyRecommendations
            currentId={String(destination.id)}
            ageRange={selectedAgeRange ? AGE_RANGES[selectedAgeRange as keyof typeof AGE_RANGES] : undefined}
            maxDistance={15}
            limit={3}
          />
        </div>
      </section>
      
      {/* TripKit promotion */}
      <section className="tripkit-promo">
        <div className="tripkit-promotion">
          <div className="promo-content">
            <h3>{isPlayground ? "Playground Explorer Kit" : 
                 isIndoor ? "Rainy Day Rescue Kit" : "Family Fun TripKit"}</h3>
            <div className="price">$14.99</div>
            <ul className="features">
              <li>Age-appropriate adventures for every family</li>
              <li>Parent-tested itineraries</li>
              <li>Emergency bathroom map included</li>
              <li>Kid-friendly restaurant recommendations</li>
            </ul>
            <button className="buy-now-btn">
              <Heart className="w-4 h-4" />
              Get Family Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default YouthFamilyTemplate; 