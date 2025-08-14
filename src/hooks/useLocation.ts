import { useWeatherContext } from '../contexts/WeatherContext';
import { useState, useCallback, useEffect } from 'react';
import locationService from '../services/locationService';
import type { Location } from '../services/locationService';

/**
 * Custom hook for location management
 */
export const useLocation = () => {
  const {
    currentLocation,
    locationLoading,
    locationError,
    setLocation,
    getCurrentLocation,
    searchLocations
  } = useWeatherContext();

  const [recentSearches, setRecentSearches] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load recent searches on mount
  useEffect(() => {
    const recent = locationService.getRecentSearches();
    setRecentSearches(recent);
  }, []);

  // Update recent searches when location changes
  useEffect(() => {
    if (currentLocation) {
      const recent = locationService.getRecentSearches();
      setRecentSearches(recent);
    }
  }, [currentLocation]);

  /**
   * Handle location search
   */
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocations(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchLocations]);

  /**
   * Select a location from search results
   */
  const selectLocation = useCallback(async (location: Location) => {
    await setLocation(location);
    setSearchQuery('');
    setSearchResults([]);
    
    // Update recent searches
    const recent = locationService.getRecentSearches();
    setRecentSearches(recent);
  }, [setLocation]);

  /**
   * Clear recent searches
   */
  const clearRecentSearches = useCallback(() => {
    locationService.clearRecentSearches();
    setRecentSearches([]);
  }, []);

  /**
   * Get user's current location
   */
  const requestCurrentLocation = useCallback(async () => {
    await getCurrentLocation();
  }, [getCurrentLocation]);

  /**
   * Check if location permission is granted
   */
  const checkLocationPermission = useCallback(async (): Promise<PermissionState> => {
    if (!navigator.permissions) {
      return 'prompt';
    }
    
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state;
    } catch (error) {
      console.error('Error checking location permission:', error);
      return 'prompt';
    }
  }, []);

  return {
    // Current location
    currentLocation,
    locationLoading,
    locationError,
    
    // Search
    searchQuery,
    searchResults,
    isSearching,
    handleSearch,
    selectLocation,
    
    // Recent searches
    recentSearches,
    clearRecentSearches,
    
    // Actions
    requestCurrentLocation,
    checkLocationPermission
  };
};

/**
 * Hook for location search functionality
 */
export const useLocationSearch = () => {
  const { searchQuery, searchResults, isSearching, handleSearch, selectLocation } = useLocation();
  
  return {
    query: searchQuery,
    results: searchResults,
    loading: isSearching,
    search: handleSearch,
    select: selectLocation
  };
};

/**
 * Hook for managing recent searches
 */
export const useRecentSearches = () => {
  const { recentSearches, clearRecentSearches, selectLocation } = useLocation();
  
  return {
    searches: recentSearches,
    clear: clearRecentSearches,
    select: selectLocation
  };
};