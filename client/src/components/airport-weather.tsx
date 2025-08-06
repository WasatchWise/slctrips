import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow } from "lucide-react";

interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  visibility: number;
  windSpeed: number;
  icon: string;
}

interface AirportWeatherProps {
  mobileView?: boolean;
}

export function AirportWeather({ mobileView = false }: AirportWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWeather();
    // Update every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchWeather = async () => {
    try {
      const response = await fetch('/api/weather/slc-airport');
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
        setError(false);
      } else {
        setError(true);
      }
    } catch (_err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('clear') || lower.includes('sun')) return <Sun className="w-4 h-4 text-yellow-500" />;
    if (lower.includes('rain') || lower.includes('drizzle')) return <CloudRain className="w-4 h-4 text-blue-500" />;
    if (lower.includes('snow') || lower.includes('sleet')) return <CloudSnow className="w-4 h-4 text-blue-300" />;
    if (lower.includes('cloud')) return <Cloud className="w-4 h-4 text-gray-500" />;
    return <Cloud className="w-4 h-4 text-gray-500" />;
  };

  if (mobileView) {
    if (loading) {
      return (
        <a 
          href="https://weather.com/weather/today/l/Salt+Lake+City+UT+USUT0225:1:US"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-3 py-2 rounded-md text-base font-medium text-white bg-transparent hover:bg-slate-500 transition-colors"
        >
          Weather (Loading...)
        </a>
      );
    }

    if (error || !weather) {
      return (
        <a 
          href="https://weather.com/weather/today/l/Salt+Lake+City+UT+USUT0225:1:US"
          target="_blank"
          rel="noopener noreferrer"
          className="block px-3 py-2 rounded-md text-base font-medium text-white bg-transparent hover:bg-slate-500 transition-colors"
        >
          Weather (Unavailable)
        </a>
      );
    }

    return (
      <a 
        href="https://weather.com/weather/today/l/Salt+Lake+City+UT+USUT0225:1:US"
        target="_blank"
        rel="noopener noreferrer"
        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-transparent hover:bg-slate-500 transition-colors"
      >
        Weather ({weather.temperature ? Math.round(weather.temperature) : weather.temp ? Math.round(weather.temp) : '--'}°F, {weather.condition})
      </a>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-yellow-500">
        <div className="w-4 h-4 bg-white/30 rounded animate-pulse"></div>
        <div className="text-xs text-white">Loading...</div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-yellow-500">
        <Cloud className="w-4 h-4 text-white/70" />
        <div className="text-xs text-white/70">Weather unavailable</div>
      </div>
    );
  }

  return (
    <a 
      href="https://weather.com/weather/today/l/Salt+Lake+City+UT+USUT0225:1:US"
      target="_blank"
      rel="noopener noreferrer"
      className="h-12 flex items-center space-x-2 px-3 py-2 bg-slate-800/80 backdrop-blur-sm rounded-lg border-2 border-white hover:bg-slate-700/80 transition-colors cursor-pointer"
    >
      <div className="w-4 h-4">
        {getWeatherIcon(weather.condition)}
      </div>
      <div className="text-left">
        <div className="text-xs font-semibold text-white">
          {weather.temperature ? Math.round(weather.temperature) : weather.temp ? Math.round(weather.temp) : '--'}°F
        </div>
        <div className="text-[10px] text-white/80 capitalize">
          {weather.description}
        </div>
      </div>
    </a>
  );
}