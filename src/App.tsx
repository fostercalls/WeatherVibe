import { WeatherProvider } from './contexts/WeatherContext';
import WeatherBackground from './components/WeatherBackground';
import LocationSearch from './components/LocationSearch';
import CurrentWeather from './components/CurrentWeather';
import WeatherMetrics from './components/WeatherMetrics';

function App() {
  return (
    <WeatherProvider>
      <WeatherBackground>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-8">
            {/* Location Search */}
            <LocationSearch />
            
            {/* Current Weather Section */}
            <CurrentWeather />
            
            {/* Weather Metrics Section */}
            <WeatherMetrics />
            
            {/* Placeholder for future components */}
            <div className="text-white/60 text-center text-sm mt-8">
              <p>Hourly and Daily forecasts coming soon...</p>
            </div>
          </div>
        </div>
      </WeatherBackground>
    </WeatherProvider>
  );
}

export default App