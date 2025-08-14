interface WeatherCardProps {
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  cityName: string
  country: string
  icon: string
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  temperature,
  description,
  humidity,
  windSpeed,
  cityName,
  country,
  icon
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          {cityName}, {country}
        </h2>
        <p className="text-gray-600 capitalize">{description}</p>
      </div>
      
      <div className="flex justify-center items-center">
        <div className="text-6xl font-bold text-gray-800">
          {Math.round(temperature)}°
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Humidity</p>
          <p className="text-xl font-semibold">{humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-sm">Wind Speed</p>
          <p className="text-xl font-semibold">{windSpeed} m/s</p>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard