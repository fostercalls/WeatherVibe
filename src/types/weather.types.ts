export interface WeatherCurrent {
  time: string;
  temperature: number;
  apparentTemperature: number;
  isDay: boolean;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  precipitation: number;
}

export interface WeatherHourly {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitation: number;
  isDay: boolean;
}

export interface WeatherDaily {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
}

export interface WeatherData {
  current: WeatherCurrent;
  hourly: WeatherHourly[];
  daily: WeatherDaily[];
  timezone: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
    country: string;
  };
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: Record<string, any>;
  hourly_units: Record<string, string>;
  hourly: Record<string, any[]>;
  daily_units: Record<string, string>;
  daily: Record<string, any[]>;
}