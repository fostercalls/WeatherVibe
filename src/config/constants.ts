export const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1';
export const GEOCODING_API_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';

export const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds
export const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

export const DEFAULT_LOCATION = {
  latitude: 40.7128,
  longitude: -74.0060,
  name: 'New York',
  country: 'United States'
};

export const WEATHER_PARAMS = {
  current: [
    'temperature_2m',
    'apparent_temperature',
    'is_day',
    'weather_code',
    'wind_speed_10m',
    'wind_direction_10m',
    'relative_humidity_2m',
    'pressure_msl',
    'uv_index',
    'visibility',
    'precipitation'
  ],
  hourly: [
    'temperature_2m',
    'weather_code',
    'precipitation_probability',
    'precipitation',
    'is_day'
  ],
  daily: [
    'weather_code',
    'temperature_2m_max',
    'temperature_2m_min',
    'precipitation_probability_max',
    'precipitation_sum',
    'sunrise',
    'sunset',
    'uv_index_max'
  ]
};

export const TEMPERATURE_UNITS = {
  CELSIUS: 'celsius',
  FAHRENHEIT: 'fahrenheit'
} as const;

export const WIND_SPEED_UNITS = {
  KMH: 'kmh',
  MS: 'ms',
  MPH: 'mph',
  KNOTS: 'kn'
} as const;

export const PRECIPITATION_UNITS = {
  MM: 'mm',
  INCH: 'inch'
} as const;