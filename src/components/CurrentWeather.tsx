import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import { FiMapPin, FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';

const CurrentWeather: React.FC = () => {
  const { currentWeather, loading, error, refreshWeather, formattedLastUpdated, units } = useWeather();

  if (loading && !currentWeather) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !currentWeather) {
    return (
      <div className="text-center text-white p-8">
        <p className="text-xl mb-4">Unable to load weather data</p>
        <p className="text-sm opacity-75 mb-6">{error}</p>
        <button
          onClick={refreshWeather}
          className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!currentWeather) return null;

  const WeatherIcon = currentWeather.icon;
  const tempUnit = units.temperature === 'celsius' ? '°C' : '°F';

  return (
    <div className="text-white">
      {/* Header with location and refresh */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2">
          <FiMapPin className="w-5 h-5" />
          <div>
            <h1 className="text-2xl font-semibold">
              {currentWeather.location.name}
            </h1>
            <p className="text-sm opacity-75">
              {currentWeather.location.country}
            </p>
          </div>
        </div>
        
        <motion.button
          onClick={refreshWeather}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.3 }}
          disabled={loading}
        >
          <FiRefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>

      {/* Main temperature display */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center items-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 
            }}
          >
            <WeatherIcon className="w-24 h-24 md:w-32 md:h-32" />
          </motion.div>
        </div>
        
        <motion.div
          className="text-7xl md:text-8xl font-bold mb-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2 
          }}
        >
          {currentWeather.temperature}{tempUnit}
        </motion.div>
        
        <motion.p
          className="text-xl md:text-2xl mb-2 capitalize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentWeather.description}
        </motion.p>
        
        <motion.p
          className="text-lg opacity-75"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          transition={{ delay: 0.4 }}
        >
          Feels like {currentWeather.apparentTemperature}{tempUnit}
        </motion.p>
      </motion.div>

      {/* Time and last updated */}
      <div className="text-center text-sm opacity-60">
        <p>
          {new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })}
        </p>
        {formattedLastUpdated && (
          <p>Updated {formattedLastUpdated}</p>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;