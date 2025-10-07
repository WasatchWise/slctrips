import React, { useState } from 'react';
import { DestinationTemplateProps } from '@/types/destination-types';
import { getTemplateColors } from '../../utils/destination-template-detector';
import { Calendar, Clock, Sun, Cloud, Snowflake, Leaf, Flower, AlertTriangle, MapPin, Star } from 'lucide-react';

// Placeholder components - these would need to be created
const CountdownTimer: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="countdown-timer">
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.days}</span>
          <span className="countdown-label">Days</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.hours}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.minutes}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.seconds}</span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

const SeasonalAlert: React.FC<{ 
  type?: string; 
  status?: string; 
  peakPercentage?: number; 
}> = ({ type, status, peakPercentage }) => (
  <div className="seasonal-alert">
    <div className="alert-header">
      <AlertTriangle className="w-5 h-5" />
      <h3>Seasonal Status</h3>
    </div>
    <div className="alert-content">
      <p className="status">{status || 'Active'}</p>
      {peakPercentage && (
        <div className="peak-indicator">
          <span>Peak: {peakPercentage}%</span>
          <div className="peak-bar">
            <div 
              className="peak-fill" 
              style={{ width: `${peakPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  </div>
);

const WeatherImpact: React.FC<{ 
  weatherData?: any; 
  seasonType?: string; 
  weatherForecast?: any; 
}> = ({ weatherData, seasonType, weatherForecast }) => (
  <div className="weather-impact">
    <div className="weather-header">
      <Cloud className="w-5 h-5" />
      <h3>Weather Impact</h3>
    </div>
    <div className="weather-content">
      <div className="current-conditions">
        <h4>Current Conditions</h4>
        <p>{weatherData?.current || 'Clear skies'}</p>
      </div>
      <div className="forecast">
        <h4>7-Day Forecast</h4>
        <div className="forecast-grid">
          {[1, 2, 3, 4, 5, 6, 7].map((day) => (
            <div key={day} className="forecast-day">
              <span className="day">Day {day}</span>
              <span className="temp">72°F</span>
              <span className="condition">Sunny</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const BloomProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="bloom-progress">
    <div className="progress-header">
      <Flower className="w-4 h-4" />
      <span>Bloom Progress: {percentage}%</span>
    </div>
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const FlowerGallery: React.FC<{ flowers?: any[] }> = ({ flowers = [] }) => (
  <div className="flower-gallery">
    {flowers.length > 0 ? (
      <div className="flowers-grid">
        {flowers.map((flower, index) => (
          <div key={index} className="flower-item">
            <img src={flower.image} alt={flower.name} />
            <span>{flower.name}</span>
          </div>
        ))}
      </div>
    ) : (
      <p>No flowers currently blooming</p>
    )}
  </div>
);

const FoliageProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="foliage-progress">
    <div className="progress-header">
      <Leaf className="w-4 h-4" />
      <span>Color Progress: {percentage}%</span>
    </div>
    <div className="progress-bar">
      <div 
        className="progress-fill" 
        style={{ width: `${percentage}%` }}
      />
    </div>
  </div>
);

const EventSchedule: React.FC<{ events?: any[] }> = ({ events = [] }) => (
  <div className="event-schedule">
    {events.length > 0 ? (
      <div className="events-list">
        {events.map((event, index) => (
          <div key={index} className="event-item">
            <div className="event-time">{event.time}</div>
            <div className="event-details">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No events scheduled</p>
    )}
  </div>
);

const SeasonalCalendar: React.FC<{ 
  startDate: Date; 
  endDate: Date; 
  peakDates?: Date[]; 
  selectedDate?: Date | null; 
  onDateSelect: (date: Date) => void; 
}> = ({ startDate, endDate, peakDates = [], selectedDate, onDateSelect }) => (
  <div className="seasonal-calendar">
    <div className="calendar-header">
      <h3>Seasonal Calendar</h3>
      <p>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</p>
    </div>
    <div className="calendar-grid">
      {/* Simplified calendar grid */}
      {Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const isPeak = peakDates.some(peak => 
          peak.toDateString() === date.toDateString()
        );
        const isSelected = selectedDate?.toDateString() === date.toDateString();
        
        return (
          <button
            key={i}
            className={`calendar-day ${isPeak ? 'peak' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={() => onDateSelect(date)}
          >
            {date.getDate()}
            {isPeak && <Star className="w-3 h-3" />}
          </button>
        );
      })}
    </div>
  </div>
);

const DailyForecast: React.FC<{ date: Date; destination: any }> = ({ date, destination }) => (
  <div className="daily-forecast">
    <h4>Forecast for {date.toLocaleDateString()}</h4>
    <div className="forecast-details">
      <div className="weather">
        <Sun className="w-5 h-5" />
        <span>72°F, Sunny</span>
      </div>
      <div className="recommendation">
        <p>Perfect conditions for visiting!</p>
      </div>
    </div>
  </div>
);

const SeasonalRecommendations: React.FC<{ 
  currentId: string; 
  subcategory?: string; 
  season?: string; 
}> = ({ currentId, subcategory, season }) => (
  <div className="seasonal-recommendations">
    <div className="recommendations-grid">
      {[1, 2, 3].map((i) => (
        <div key={i} className="recommendation-card">
          <div className="card-image">
            <img src={`/assets/seasonal-${i}.jpg`} alt="Seasonal destination" />
          </div>
          <div className="card-content">
            <h4>Seasonal Spot #{i}</h4>
            <p>Another great {season} destination</p>
            <span className="distance">{Math.floor(Math.random() * 30) + 10} miles away</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SeasonalEventsTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory 
}) => {
  const colors = getTemplateColors('seasonal-events');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const isActiveSeason = destination.is_currently_active || false;
  const startDate = new Date(destination.season_start || Date.now());
  const endDate = new Date(destination.season_end || Date.now() + 30 * 24 * 60 * 60 * 1000);
  const isWildflowers = subcategory?.includes('wildflower') || false;
  const isFallColors = subcategory?.includes('fall') || false;
  const isHoliday = subcategory?.includes('holiday') || false;
  const isLimitedTimeEvent = subcategory?.includes('limited-time') || false;
  
  const today = new Date();
  const isUpcoming = today < startDate;
  const isPast = today > endDate;
  const daysRemaining = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="seasonal-events-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Dynamic seasonal header - changes based on season */}
      <section className={`seasonal-hero ${subcategory}`}>
        <div className="hero-image">
          <img 
            src={destination.image_url ? `/api/photo-proxy?url=${encodeURIComponent(destination.image_url)}` : '/assets/default-seasonal.jpg'} 
            alt={destination.name}
            className="hero-bg"
          />
          <div className="hero-overlay">
            <div className="season-status-container">
              {isActiveSeason ? (
                <div className="active-now-badge">HAPPENING NOW</div>
              ) : isUpcoming ? (
                <div className="upcoming-badge">COMING SOON</div>
              ) : (
                <div className="past-badge">RETURNS NEXT SEASON</div>
              )}
            </div>
            
            <div className="hero-content">
              <h1>{destination.name}</h1>
              <p className="seasonal-dates">
                {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              
              {isActiveSeason && (
                <div className="days-remaining">
                  <span>{daysRemaining}</span> days remaining
                </div>
              )}
              
              <div className="hero-stats">
                <span className="drive-time">{destination.driveTime} min from SLC</span>
                <span className="season-type">
                  {isWildflowers ? <Flower className="w-4 h-4" /> : 
                   isFallColors ? <Leaf className="w-4 h-4" /> : 
                   <Calendar className="w-4 h-4" />}
                  {subcategory || 'Seasonal Event'}
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
      
      {/* Seasonal alerts - weather impacts, peak timing */}
      {isActiveSeason && (
        <section className="seasonal-alert-container">
          <SeasonalAlert 
            type={subcategory || 'event'}
            status={destination.current_status}
            peakPercentage={destination.peak_percentage}
          />
        </section>
      )}
      
      {/* Countdown timer for upcoming events */}
      {isUpcoming && (
        <section className="countdown-container">
          <h2>Countdown to {destination.name}</h2>
          <CountdownTimer targetDate={startDate} />
          <div className="reminder-action">
            <button className="remind-me-btn">
              <Calendar className="w-4 h-4" /> Set Reminder
            </button>
          </div>
        </section>
      )}
      
      {/* Seasonal description and details */}
      <section className="seasonal-details">
        <h2>{isWildflowers ? 'Bloom Details' : isFallColors ? 'Color Status' : 'Event Details'}</h2>
        <div className="seasonal-description">
          <p>{destination.seasonal_description || destination.description}</p>
        </div>
        
        {/* Type-specific seasonal information */}
        {isWildflowers && (
          <div className="bloom-status">
            <h3>Current Bloom Status</h3>
            <BloomProgressBar percentage={destination.bloom_percentage || 0} />
            <div className="flower-varieties">
              <h4>What's Blooming Now</h4>
              <FlowerGallery flowers={destination.current_blooms} />
            </div>
          </div>
        )}
        
        {isFallColors && (
          <div className="foliage-status">
            <h3>Fall Color Status</h3>
            <FoliageProgressBar percentage={destination.color_percentage || 0} />
            <div className="color-forecast">
              <h4>Peak Color Forecast</h4>
              <p>{destination.peak_color_forecast || 'Peak colors expected in mid-October'}</p>
            </div>
          </div>
        )}
        
        {isHoliday && (
          <div className="holiday-details">
            <h3>Holiday Information</h3>
            <div className="holiday-schedule">
              <h4>Schedule</h4>
              <EventSchedule events={destination.holiday_schedule} />
            </div>
            <div className="admission-info">
              <h4>Admission</h4>
              <p>{destination.admission_details || 'Free admission'}</p>
            </div>
          </div>
        )}
      </section>
      
      {/* Weather impact on this seasonal destination */}
      <section className="weather-impact">
        <h2>Weather Impact</h2>
        <WeatherImpact 
          weatherData={destination.weather_impact}
          seasonType={subcategory || 'event'}
          weatherForecast={destination.weather_forecast}
        />
      </section>
      
      {/* Date picker for planning */}
      <section className="visit-planner">
        <h2>Plan Your Visit</h2>
        <div className="calendar-container">
          <SeasonalCalendar
            startDate={startDate}
            endDate={endDate}
            peakDates={destination.peak_dates?.map(d => new Date(d)).filter(d => !isNaN(d.getTime()))}
            selectedDate={selectedDate}
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>
        
        {selectedDate && (
          <div className="selected-date-details">
            <h3>Your Selected Date: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <DailyForecast date={selectedDate} destination={destination} />
          </div>
        )}
      </section>
      
      {/* Similar seasonal events */}
      <section className="similar-seasonal">
        <h2>Similar Seasonal {isWildflowers ? 'Wildflower Displays' : isFallColors ? 'Fall Colors' : 'Events'}</h2>
        <div className="seasonal-recommendations">
          <SeasonalRecommendations
            currentId={String(destination.id)}
            subcategory={subcategory}
            season={destination.season}
          />
        </div>
      </section>
      
      {/* TripKit promotion */}
      <section className="tripkit-promo">
        <div className="tripkit-promotion">
          <div className="promo-content">
            <h3>{isWildflowers ? "Complete Wildflower Guide" : 
                 isFallColors ? "Utah Fall Colors TripKit" : 
                 isHoliday ? "Holiday Magic TripKit" : "Seasonal Utah TripKit"}</h3>
            <div className="price">$14.99</div>
            <ul className="features">
              <li>Complete seasonal calendar</li>
              <li>Peak timing predictions</li>
              <li>Photography tips for seasonal conditions</li>
              <li>Hidden seasonal gems most visitors miss</li>
            </ul>
            <button className="buy-now-btn">
              <Calendar className="w-4 h-4" />
              Get Seasonal Guide
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SeasonalEventsTemplate; 