import React from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';
import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiDaySunny,
  WiThermometer
} from 'react-icons/wi';
import { FiEye } from 'react-icons/fi';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  detail?: string;
  color?: string;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  unit,
  detail,
  color,
  delay = 0
}) => {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="text-white/60 text-sm">{label}</div>
        <div className="text-white/80">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-white">{value}</span>
        {unit && <span className="text-sm text-white/60">{unit}</span>}
      </div>
      {detail && (
        <div className="mt-1 text-xs text-white/50" style={{ color }}>
          {detail}
        </div>
      )}
    </motion.div>
  );
};

const WeatherMetrics: React.FC = () => {
  const { currentWeather, units } = useWeather();

  if (!currentWeather) return null;

  const windUnit = units.windSpeed === 'mph' ? 'mph' : 
                   units.windSpeed === 'ms' ? 'm/s' : 
                   units.windSpeed === 'kn' ? 'kn' : 'km/h';

  const metrics = [
    {
      icon: <WiThermometer className="w-5 h-5" />,
      label: 'Feels Like',
      value: currentWeather.apparentTemperature,
      unit: units.temperature === 'celsius' ? '°C' : '°F',
      delay: 0.1
    },
    {
      icon: <WiHumidity className="w-5 h-5" />,
      label: 'Humidity',
      value: currentWeather.humidity,
      unit: '%',
      detail: currentWeather.humidity > 70 ? 'High' : 
              currentWeather.humidity > 40 ? 'Moderate' : 'Low',
      delay: 0.15
    },
    {
      icon: <WiStrongWind className="w-5 h-5" />,
      label: 'Wind',
      value: currentWeather.windSpeed,
      unit: windUnit,
      detail: currentWeather.windDirection,
      delay: 0.2
    },
    {
      icon: <WiDaySunny className="w-5 h-5" />,
      label: 'UV Index',
      value: currentWeather.uvIndex.toFixed(1),
      unit: '',
      detail: currentWeather.uvLevel.level,
      color: currentWeather.uvLevel.color,
      delay: 0.25
    },
    {
      icon: <WiBarometer className="w-5 h-5" />,
      label: 'Pressure',
      value: currentWeather.pressure,
      unit: 'hPa',
      detail: currentWeather.pressure > 1020 ? 'High' : 
              currentWeather.pressure > 1010 ? 'Normal' : 'Low',
      delay: 0.3
    },
    {
      icon: <FiEye className="w-5 h-5" />,
      label: 'Visibility',
      value: currentWeather.formattedVisibility,
      unit: '',
      detail: currentWeather.visibility >= 10 ? 'Clear' : 
              currentWeather.visibility >= 5 ? 'Moderate' : 'Poor',
      delay: 0.35
    }
  ];

  return (
    <div className="w-full">
      <motion.h2
        className="text-white text-lg font-semibold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Current Conditions
      </motion.h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            {...metric}
          />
        ))}
      </div>

      {/* Additional weather info */}
      <motion.div
        className="mt-4 p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between text-white/60 text-sm">
          <span>Precipitation</span>
          <span className="text-white">
            {currentWeather.precipitation.toFixed(1)} {units.precipitation === 'mm' ? 'mm' : 'in'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default WeatherMetrics;