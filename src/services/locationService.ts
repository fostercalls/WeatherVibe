import { DEFAULT_LOCATION, GEOCODING_API_BASE_URL } from '../config/constants';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  name: string;
  country: string;
  state?: string;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

class LocationService {
  private static instance: LocationService;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  /**
   * Get user's current location using browser Geolocation API
   */
  async getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Get location with fallback to default if permission denied
   */
  async getLocationWithFallback(): Promise<Location> {
    try {
      const coords = await this.getCurrentLocation();
      const locationDetails = await this.reverseGeocode(coords.latitude, coords.longitude);
      return locationDetails;
    } catch (error) {
      console.warn('Failed to get current location, using default:', error);
      return DEFAULT_LOCATION;
    }
  }

  /**
   * Search for locations by name
   */
  async searchLocations(query: string): Promise<Location[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${GEOCODING_API_BASE_URL}/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return [];
      }

      return data.results.map((result: GeocodingResult) => ({
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
        state: result.admin1,
      }));
    } catch (error) {
      console.error('Failed to search locations:', error);
      throw new Error('Failed to search locations. Please try again.');
    }
  }

  /**
   * Reverse geocode coordinates to get location details
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<Location> {
    try {
      const response = await fetch(
        `${GEOCODING_API_BASE_URL}/reverse?latitude=${latitude}&longitude=${longitude}&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return {
          latitude,
          longitude,
          name: 'Unknown Location',
          country: '',
        };
      }

      const result = data.results[0] as GeocodingResult;
      
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name || 'Unknown Location',
        country: result.country || '',
        state: result.admin1,
      };
    } catch (error) {
      console.error('Failed to reverse geocode:', error);
      return {
        latitude,
        longitude,
        name: 'Unknown Location',
        country: '',
      };
    }
  }

  /**
   * Store recent searches in localStorage
   */
  saveRecentSearch(location: Location): void {
    try {
      const recentSearches = this.getRecentSearches();
      
      // Remove duplicate if exists
      const filtered = recentSearches.filter(
        (search) => 
          !(search.latitude === location.latitude && 
            search.longitude === location.longitude)
      );
      
      // Add new search at beginning
      filtered.unshift(location);
      
      // Keep only last 5 searches
      const toSave = filtered.slice(0, 5);
      
      localStorage.setItem('recentSearches', JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save recent search:', error);
    }
  }

  /**
   * Get recent searches from localStorage
   */
  getRecentSearches(): Location[] {
    try {
      const stored = localStorage.getItem('recentSearches');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get recent searches:', error);
      return [];
    }
  }

  /**
   * Clear recent searches
   */
  clearRecentSearches(): void {
    try {
      localStorage.removeItem('recentSearches');
    } catch (error) {
      console.error('Failed to clear recent searches:', error);
    }
  }
}

export default LocationService.getInstance();