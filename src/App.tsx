import { useState, useEffect } from 'react'

function App() {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('')

  const handleSearch = async () => {
    if (!location) return
    
    setLoading(true)
    try {
      // Placeholder for weather API call
      console.log('Searching weather for:', location)
      // TODO: Implement actual weather API integration
    } catch (error) {
      console.error('Error fetching weather:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">WeatherVibe</h1>
          <p className="text-blue-100">Get the current weather for any location</p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6">
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter city name..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {weather ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Weather data will appear here</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Enter a location to get started</p>
              </div>
            )}
          </div>
        </div>

        <footer className="text-center mt-12 text-white/80">
          <p>Built with React, TypeScript, Vite, and Tailwind CSS</p>
        </footer>
      </div>
    </div>
  )
}

export default App