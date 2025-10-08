/**
 * GET /api/weather?lat={lat}&lon={lon}
 * Get current weather conditions for a destination
 * Uses OpenWeather API
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon parameters required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.warn('OPENWEATHER_API_KEY not configured');
      return res.status(503).json({
        error: 'Weather service unavailable',
        message: 'API key not configured'
      });
    }

    // Fetch current weather from OpenWeather
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
    );

    if (!weatherResponse.ok) {
      throw new Error(`OpenWeather API error: ${weatherResponse.status}`);
    }

    const weatherData = await weatherResponse.json();

    // Transform to simplified format
    const weather = {
      temp: Math.round(weatherData.main.temp),
      feels_like: Math.round(weatherData.main.feels_like),
      temp_min: Math.round(weatherData.main.temp_min),
      temp_max: Math.round(weatherData.main.temp_max),
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      description: weatherData.weather[0]?.description || 'Unknown',
      main: weatherData.weather[0]?.main || 'Unknown',
      icon: weatherData.weather[0]?.icon || '01d',
      wind_speed: Math.round(weatherData.wind?.speed || 0),
      wind_deg: weatherData.wind?.deg || 0,
      clouds: weatherData.clouds?.all || 0,
      visibility: weatherData.visibility ? Math.round(weatherData.visibility / 1609.34) : null, // Convert meters to miles
      sunrise: weatherData.sys?.sunrise || null,
      sunset: weatherData.sys?.sunset || null,
      city_name: weatherData.name || 'Unknown',
      timestamp: Date.now(),
    };

    // Add cache control header (cache for 10 minutes)
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=300');

    res.status(200).json(weather);

  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      error: 'Failed to fetch weather',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
