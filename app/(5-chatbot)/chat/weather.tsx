import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
} from "lucide-react";
import { chatStore } from "./store";
import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export interface WeatherData {
  city: string;
  temperature: number;
  weatherCode: number;
  humidity: number;
}

const defaultWeatherData: WeatherData = {
  city: "San Francisco",
  temperature: 18,
  weatherCode: 1,
  humidity: 65,
};

export default function Weather({
  weatherData = defaultWeatherData,
}: {
  weatherData?: WeatherData;
}) {
  // Access the SAME chat instance via ID to get the append function
	const { append } = useChat({ chatStore, chatId: "weather-chat" });

  const [buttonClicked, setButtonClicked] = useState(false)

	const handleButtonClick = () => {
		append({
			parts: [{ text: "Get weather in a random place", type: "text" }],
			role: "user"
		});
		setButtonClicked(true) // Disable button after click
	}
  
  const getWeatherIcon = (code: number) => {
    switch (true) {
      case code === 0:
        return <Sun size={64} className="text-yellow-300" />;
      case code <= 3:
        return (
          <div className="relative">
            <Sun size={64} className="text-yellow-300" />
            <Cloud
              size={48}
              className="text-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        );
      case code <= 49:
        return <Cloud size={64} className="text-gray-300" />;
      case code <= 69:
        return <CloudRain size={64} className="text-blue-300" />;
      case code <= 79:
        return <CloudSnow size={64} className="text-blue-200" />;
      case code <= 84:
        return <CloudRain size={64} className="text-blue-300" />;
      case code <= 99:
        return <CloudLightning size={64} className="text-yellow-400" />;
      default:
        return <Cloud size={64} className="text-gray-300" />;
    }
  };

  const getWeatherCondition = (code: number) => {
    switch (true) {
      case code === 0:
        return "Clear sky";
      case code <= 3:
        return "Partly cloudy";
      case code <= 49:
        return "Cloudy";
      case code <= 69:
        return "Rainy";
      case code <= 79:
        return "Snowy";
      case code <= 84:
        return "Rain showers";
      case code <= 99:
        return "Thunderstorm";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="text-white p-8 rounded-3xl backdrop-blur-lg bg-gradient-to-b from-blue-400 to-blue-600 shadow-lg">
      <h2 className="text-4xl font-semibold mb-2">{weatherData.city}</h2>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-6xl font-light">{weatherData.temperature}°C</p>
          <p className="text-xl mt-1">
            {getWeatherCondition(weatherData.weatherCode)}
          </p>
        </div>
        <div className="ml-8" aria-hidden="true">
          {getWeatherIcon(weatherData.weatherCode)}
        </div>
      </div>
      <div className="mt-6 flex items-center">
        <CloudFog size={20} aria-hidden="true" />
        <span className="ml-2">Humidity: {weatherData.humidity}%</span>
      </div>
      <Button
				onClick={handleButtonClick}
				disabled={buttonClicked}
				className="mt-2 bg-gradient-to-b from-blue-400 to-blue-600"
				variant="outline" // Example styling
				size="sm" // Example styling
			>
				{buttonClicked ? 'Asked for random...' : 'Random City?'}
			</Button>
    </div>
  );
}
