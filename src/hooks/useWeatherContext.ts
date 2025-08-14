import { useContext } from 'react';
import WeatherContext from '../contexts/WeatherContext';

/**
 * Custom hook to use weather context
 */
export const useWeatherContext = () => {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
};