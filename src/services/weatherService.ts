import { fetchWeatherApi } from 'openmeteo';
import { 
  WEATHER_API_BASE_URL, 
  WEATHER_PARAMS, 
  CACHE_DURATION,
  TEMPERATURE_UNITS,
  WIND_SPEED_UNITS,
  PRECIPITATION_UNITS
} from '../config/constants';
import type { Location } from './locationService';
import type { WeatherData, WeatherHourly, WeatherDaily } from '../types/weather.types';

interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
  location: {
    latitude: number;
    longitude: number;
  };
}

class WeatherService {
  private static instance: WeatherService;
  private cache: Map<string, CachedWeatherData> = new Map();

  private constructor() {}

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Generate cache key for location
   */
  private getCacheKey(latitude: number, longitude: number): string {
    return `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(cached: CachedWeatherData): boolean {
    return Date.now() - cached.timestamp < CACHE_DURATION;
  }

  /**
   * Fetch weather data for a location
   */
  async getWeather(
    location: Location,
    units: {
      temperature: 'celsius' | 'fahrenheit';
      windSpeed: 'kmh' | 'ms' | 'mph' | 'kn';
      precipitation: 'mm' | 'inch';
    } = {
      temperature: TEMPERATURE_UNITS.FAHRENHEIT,
      windSpeed: WIND_SPEED_UNITS.MPH,
      precipitation: PRECIPITATION_UNITS.INCH
    }
  ): Promise<WeatherData> {
    const cacheKey = this.getCacheKey(location.latitude, location.longitude);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      console.log('Returning cached weather data');
      return cached.data;
    }

    // Check localStorage cache
    const storedCache = this.getStoredCache(cacheKey);
    if (storedCache && this.isCacheValid(storedCache)) {
      console.log('Returning stored cache weather data');
      this.cache.set(cacheKey, storedCache);
      return storedCache.data;
    }

    try {
      // Prepare API parameters
      const params = {
        latitude: location.latitude,
        longitude: location.longitude,
        current: WEATHER_PARAMS.current.join(','),
        hourly: WEATHER_PARAMS.hourly.join(','),
        daily: WEATHER_PARAMS.daily.join(','),
        temperature_unit: units.temperature,
        wind_speed_unit: units.windSpeed,
        precipitation_unit: units.precipitation,
        timezone: 'auto',
        forecast_days: 7
      };

      console.log('Fetching weather data from API...');
      const responses = await fetchWeatherApi(WEATHER_API_BASE_URL + '/forecast', params);
      
      if (!responses || responses.length === 0) {
        throw new Error('No weather data received');
      }

      const response = responses[0];
      const weatherData = this.parseWeatherData(response, location);

      // Cache the data
      const cacheData: CachedWeatherData = {
        data: weatherData,
        timestamp: Date.now(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude
        }
      };

      this.cache.set(cacheKey, cacheData);
      this.storeCache(cacheKey, cacheData);

      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      
      // Try to return stale cache if available
      const staleCache = this.cache.get(cacheKey) || this.getStoredCache(cacheKey);
      if (staleCache) {
        console.warn('Returning stale cache due to error');
        return staleCache.data;
      }
      
      throw new Error('Failed to fetch weather data. Please check your connection and try again.');
    }
  }

  /**
   * Parse API response into our data structure
   */
  private parseWeatherData(response: any, location: Location): WeatherData {
    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    // Parse current weather
    const currentWeather = {
      time: new Date(Number(current.time()) * 1000).toISOString(),
      temperature: Math.round(current.variables(0)?.value() ?? 0),
      apparentTemperature: Math.round(current.variables(1)?.value() ?? 0),
      isDay: Boolean(current.variables(2)?.value()),
      weatherCode: current.variables(3)?.value() ?? 0,
      windSpeed: Math.round(current.variables(4)?.value() ?? 0),
      windDirection: Math.round(current.variables(5)?.value() ?? 0),
      humidity: Math.round(current.variables(6)?.value() ?? 0),
      pressure: Math.round(current.variables(7)?.value() ?? 0),
      uvIndex: current.variables(8)?.value() ?? 0,
      visibility: Math.round((current.variables(9)?.value() ?? 0) / 1000), // Convert to km
      precipitation: current.variables(10)?.value() ?? 0
    };

    // Parse hourly forecast (next 24 hours)
    const hourlyData: WeatherHourly[] = [];
    const hourlyTimes = Array.from({ length: hourly.time().length }, (_, i) => 
      Number(hourly.time()[i])
    );
    
    for (let i = 0; i < Math.min(24, hourlyTimes.length); i++) {
      hourlyData.push({
        time: new Date(hourlyTimes[i] * 1000).toISOString(),
        temperature: Math.round(hourly.variables(0)?.valuesArray()?.[i] ?? 0),
        weatherCode: hourly.variables(1)?.valuesArray()?.[i] ?? 0,
        precipitationProbability: hourly.variables(2)?.valuesArray()?.[i] ?? 0,
        precipitation: hourly.variables(3)?.valuesArray()?.[i] ?? 0,
        isDay: Boolean(hourly.variables(4)?.valuesArray()?.[i])
      });
    }

    // Parse daily forecast
    const dailyData: WeatherDaily[] = [];
    const dailyTimes = Array.from({ length: daily.time().length }, (_, i) => 
      Number(daily.time()[i])
    );
    
    for (let i = 0; i < dailyTimes.length; i++) {
      dailyData.push({
        date: new Date(dailyTimes[i] * 1000).toISOString(),
        weatherCode: daily.variables(0)?.valuesArray()?.[i] ?? 0,
        temperatureMax: Math.round(daily.variables(1)?.valuesArray()?.[i] ?? 0),
        temperatureMin: Math.round(daily.variables(2)?.valuesArray()?.[i] ?? 0),
        precipitationProbability: daily.variables(3)?.valuesArray()?.[i] ?? 0,
        precipitationSum: daily.variables(4)?.valuesArray()?.[i] ?? 0,
        sunrise: new Date((daily.variables(5)?.valuesArray()?.[i] ?? 0) * 1000).toISOString(),
        sunset: new Date((daily.variables(6)?.valuesArray()?.[i] ?? 0) * 1000).toISOString(),
        uvIndexMax: daily.variables(7)?.valuesArray()?.[i] ?? 0
      });
    }

    return {
      current: currentWeather,
      hourly: hourlyData,
      daily: dailyData,
      timezone: response.timezone() || 'UTC',
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        country: location.country
      }
    };
  }

  /**
   * Store cache in localStorage
   */
  private storeCache(key: string, data: CachedWeatherData): void {
    try {
      const stored = localStorage.getItem('weatherCache');
      const cache = stored ? JSON.parse(stored) : {};
      cache[key] = data;
      
      // Limit cache size
      const keys = Object.keys(cache);
      if (keys.length > 10) {
        // Remove oldest entries
        keys.sort((a, b) => cache[a].timestamp - cache[b].timestamp);
        for (let i = 0; i < keys.length - 10; i++) {
          delete cache[keys[i]];
        }
      }
      
      localStorage.setItem('weatherCache', JSON.stringify(cache));
    } catch (error) {
      console.error('Failed to store cache:', error);
    }
  }

  /**
   * Get cache from localStorage
   */
  private getStoredCache(key: string): CachedWeatherData | null {
    try {
      const stored = localStorage.getItem('weatherCache');
      if (!stored) return null;
      
      const cache = JSON.parse(stored);
      return cache[key] || null;
    } catch (error) {
      console.error('Failed to get stored cache:', error);
      return null;
    }
  }

  /**
   * Clear all weather cache
   */
  clearCache(): void {
    this.cache.clear();
    try {
      localStorage.removeItem('weatherCache');
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Prefetch weather for multiple locations
   */
  async prefetchWeather(locations: Location[]): Promise<void> {
    const promises = locations.map(location => 
      this.getWeather(location).catch(error => {
        console.error(`Failed to prefetch weather for ${location.name}:`, error);
      })
    );
    
    await Promise.all(promises);
  }
}

export default WeatherService.getInstance();