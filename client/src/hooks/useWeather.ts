import { useState, useEffect } from 'react';

interface ForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon?: string;
}

export interface WeatherData {
  temperature?: number;
  temp?: number; // Alias for temperature
  condition: string;
  description?: string; // More detailed description
  humidity?: number;
  windSpeed?: number;
  lastUpdated?: string;
  source?: string;
  forecast?: ForecastDay[];
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather/slc-airport');
        if (!response.ok) {
          throw new Error(`Weather API error: ${response.status}`);
        }
        const data = await response.json();
        setWeather(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 15 minutes
    const interval = setInterval(fetchWeather, 15 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
};