import React from 'react';
import { DestinationTemplateProps } from '@/types/destination-types';
import { getTemplateColors } from '../../utils/destination-template-detector';
import { Utensils, Clock, Users, MapPin, Phone, Calendar, Coffee, Wine, Beer, Leaf, Clock3, Star } from 'lucide-react';

// Placeholder components - these would need to be created
const FoodHero: React.FC<{ 
  images?: any; 
  cuisine?: string; 
}> = ({ images, cuisine }) => (
  <section className="food-hero">
    <div className="hero-image">
      <img 
        src={images?.hero || '/assets/default-restaurant.jpg'} 
        alt="Restaurant hero"
        className="hero-bg"
      />
      <div className="hero-overlay">
        <div className="cuisine-badge">{cuisine || 'Local Cuisine'}</div>
      </div>
    </div>
  </section>
);

const ReservationSystem: React.FC<{ 
  reservationUrl?: string; 
  averageWait?: number; 
  peakTimes?: string[]; 
}> = ({ reservationUrl, averageWait, peakTimes }) => (
  <section className="reservation-system">
    <h2>Reservations & Wait Times</h2>
    <div className="reservation-info">
      {reservationUrl ? (
        <div className="reservation-card">
          <h3>Make a Reservation</h3>
          <button className="btn-primary">
            <Calendar className="w-4 h-4" />
            Book Table
          </button>
        </div>
      ) : (
        <div className="walk-in-info">
          <h3>Walk-ins Welcome</h3>
          <p>No reservations required</p>
        </div>
      )}
      
      {averageWait && (
        <div className="wait-time">
          <Clock className="w-4 h-4" />
          <span>Average wait: {averageWait} minutes</span>
        </div>
      )}
      
      {peakTimes && peakTimes.length > 0 && (
        <div className="peak-times">
          <h4>Peak Times</h4>
          <ul>
            {peakTimes.map((time, index) => (
              <li key={index}>{time}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </section>
);

const MenuHighlights: React.FC<{ 
  menuItems?: any[]; 
  isBrewery?: boolean; 
  isEthnic?: boolean; 
}> = ({ menuItems = [], isBrewery, isEthnic }) => (
  <section className="menu-highlights">
    <h2>{isBrewery ? 'Beer Selection' : isEthnic ? 'Signature Dishes' : 'Menu Highlights'}</h2>
    <div className="menu-grid">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-item">
          <img 
            src={item.image || '/assets/default-dish.jpg'} 
            alt={item.name}
            className="dish-image"
          />
          <div className="dish-info">
            <h3>{item.name}</h3>
            <p className="description">{item.description}</p>
            <p className="price">${item.price}</p>
            {item.dietary && (
              <span className="dietary-badge">{item.dietary}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);

const DietaryBadges: React.FC<{ 
  restrictions?: string[]; 
  allergenInfo?: string; 
}> = ({ restrictions = [], allergenInfo }) => (
  <section className="dietary-badges">
    <h2>Dietary Options</h2>
    <div className="badges-grid">
      {restrictions.map((restriction, index) => (
        <span key={index} className="dietary-badge">
          {restriction}
        </span>
      ))}
    </div>
    {allergenInfo && (
      <div className="allergen-info">
        <h3>Allergen Information</h3>
        <p>{allergenInfo}</p>
      </div>
    )}
  </section>
);

const HappyHourTiming: React.FC<{ 
  timing?: any; 
  specials?: any[]; 
}> = ({ timing, specials = [] }) => (
  <section className="happy-hour">
    <h2>Happy Hour</h2>
    <div className="happy-hour-info">
      <div className="timing">
        <Clock3 className="w-4 h-4" />
        <span>{timing?.days} {timing?.hours}</span>
      </div>
      <div className="specials">
        {specials.map((special, index) => (
          <div key={index} className="special-item">
            <h4>{special.name}</h4>
            <p className="price">${special.price}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const BrewerySpecifics: React.FC<{ 
  beers?: any[]; 
  brewingProcess?: string; 
  tours?: any; 
}> = ({ beers = [], brewingProcess, tours }) => (
  <section className="brewery-specifics">
    <h2>Brewery Information</h2>
    <div className="brewery-content">
      {beers.length > 0 && (
        <div className="beer-list">
          <h3>Our Beers</h3>
          <div className="beers-grid">
            {beers.map((beer, index) => (
              <div key={index} className="beer-item">
                <h4>{beer.name}</h4>
                <p className="style">{beer.style}</p>
                <p className="abv">ABV: {beer.abv}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {brewingProcess && (
        <div className="brewing-process">
          <h3>Our Brewing Process</h3>
          <p>{brewingProcess}</p>
        </div>
      )}
      
      {tours && (
        <div className="brewery-tours">
          <h3>Brewery Tours</h3>
          <p>{tours.description}</p>
          <p className="tour-price">${tours.price} per person</p>
          <button className="btn-secondary">Book Tour</button>
        </div>
      )}
    </div>
  </section>
);

const FarmPartners: React.FC<{ 
  farms?: any[]; 
  seasonalMenu?: any[]; 
}> = ({ farms = [], seasonalMenu = [] }) => (
  <section className="farm-partners">
    <h2>Farm-to-Table Partners</h2>
    <div className="farm-content">
      {farms.length > 0 && (
        <div className="farms-list">
          <h3>Local Farm Partners</h3>
          <div className="farms-grid">
            {farms.map((farm, index) => (
              <div key={index} className="farm-item">
                <h4>{farm.name}</h4>
                <p>{farm.location}</p>
                <p className="products">{farm.products.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {seasonalMenu.length > 0 && (
        <div className="seasonal-menu">
          <h3>Seasonal Offerings</h3>
          <div className="seasonal-items">
            {seasonalMenu.map((item, index) => (
              <div key={index} className="seasonal-item">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <span className="season">{item.season}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

const ChefStory: React.FC<{ 
  ownerBio?: string; 
  restaurantHistory?: string; 
}> = ({ ownerBio, restaurantHistory }) => (
  <section className="chef-story">
    <h2>Our Story</h2>
    <div className="story-content">
      {ownerBio && (
        <div className="owner-bio">
          <h3>Meet the Chef/Owner</h3>
          <p>{ownerBio}</p>
        </div>
      )}
      
      {restaurantHistory && (
        <div className="restaurant-history">
          <h3>Restaurant History</h3>
          <p>{restaurantHistory}</p>
        </div>
      )}
    </div>
  </section>
);

const LateNightInfo: React.FC<{ 
  closingTime?: string; 
  lateMenu?: any[]; 
}> = ({ closingTime, lateMenu = [] }) => (
  <section className="late-night-info">
    <h2>Late Night Dining</h2>
    <div className="late-night-content">
      <div className="closing-time">
        <Clock className="w-4 h-4" />
        <span>Open until {closingTime}</span>
      </div>
      
      {lateMenu.length > 0 && (
        <div className="late-menu">
          <h3>Late Night Menu</h3>
          <div className="late-menu-items">
            {lateMenu.map((item, index) => (
              <div key={index} className="late-menu-item">
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p className="price">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);

const FoodDrinkTemplate: React.FC<DestinationTemplateProps> = ({ 
  destination, 
  subcategory 
}) => {
  const colors = getTemplateColors('food-drink');
  
  // New subcategory-specific features
  const isBrewery = subcategory?.includes('brewery') || 
                   subcategory?.includes('craft-breweries') || 
                   subcategory?.includes('local-distilleries') || false;
  const isFarmToTable = subcategory?.includes('farm') || 
                       subcategory?.includes('farm-to-table') || 
                       subcategory?.includes('fine-dining') || false;
  const isEthnic = subcategory?.includes('ethnic') || 
                  subcategory?.includes('ethnic-international') || false;
  const isCoffee = subcategory?.includes('coffee') || 
                  subcategory?.includes('coffee-roasters') || false;
  const isLateNight = subcategory?.includes('late-night') || 
                     subcategory?.includes('late-night-eats') || false;
  const isWineBar = subcategory?.includes('wine') || 
                   subcategory?.includes('wine-bars') || false;
  
  return (
    <div className="food-drink-template" style={{ '--primary-color': colors.primary } as React.CSSProperties}>
      {/* Hero with food imagery */}
      <FoodHero images={destination.images} cuisine={destination.cuisine_type} />
      
      {/* Hero content */}
      <section className="hero-content">
        <h1>{destination.name}</h1>
        <p className="cuisine-type">{destination.cuisine_type || 'Local Cuisine'}</p>
        <div className="hero-stats">
          <span className="drive-time">{destination.driveTime} min from SLC</span>
          <span className="rating">
            <Star className="w-4 h-4" />
            {destination.rating || '4.5'}
          </span>
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
      
      {/* Reservation integration */}
      <ReservationSystem 
        reservationUrl={destination.reservation_url}
        averageWait={destination.average_wait}
        peakTimes={destination.peak_times}
      />
      
      {/* Menu highlights - subcategory specific */}
      <MenuHighlights 
        menuItems={destination.featured_items}
        isBrewery={isBrewery}
        isEthnic={isEthnic}
      />
      
      {/* Dietary restrictions */}
      <DietaryBadges 
        restrictions={destination.dietary_options}
        allergenInfo={destination.allergen_info}
      />
      
      {/* Happy hour timing */}
      {destination.happy_hour && (
        <HappyHourTiming 
          timing={destination.happy_hour}
          specials={destination.happy_hour_specials}
        />
      )}
      
      {/* Brewery-specific components */}
      {isBrewery && (
        <BrewerySpecifics
          beers={destination.beer_list}
          brewingProcess={destination.brewing_process}
          tours={destination.brewery_tours}
        />
      )}
      
      {/* Farm-to-table specifics */}
      {isFarmToTable && (
        <FarmPartners
          farms={destination.farm_partners}
          seasonalMenu={destination.seasonal_offerings}
        />
      )}
      
      {/* Chef/owner story */}
      <ChefStory 
        ownerBio={destination.owner_bio}
        restaurantHistory={destination.history}
      />
      
      {/* Late-night specific */}
      {isLateNight && (
        <LateNightInfo
          closingTime={typeof destination.hours === 'object' && destination.hours !== null ? (destination.hours as any).closing : undefined}
          lateMenu={destination.late_night_menu === true ? [] : undefined}
        />
      )}
      
      {/* Cross-category recommendations */}
      <section className="cross-category-recommendations">
        <h2>Perfect Combinations</h2>
        <div className="recommendation-grid">
          <div className="combo-card">
            <span className="combo-type">Pre-Dinner Activity</span>
            <h3>Nearby Attractions</h3>
            <p>Explore before your meal</p>
          </div>
          <div className="combo-card">
            <span className="combo-type">Post-Dinner Drinks</span>
            <h3>Local Bars</h3>
            <p>Continue the evening</p>
          </div>
          <div className="combo-card">
            <span className="combo-type">Date Night</span>
            <h3>Entertainment Venues</h3>
            <p>Complete your evening</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FoodDrinkTemplate;