import { 
  WiDaySunny, 
  WiNightClear,
  WiDayCloudy,
  WiNightAltCloudy,
  WiCloudy,
  WiFog,
  WiSprinkle,
  WiRain,
  WiRainMix,
  WiSnow,
  WiSnowflakeCold,
  WiSleet,
  WiShowers,
  WiNightShowers,
  WiThunderstorm,
  WiNightThunderstorm,
  WiDayRain,
  WiNightRain,
  WiDaySnow,
  WiNightSnow,
  WiDayShowers,
  WiHail,
  WiStormShowers
} from 'react-icons/wi';
import type { IconType } from 'react-icons';

interface WeatherCodeInfo {
  description: string;
  dayIcon: IconType;
  nightIcon: IconType;
}

/**
 * WMO Weather interpretation codes (WW)
 * Based on https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
 */
const weatherCodeMap: Record<number, WeatherCodeInfo> = {
  0: {
    description: 'Clear sky',
    dayIcon: WiDaySunny,
    nightIcon: WiNightClear
  },
  1: {
    description: 'Mainly clear',
    dayIcon: WiDaySunny,
    nightIcon: WiNightClear
  },
  2: {
    description: 'Partly cloudy',
    dayIcon: WiDayCloudy,
    nightIcon: WiNightAltCloudy
  },
  3: {
    description: 'Overcast',
    dayIcon: WiCloudy,
    nightIcon: WiCloudy
  },
  45: {
    description: 'Foggy',
    dayIcon: WiFog,
    nightIcon: WiFog
  },
  48: {
    description: 'Depositing rime fog',
    dayIcon: WiFog,
    nightIcon: WiFog
  },
  51: {
    description: 'Light drizzle',
    dayIcon: WiSprinkle,
    nightIcon: WiSprinkle
  },
  53: {
    description: 'Moderate drizzle',
    dayIcon: WiSprinkle,
    nightIcon: WiSprinkle
  },
  55: {
    description: 'Dense drizzle',
    dayIcon: WiSprinkle,
    nightIcon: WiSprinkle
  },
  56: {
    description: 'Light freezing drizzle',
    dayIcon: WiRainMix,
    nightIcon: WiRainMix
  },
  57: {
    description: 'Dense freezing drizzle',
    dayIcon: WiRainMix,
    nightIcon: WiRainMix
  },
  61: {
    description: 'Slight rain',
    dayIcon: WiDayRain,
    nightIcon: WiNightRain
  },
  63: {
    description: 'Moderate rain',
    dayIcon: WiRain,
    nightIcon: WiRain
  },
  65: {
    description: 'Heavy rain',
    dayIcon: WiRain,
    nightIcon: WiRain
  },
  66: {
    description: 'Light freezing rain',
    dayIcon: WiSleet,
    nightIcon: WiSleet
  },
  67: {
    description: 'Heavy freezing rain',
    dayIcon: WiSleet,
    nightIcon: WiSleet
  },
  71: {
    description: 'Slight snow fall',
    dayIcon: WiDaySnow,
    nightIcon: WiNightSnow
  },
  73: {
    description: 'Moderate snow fall',
    dayIcon: WiSnow,
    nightIcon: WiSnow
  },
  75: {
    description: 'Heavy snow fall',
    dayIcon: WiSnowflakeCold,
    nightIcon: WiSnowflakeCold
  },
  77: {
    description: 'Snow grains',
    dayIcon: WiSnow,
    nightIcon: WiSnow
  },
  80: {
    description: 'Slight rain showers',
    dayIcon: WiDayShowers,
    nightIcon: WiNightShowers
  },
  81: {
    description: 'Moderate rain showers',
    dayIcon: WiShowers,
    nightIcon: WiShowers
  },
  82: {
    description: 'Violent rain showers',
    dayIcon: WiShowers,
    nightIcon: WiShowers
  },
  85: {
    description: 'Slight snow showers',
    dayIcon: WiDaySnow,
    nightIcon: WiNightSnow
  },
  86: {
    description: 'Heavy snow showers',
    dayIcon: WiSnowflakeCold,
    nightIcon: WiSnowflakeCold
  },
  95: {
    description: 'Thunderstorm',
    dayIcon: WiThunderstorm,
    nightIcon: WiNightThunderstorm
  },
  96: {
    description: 'Thunderstorm with slight hail',
    dayIcon: WiStormShowers,
    nightIcon: WiStormShowers
  },
  99: {
    description: 'Thunderstorm with heavy hail',
    dayIcon: WiHail,
    nightIcon: WiHail
  }
};

/**
 * Get weather information for a WMO weather code
 */
export function getWeatherInfo(code: number, isDay = true): {
  description: string;
  icon: IconType;
} {
  const info = weatherCodeMap[code] || weatherCodeMap[0];
  
  return {
    description: info.description,
    icon: isDay ? info.dayIcon : info.nightIcon
  };
}

/**
 * Get weather condition category for styling
 */
export function getWeatherCategory(code: number): 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' {
  if (code <= 1) return 'clear';
  if (code <= 3 || (code >= 45 && code <= 48)) return code >= 45 ? 'fog' : 'cloudy';
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snow';
  if (code >= 95) return 'storm';
  return 'clear';
}

/**
 * Get gradient colors based on weather and time
 */
export function getWeatherGradient(code: number, isDay = true): string[] {
  const category = getWeatherCategory(code);
  
  if (!isDay) {
    // Night gradients
    switch (category) {
      case 'clear':
        return ['#0F2027', '#203A43', '#2C5364'];
      case 'cloudy':
      case 'fog':
        return ['#1e3c72', '#2a5298'];
      case 'rain':
        return ['#141E30', '#243B55'];
      case 'snow':
        return ['#2C3E50', '#3498DB'];
      case 'storm':
        return ['#0F0C29', '#302b63', '#24243e'];
      default:
        return ['#0F2027', '#203A43', '#2C5364'];
    }
  }
  
  // Day gradients
  switch (category) {
    case 'clear':
      return ['#56CCF2', '#2F80ED'];
    case 'cloudy':
      return ['#8E9EAB', '#CBD2D9'];
    case 'fog':
      return ['#757F9A', '#D7DDE8'];
    case 'rain':
      return ['#667db6', '#0082c8', '#667db6'];
    case 'snow':
      return ['#E0EAFC', '#CFDEF3'];
    case 'storm':
      return ['#373B44', '#4286f4'];
    default:
      return ['#56CCF2', '#2F80ED'];
  }
}

/**
 * Format wind direction from degrees to compass direction
 */
export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

/**
 * Get UV index level and description
 */
export function getUVIndexLevel(index: number): {
  level: string;
  description: string;
  color: string;
} {
  if (index <= 2) {
    return { level: 'Low', description: 'No protection needed', color: '#4ade80' };
  } else if (index <= 5) {
    return { level: 'Moderate', description: 'Protection needed', color: '#facc15' };
  } else if (index <= 7) {
    return { level: 'High', description: 'Protection essential', color: '#fb923c' };
  } else if (index <= 10) {
    return { level: 'Very High', description: 'Extra protection needed', color: '#f87171' };
  } else {
    return { level: 'Extreme', description: 'Avoid sun exposure', color: '#dc2626' };
  }
}

/**
 * Format visibility distance
 */
export function formatVisibility(km: number): string {
  if (km >= 10) return '10+ km';
  if (km >= 1) return `${km.toFixed(1)} km`;
  return `${(km * 1000).toFixed(0)} m`;
}

export default {
  getWeatherInfo,
  getWeatherCategory,
  getWeatherGradient,
  getWindDirection,
  getUVIndexLevel,
  formatVisibility
};