import { tool } from 'ai'
import { z } from 'zod'

export const getWeather = tool({
	// Crucial: Clear description helps model decide when to use the tool.
	// Be specific about capabilities and limitations.
	description: `Get the current weather conditions and temperature for a specific city.
                Use this for questions about current weather, not forecasts.`,
	parameters: z.object({
		// Input schema for the tool
		city: z.string().describe('The city name for weather lookup.'),
		// Model infers these based on city using its internal knowledge
		latitude: z.number().describe('Inferred latitude of the city.'),
		longitude: z.number().describe('Inferred longitude of the city.'),
	}),
	execute: async ({ city, latitude, longitude }) => {
		// Function runs when tool is called
		console.log(`Executing getWeather for ${city} (${latitude}, ${longitude})`)
		try {
			// Example: Call real weather API
			const response = await fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,relativehumidity_2m&timezone=auto`,
			)

			if (!response.ok) {
				// Throw error if API call fails
				throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
			}

			const weatherData = await response.json()

			// Return structured data relevant to the query
			return {
				city,
				temperature: weatherData.current.temperature_2m,
				weatherCode: weatherData.current.weathercode,
				humidity: weatherData.current.relativehumidity_2m,
			}
		} catch (error) {
			console.error('getWeather tool execution error:', error)
			// Return structured error information for the model
			return {
				city,
				error: `Unable to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`,
			}
		}
	},
})