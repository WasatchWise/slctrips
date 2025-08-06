import { useState, useEffect } from "react";
import { SiInstagram, SiFacebook, SiTiktok } from "react-icons/si";
// Use public asset for airport logo
const airportLogo = "/images/slc-airport-logo.png";

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon?: string;
}

interface WeatherData {
  temp: number;
  condition: string;
  forecast?: ForecastDay[];
}

export function Footer() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather/slc-airport');
        if (!response.ok) throw new Error("Weather fetch failed");

        const data = await response.json();
        if (!data || !data.temperature || isNaN(data.temperature)) {
          throw new Error("Invalid weather data");
        }

        setWeather({
          temp: data.temperature,
          condition: data.condition || "Clear",
          forecast: data.forecast || []
        });
        setWeatherError(false);
      } catch (_error) {
        // console.error("Weather Error:", error);
        setWeatherError(true);
      }
    };

    fetchWeather();
  }, []);

  // Close forecast when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showForecast && !(event.target as Element).closest('.weather-widget')) {
        setShowForecast(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showForecast]);

  return (
    <footer className="bg-slate-900 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          {/* Airport Logo */}
          <div className="flex items-center h-full">
            <img 
              src={airportLogo} 
              alt="SLC Airport" 
              className="h-full w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.open('https://www.slcairport.com/', '_blank')}
            />
          </div>
          
          {/* Center Section with Copyright and Social Icons */}
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">© 2025 SLCTrips.com - From Salt Lake to Everywhere</p>
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://instagram.com/slctrips" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <SiInstagram size={20} />
              </a>
              <a 
                href="https://facebook.com/slctrips" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <SiFacebook size={20} />
              </a>
              <a 
                href="https://tiktok.com/@slctrips" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on TikTok"
              >
                <SiTiktok size={20} />
              </a>
            </div>
          </div>
          
          {/* Enhanced Weather Widget */}
          <div className="relative weather-widget">
            <div 
              className="text-right cursor-pointer"
              onClick={() => setShowForecast(!showForecast)}
            >
              <a 
                href="https://weather.com/weather/today/l/Salt+Lake+City+UT" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors text-sm"
                onClick={(e) => e.stopPropagation()}
              >
                {weatherError ? (
                  "Weather unavailable"
                ) : weather && weather.temp !== undefined ? (
                  `${Math.round(weather.temp)}°F Salt Lake City`
                ) : (
                  "Loading weather..."
                )}
              </a>
              {weather?.forecast && weather.forecast.length > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  Click for 3-day forecast
                </div>
              )}
            </div>
            
            {/* 3-Day Forecast Dropdown */}
            {showForecast && weather?.forecast && weather.forecast.length > 0 && (
              <div className="absolute right-0 bottom-full mb-2 bg-gradient-to-br from-slate-800 to-slate-900 border border-utah-gold/20 rounded-lg p-4 shadow-2xl z-50 min-w-[320px]">
                <div className="text-utah-gold text-sm font-bold mb-4 text-center">3-Day Forecast</div>
                <div className="grid grid-cols-3 gap-3">
                  {weather.forecast.map((day, index) => (
                    <div 
                      key={index} 
                      className="bg-gradient-to-b from-slc-navy/80 to-slc-navy rounded-lg p-3 text-center border border-utah-gold/10 hover:border-utah-gold/30 transition-colors"
                    >
                      <div className="text-utah-gold text-xs font-medium mb-1">{day.day}</div>
                      <div className="text-white text-lg font-bold mb-1">{day.high}°</div>
                      <div className="text-utah-gold/70 text-xs mb-2">{day.low}°</div>
                      <div className="text-slate-300 text-xs capitalize leading-tight">
                        {day.condition}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-utah-gold/60 mt-3 text-center">
                  Click outside to close
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}