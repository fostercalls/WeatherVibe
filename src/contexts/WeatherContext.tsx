import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import type { WeatherData } from '../types/weather.types';
import type { Location } from '../services/locationService';
import weatherService from '../services/weatherService';
import locationService from '../services/locationService';
import { AUTO_REFRESH_INTERVAL } from '../config/constants';

interface WeatherContextType {
  // Weather data
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  
  // Location data
  currentLocation: Location | null;
  locationLoading: boolean;
  locationError: string | null;
  
  // Actions
  refreshWeather: () => Promise<void>;
  setLocation: (location: Location) => Promise<void>;
  getCurrentLocation: () => Promise<void>;
  searchLocations: (query: string) => Promise<Location[]>;
  clearError: () => void;
  
  // Settings
  units: {
    temperature: 'celsius' | 'fahrenheit';
    windSpeed: 'kmh' | 'ms' | 'mph' | 'kn';
    precipitation: 'mm' | 'inch';
  };
  setUnits: (units: Partial<WeatherContextType['units']>) => void;
  
  // Auto-refresh
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  lastUpdated: Date | null;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

interface WeatherProviderProps {
  children: React.ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  // Weather state
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Location state
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // Settings state
  const [units, setUnitsState] = useState<WeatherContextType['units']>({
    temperature: 'fahrenheit',
    windSpeed: 'mph',
    precipitation: 'inch'
  });
  
  // Auto-refresh state
  const [autoRefresh, setAutoRefreshState] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Fetch weather data for the current location
   */
  const fetchWeatherData = useCallback(async (location: Location) => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getWeather(location, units);
      setWeatherData(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather data';
      setError(errorMessage);
      console.error('Error fetching weather:', err);
    } finally {
      setLoading(false);
    }
  }, [units]);

  /**
   * Get current location and fetch weather
   */
  const getCurrentLocation = useCallback(async () => {
    setLocationLoading(true);
    setLocationError(null);
    
    try {
      const location = await locationService.getLocationWithFallback();
      setCurrentLocation(location);
      setLocationError(null);
      
      // Fetch weather for the new location
      await fetchWeatherData(location);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setLocationError(errorMessage);
      console.error('Error getting location:', err);
    } finally {
      setLocationLoading(false);
    }
  }, [fetchWeatherData]);

  /**
   * Set a new location and fetch weather
   */
  const setLocation = useCallback(async (location: Location) => {
    setCurrentLocation(location);
    locationService.saveRecentSearch(location);
    await fetchWeatherData(location);
  }, [fetchWeatherData]);

  /**
   * Refresh weather data
   */
  const refreshWeather = useCallback(async () => {
    if (currentLocation) {
      await fetchWeatherData(currentLocation);
    } else {
      await getCurrentLocation();
    }
  }, [currentLocation, fetchWeatherData, getCurrentLocation]);

  /**
   * Search for locations
   */
  const searchLocations = useCallback(async (query: string): Promise<Location[]> => {
    try {
      return await locationService.searchLocations(query);
    } catch (err) {
      console.error('Error searching locations:', err);
      return [];
    }
  }, []);

  /**
   * Clear errors
   */
  const clearError = useCallback(() => {
    setError(null);
    setLocationError(null);
  }, []);

  /**
   * Update units
   */
  const setUnits = useCallback((newUnits: Partial<WeatherContextType['units']>) => {
    setUnitsState(prev => ({ ...prev, ...newUnits }));
  }, []);

  /**
   * Toggle auto-refresh
   */
  const setAutoRefresh = useCallback((enabled: boolean) => {
    setAutoRefreshState(enabled);
  }, []);

  /**
   * Set up auto-refresh interval
   */
  useEffect(() => {
    if (autoRefresh && currentLocation) {
      // Clear existing interval
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      
      // Set up new interval
      refreshIntervalRef.current = setInterval(() => {
        console.log('Auto-refreshing weather data...');
        fetchWeatherData(currentLocation);
      }, AUTO_REFRESH_INTERVAL);
      
      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [autoRefresh, currentLocation, fetchWeatherData]);

  /**
   * Initial load - get location and weather on mount
   */
  useEffect(() => {
    getCurrentLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Refetch weather when units change
   */
  useEffect(() => {
    if (currentLocation && weatherData) {
      fetchWeatherData(currentLocation);
    }
  }, [units]); // eslint-disable-line react-hooks/exhaustive-deps

  const contextValue: WeatherContextType = {
    // Weather data
    weatherData,
    loading,
    error,
    
    // Location data
    currentLocation,
    locationLoading,
    locationError,
    
    // Actions
    refreshWeather,
    setLocation,
    getCurrentLocation,
    searchLocations,
    clearError,
    
    // Settings
    units,
    setUnits,
    
    // Auto-refresh
    autoRefresh,
    setAutoRefresh,
    lastUpdated
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherContext;