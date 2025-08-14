import { useWeatherContext } from './useWeatherContext';
import { useMemo } from 'react';
import { getWeatherInfo, getWeatherGradient, getUVIndexLevel, formatVisibility, getWindDirection } from '../utils/weatherCodeMapping';

/**
 * Custom hook for accessing weather data with computed properties
 */
export const useWeather = () => {
  const {
    weatherData,
    loading,
    error,
    refreshWeather,
    lastUpdated,
    units
  } = useWeatherContext();

  // Computed properties for current weather
  const currentWeather = useMemo(() => {
    if (!weatherData?.current) return null;
    
    const current = weatherData.current;
    const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);
    
    return {
      ...current,
      description: weatherInfo.description,
      icon: weatherInfo.icon,
      gradient: getWeatherGradient(current.weatherCode, current.isDay),
      uvLevel: getUVIndexLevel(current.uvIndex),
      formattedVisibility: formatVisibility(current.visibility),
      windDirection: getWindDirection(current.windDirection),
      location: weatherData.location
    };
  }, [weatherData]);

  // Computed properties for hourly forecast
  const hourlyForecast = useMemo(() => {
    if (!weatherData?.hourly) return [];
    
    return weatherData.hourly.map(hour => {
      const weatherInfo = getWeatherInfo(hour.weatherCode, hour.isDay);
      
      return {
        ...hour,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        formattedTime: new Date(hour.time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          hour12: true
        })
      };
    });
  }, [weatherData]);

  // Computed properties for daily forecast
  const dailyForecast = useMemo(() => {
    if (!weatherData?.daily) return [];
    
    return weatherData.daily.map(day => {
      const weatherInfo = getWeatherInfo(day.weatherCode, true);
      const date = new Date(day.date);
      
      return {
        ...day,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        formattedDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        sunriseTime: new Date(day.sunrise).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        sunsetTime: new Date(day.sunset).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
      };
    });
  }, [weatherData]);

  // Check if data is stale (more than 10 minutes old)
  const isDataStale = useMemo(() => {
    if (!lastUpdated) return true;
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    return diff > 10 * 60 * 1000; // 10 minutes
  }, [lastUpdated]);

  // Format last updated time
  const formattedLastUpdated = useMemo(() => {
    if (!lastUpdated) return null;
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return lastUpdated.toLocaleString();
  }, [lastUpdated]);

  return {
    // Raw data
    weatherData,
    
    // Computed data
    currentWeather,
    hourlyForecast,
    dailyForecast,
    
    // State
    loading,
    error,
    isDataStale,
    
    // Metadata
    lastUpdated,
    formattedLastUpdated,
    timezone: weatherData?.timezone,
    units,
    
    // Actions
    refreshWeather
  };
};

/**
 * Hook for accessing just the current weather
 */
export const useCurrentWeather = () => {
  const { currentWeather, loading, error } = useWeather();
  return { currentWeather, loading, error };
};

/**
 * Hook for accessing just the hourly forecast
 */
export const useHourlyForecast = () => {
  const { hourlyForecast, loading, error } = useWeather();
  return { hourlyForecast, loading, error };
};

/**
 * Hook for accessing just the daily forecast
 */
export const useDailyForecast = () => {
  const { dailyForecast, loading, error } = useWeather();
  return { dailyForecast, loading, error };
};