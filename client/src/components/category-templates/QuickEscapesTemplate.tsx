import React from 'react';
import { DestinationTemplateProps } from '@/types/destination-types';
import { getTemplateColors } from '../../utils/destination-template-detector';
import { Clock, Car, MapPin, AlertTriangle, CheckCircle, Sun, Cloud, Coffee, Zap, Heart } from 'lucide-react';

// Placeholder components - these would need to be created
const TrafficAlert: React.FC<{ 
  status?: string; 
  message?: string; 
}> = ({ status, message }) => (
  <div className={`traffic-alert ${status}`}>
    <div className="alert-header">
      <Car className="w-4 h-4" />
      <span>Traffic Status</span>
    </div>
    <div className="alert-content">
      <span className="status">{status || 'Normal'}</span>
      {message && <p className="message">{message}</p>}
    </div>
  </div>
);

const ParkingStatus: React.FC<{ 
  status?: string; 
  spotsAvailable?: number; 
  totalSpots?: number; 
  parkingTips?: string; 
}> = ({ status, spotsAvailable, totalSpots, parkingTips }) => (
  <div className="parking-status">
    <div className="status-header">
      <MapPin className="w-4 h-4" />
      <span>Parking</span>
    </div>
    <div className="status-content">
      <span className="status">{status || 'Available'}</span>
      {spotsAvailable !== undefined && totalSpots && (
        <span className="spots">{spotsAvailable}/{totalSpots} spots available</span>
      )}
      {parkingTips && <p className="tips">{parkingTips}</p>}
    </div>
  </div>
);

const WeatherConditions: React.FC<{ 
  temperature?: number; 
  condition?: string; 
  precipitation?: number; 
}> = ({ temperature, condition, precipitation }) => (
  <div className="weather-conditions">
    <div className="weather-header">
      <Sun className="w-4 h-4" />
      <span>Weather</span>
    </div>
    <div className="weather-content">
      <span className="temperature">{temperature || 72}°F</span>
      <span className="condition">{condition || 'Sunny'}</span>
      {precipitation !== undefined && (
        <span className="precipitation">{precipitation}% chance of rain</span>
      )}
    </div>
  </div>
);

const TimeAllocation: React.FC<{ 
  timeBlocks?: any[]; 
  totalTime: number; 
}> = ({ timeBlocks = [], totalTime }) => (
  <div className="time-allocation">
    <div className="allocation-header">
      <Clock className="w-5 h-5" />
      <h3>Time Breakdown</h3>
    </div>
    <div className="allocation-chart">
      {timeBlocks.length > 0 ? (
        <div className="time-blocks">
          {timeBlocks.map((block, index) => (
            <div key={index} className="time-block">
              <div className="block-label">{block.activity}</div>
              <div className="block-time">{block.duration} min</div>
              <div 
                className="block-bar" 
                style={{ width: `${(block.duration / totalTime) * 100}%` }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="default-allocation">
          <div className="time-block">
            <div className="block-label">Travel Time</div>
            <div className="block-time">30 min</div>
            <div className="block-bar" style={{ width: '50%' }} />
          </div>
          <div className="time-block">
            <div className="block-label">Experience</div>
            <div className="block-time">30 min</div>
            <div className="block-bar" style={{ width: '50%' }} />
          </div>
        </div>
      )}
    </div>
  </div>
);

const TimeSensitiveRecommendations: React.FC<{ 
  currentId: string; 
  currentTimeNeeded: number; 
  timeOfDay: number; 
  dayOfWeek: number; 
  maxDistance: number; 
  limit: number; 
}> = ({ currentId, currentTimeNeeded, timeOfDay, dayOfWeek, maxDistance, limit }) => (
  <div className="time-sensitive-recommendations">
    <div className="recommendations-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="recommendation-card">
          <div className="card-image">
            <img src={`/assets/quick-escape-${i}.jpg`} alt="Quick escape" />
          </div>
          <div className="card-content">
            <h4>Quick Escape #{i}</h4>
            <p>Perfect for your available time</p>
            <div className="time-info">
              <Clock className="w-3 h-3" />
              <span>{Math.floor(Math.random() * 60) + 30} min</span>
            </div>
            <span className="distance">{Math.floor(Math.random() * 15) + 5} miles away</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const QuickEscapesTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory 
}) => {
  const colors = getTemplateColors('quick-escapes');
  
  // Quick escapes specific features
  const isLunchBreak = subcategory?.includes('lunch-break') || false;
  const isAfterWork = subcategory?.includes('after-work') || false;
  const isMinimalPrep = subcategory?.includes('minimal-prep') || false;
  const isUrbanEscape = subcategory?.includes('urban') || false;
  const isSunsetChaser = subcategory?.includes('sunset') || false;
  
  const totalTimeNeeded = destination.time_needed_minutes || 60;
  const prepTimeNeeded = destination.prep_time_minutes || 5;
  const estimatedDriveTime = destination.driveTime || 15;
  
  // Simulate real-time data
  const trafficStatus = 'normal'; // Would come from API
  const parkingStatus = 'available';
  const parkingAvailable = 12;
  const totalParkingSpots = 20;
  
  return (
    <div className="quick-escapes-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Time-focused hero */}
      <section className="quick-escape-hero">
        <div className="hero-image">
          <img 
            src={destination.image_url ? `/api/photo-proxy?url=${encodeURIComponent(destination.image_url)}` : '/assets/default-quick-escape.jpg'} 
            alt={destination.name}
            className="hero-bg"
          />
          <div className="hero-overlay">
            <div className="time-badge-container">
              <div className="time-badge">
                <span className="time-number">{Math.round(totalTimeNeeded / 60)}</span>
                <span className="time-unit">hr{totalTimeNeeded >= 120 ? 's' : ''}</span>
              </div>
            </div>
            
            <div className="hero-content">
              <h1>{destination.name}</h1>
              <div className="quick-stats">
                <div className="drive-time">
                  <Car className="w-4 h-4" /> {estimatedDriveTime} min from SLC
                </div>
                <div className="prep-time">
                  <Zap className="w-4 h-4" /> {prepTimeNeeded} min prep
                </div>
              </div>
              
              <div className="escape-type">
                {isLunchBreak && <span className="type-badge lunch">Lunch Break</span>}
                {isAfterWork && <span className="type-badge after-work">After Work</span>}
                {isSunsetChaser && <span className="type-badge sunset">Sunset Chaser</span>}
                {isUrbanEscape && <span className="type-badge urban">Urban Escape</span>}
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
      
      {/* Real-time conditions */}
      <section className="real-time-conditions">
        <h2>Current Conditions</h2>
        <div className="conditions-grid">
          {/* Traffic alert */}
          <TrafficAlert 
            status={trafficStatus}
            message={trafficStatus === 'heavy' ? 'Heavy traffic alert! Consider alternate route.' : undefined}
          />
          
          {/* Parking availability */}
          <ParkingStatus 
            status={parkingStatus}
            spotsAvailable={parkingAvailable}
            totalSpots={totalParkingSpots}
            parkingTips={destination.parking_tips}
          />
          
          {/* Weather conditions - relevant for outdoor quick escapes */}
          {destination.is_outdoor && (
            <WeatherConditions
              temperature={destination.current_temp}
              condition={typeof destination.current_weather === 'string' ? destination.current_weather : undefined}
              precipitation={typeof destination.weather_forecast === 'object' && destination.weather_forecast !== null ? (destination.weather_forecast as any).precipitation_chance : undefined}
            />
          )}
        </div>
      </section>
      
      {/* Time allocation visualization - how to spend your limited time */}
      <section className="time-allocation">
        <h2>How to Spend Your Time</h2>
        <TimeAllocation 
          timeBlocks={destination.recommended_time_blocks}
          totalTime={totalTimeNeeded}
        />
        
        {isLunchBreak && (
          <div className="lunch-specific">
            <h3>Perfect for Lunch Break</h3>
            <div className="timing-recommendation">
              <p>Arrive at <strong>{destination.recommended_arrival_time || '11:30 AM'}</strong> to maximize your lunch hour</p>
            </div>
          </div>
        )}
        
        {isAfterWork && (
          <div className="after-work-specific">
            <h3>After Work Details</h3>
            <div className="sunset-timing">
              <p>Current sunset: <strong>{destination.current_sunset_time || '7:45 PM'}</strong></p>
              <p>Recommended arrival: <strong>{destination.recommended_after_work_arrival || '6:30 PM'}</strong></p>
            </div>
          </div>
        )}
      </section>
      
      {/* Quick checklist - what to bring/know */}
      <section className="quick-checklist">
        <h2>Quick Checklist</h2>
        <div className="checklist-container">
          {(destination.quick_checklist || [
            { icon: 'check', label: 'Comfortable shoes' },
            { icon: 'check', label: 'Water bottle' },
            { icon: 'check', label: 'Camera/phone' },
            { icon: 'check', label: 'Light jacket' }
          ]).map((item, index) => (
            <div key={index} className="checklist-item">
              <CheckCircle className="w-4 h-4" />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>
      
      {/* The essentials - ultra-condensed information */}
      <section className="quick-essentials">
        <h2>Just the Essentials</h2>
        <div className="essentials-container">
          <div className="essential-description">
            <p>{destination.essential_description || destination.description}</p>
          </div>
          
          {/* Key photo spots for quick visits */}
          {destination.key_photo_spots && (
            <div className="key-photo-spots">
              <h3>Don't Miss These Shots</h3>
              <div className="photo-spots-grid">
                {destination.key_photo_spots.map((spot, index) => (
                  <div key={index} className="photo-spot">
                    <img src={spot.thumbnail} alt={spot.name} />
                    <p>{spot.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Essential tips */}
          <div className="pro-tips">
            <h3>Pro Tips</h3>
            <ul className="tips-list">
              {(destination.pro_tips || [
                'Go early to avoid crowds',
                'Bring a light snack',
                'Check the weather before you go',
                'Take the scenic route back'
              ]).map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      
      {/* Time-based recommendations */}
      <section className="time-based-recs">
        <h2>More Quick Escapes</h2>
        <div className="quick-recommendations">
          <TimeSensitiveRecommendations 
            currentId={destination.id}
            currentTimeNeeded={totalTimeNeeded}
            timeOfDay={new Date().getHours()}
            dayOfWeek={new Date().getDay()}
            maxDistance={30}
            limit={3}
          />
        </div>
      </section>
      
      {/* TripKit promotion */}
      <section className="tripkit-promo">
        <div className="tripkit-promotion">
          <div className="promo-content">
            <h3>{isLunchBreak ? "Lunch Break Escapes" : 
                 isAfterWork ? "After Work Adventures" : "Quick Escape TripKit"}</h3>
            <div className="price">$9.99</div>
            <ul className="features">
              <li>30+ quick adventures under 2 hours</li>
              <li>Real-time parking & traffic alerts</li>
              <li>Time-optimized itineraries</li>
              <li>Lunch break & after-work specials</li>
            </ul>
            <button className="buy-now-btn">
              <Clock className="w-4 h-4" />
              Get Quick Escape Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default QuickEscapesTemplate; 