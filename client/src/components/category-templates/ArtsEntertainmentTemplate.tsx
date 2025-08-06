import React from 'react';
import { getTemplateColors } from '../../utils/destination-template-detector';

// Placeholder components - these would need to be created
const VenueHeroVisual: React.FC<{ venue: any }> = ({ venue }) => (
  <div className="venue-hero-visual">
    <img 
                  src={venue.image_url ? `/api/photo-proxy?url=${encodeURIComponent(venue.image_url)}` : '/assets/default-venue.jpg'} 
      alt={venue.name}
      className="venue-hero-image"
    />
    <div className="venue-hero-overlay">
      <div className="venue-type-badge">{venue.venue_type || 'Entertainment Venue'}</div>
    </div>
  </div>
);

const EventSchedule: React.FC<{ events?: any[] }> = ({ events = [] }) => (
  <section className="event-schedule">
    <h2>Upcoming Events</h2>
    {events.length > 0 ? (
      <div className="events-grid">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <h3>{event.title}</h3>
            <p className="event-date">{event.date}</p>
            <p className="event-time">{event.time}</p>
            {event.ticket_price && (
              <p className="event-price">From ${event.ticket_price}</p>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p className="no-events">No upcoming events scheduled</p>
    )}
  </section>
);

const VenueMap: React.FC<{ venue: any; isInteractive?: boolean }> = ({ venue, isInteractive = true }) => (
  <section className="venue-map">
    <h2>Location</h2>
    <div className="map-container">
      <div className="map-placeholder">
        <p>Interactive map for {venue.name}</p>
        <p>Address: {venue.address || 'Address not available'}</p>
        {venue.coordinates && (
          <p>Coordinates: {venue.coordinates.lat}, {venue.coordinates.lng}</p>
        )}
      </div>
    </div>
  </section>
);

const TicketInfo: React.FC<{ venue: any }> = ({ venue }) => (
  <section className="ticket-info">
    <h2>Tickets & Reservations</h2>
    <div className="ticket-options">
      <div className="ticket-card">
        <h3>General Admission</h3>
        <p className="price">${venue.ticket_price || 'Varies'}</p>
        <button className="btn-primary">Book Now</button>
      </div>
      {venue.vip_available && (
        <div className="ticket-card vip">
          <h3>VIP Experience</h3>
          <p className="price">${venue.vip_price || 'Contact for pricing'}</p>
          <button className="btn-secondary">Inquire</button>
        </div>
      )}
    </div>
  </section>
);

const EveningAddOns: React.FC<{ nearby?: any[] }> = ({ nearby = [] }) => (
  <section className="evening-addons">
    <h2>Perfect Evening Add-Ons</h2>
    <div className="addons-grid">
      <div className="addon-card">
        <h3>Pre-Show Dining</h3>
        <p>Great restaurants within walking distance</p>
        <ul>
          {nearby.filter(place => place.category === 'restaurant').slice(0, 3).map((place, index) => (
            <li key={index}>{place.name} - {place.distance} min walk</li>
          ))}
        </ul>
      </div>
      <div className="addon-card">
        <h3>Post-Show Drinks</h3>
        <p>Local bars and lounges for after the show</p>
        <ul>
          {nearby.filter(place => place.category === 'bar').slice(0, 3).map((place, index) => (
            <li key={index}>{place.name} - {place.distance} min walk</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

const SocialShare: React.FC<{ contentType: string; venue: any }> = ({ contentType, venue }) => (
  <section className="social-share">
    <h2>Share Your Experience</h2>
    <div className="share-buttons">
      <button className="share-btn instagram">Share on Instagram</button>
      <button className="share-btn facebook">Share on Facebook</button>
      <button className="share-btn twitter">Share on Twitter</button>
    </div>
    <div className="hashtags">
      <p>Use these hashtags: #{venue.name.replace(/\s+/g, '')} #SLCTrips #ArtsAndEntertainment</p>
    </div>
  </section>
);

const ArtsEntertainmentTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory 
}) => {
  const colors = getTemplateColors('arts-entertainment');
  
  // Entertainment-specific features
  const isEvening = subcategory?.includes('evening') || 
                   subcategory?.includes('nightlife') || 
                   subcategory?.includes('live-music') || false;
  const hasTickets = destination.ticketing_available || false;
  const isVenue = subcategory?.includes('venue') || 
                 subcategory?.includes('theater') || 
                 subcategory?.includes('gallery') || false;
  
  return (
    <div className="arts-entertainment-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Hero section with performance imagery */}
      <section className="venue-hero">
        <VenueHeroVisual venue={destination} />
        <div className="hero-content">
          <h1>{destination.name}</h1>
          <p className="venue-tagline">{destination.description_short}</p>
          <div className="venue-stats">
            <span className="venue-type">{destination.venue_type || 'Entertainment Venue'}</span>
            <span className="drive-time">{destination.driveTime} min from SLC</span>
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
      
      {/* Event schedule with calendar integration */}
      <EventSchedule events={destination.upcoming_events} />
      
      {/* Interactive venue map */}
      <VenueMap venue={destination} isInteractive={true} />
      
      {/* Ticket integration */}
      {hasTickets && <TicketInfo venue={destination} />}
      
      {/* Evening-specific recommendations */}
      {isEvening && <EveningAddOns nearby={destination.nearby} />}
      
      {/* Cross-category recommendations */}
      <section className="cross-category-recommendations">
        <h2>Perfect Combinations</h2>
        <div className="recommendation-grid">
          <div className="combo-card">
            <span className="combo-type">Pre-Show Dining</span>
            <h3>Nearby Restaurants</h3>
            <p>Great places to eat before the show</p>
          </div>
          <div className="combo-card">
            <span className="combo-type">Post-Show Drinks</span>
            <h3>Local Bars</h3>
            <p>Continue the evening at these spots</p>
          </div>
          <div className="combo-card">
            <span className="combo-type">Cultural Day</span>
            <h3>Museums & Galleries</h3>
            <p>Make it a full cultural experience</p>
          </div>
        </div>
      </section>
      
      {/* Social sharing optimized for performances */}
      <SocialShare contentType="performance" venue={destination} />
    </div>
  );
};

export default ArtsEntertainmentTemplate; 