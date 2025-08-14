import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWeather } from '../hooks/useWeather';

interface WeatherBackgroundProps {
  children: React.ReactNode;
}

const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ children }) => {
  const { currentWeather } = useWeather();

  const gradient = useMemo(() => {
    if (!currentWeather?.gradient) {
      // Default gradient
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    const colors = currentWeather.gradient;
    if (colors.length === 2) {
      return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`;
    } else if (colors.length === 3) {
      return `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
    }
    
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  }, [currentWeather?.gradient]);

  return (
    <motion.div
      className="min-h-screen relative overflow-hidden"
      animate={{
        background: gradient
      }}
      transition={{
        duration: 2,
        ease: "easeInOut"
      }}
      style={{
        background: gradient
      }}
    >
      {/* Animated background particles/effects */}
      <div className="absolute inset-0 overflow-hidden">
        {currentWeather?.weatherCode && (
          <>
            {/* Rain effect for rainy weather */}
            {[61, 63, 65, 80, 81, 82].includes(currentWeather.weatherCode) && (
              <div className="rain-effect">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-0.5 h-8 bg-white/20"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: -32
                    }}
                    animate={{
                      y: ['0vh', '120vh']
                    }}
                    transition={{
                      duration: Math.random() * 1 + 0.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            )}

            {/* Snow effect for snowy weather */}
            {[71, 73, 75, 77, 85, 86].includes(currentWeather.weatherCode) && (
              <div className="snow-effect">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: -8,
                      opacity: Math.random() * 0.8 + 0.2
                    }}
                    animate={{
                      y: ['0vh', '120vh'],
                      x: [0, (Math.random() - 0.5) * 100]
                    }}
                    transition={{
                      duration: Math.random() * 5 + 5,
                      repeat: Infinity,
                      ease: "linear",
                      delay: Math.random() * 5
                    }}
                  />
                ))}
              </div>
            )}

            {/* Cloud/fog overlay for cloudy weather */}
            {[3, 45, 48].includes(currentWeather.weatherCode) && (
              <div className="absolute inset-0">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
                  animate={{
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            )}

            {/* Lightning effect for thunderstorms */}
            {[95, 96, 99].includes(currentWeather.weatherCode) && (
              <motion.div
                className="absolute inset-0 bg-white"
                animate={{
                  opacity: [0, 0, 0.8, 0]
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 5 + 3,
                  times: [0, 0.9, 0.95, 1]
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

export default WeatherBackground;