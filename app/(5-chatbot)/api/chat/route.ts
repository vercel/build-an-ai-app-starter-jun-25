import { gateway } from '@vercel/ai-sdk-gateway'
import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { getWeather } from './tools'

export const maxDuration = 30

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json()

		const result = await streamText({
			model: gateway('openai/gpt-4.1-nano'),
			system: `You are a helpful assistant that can answer questions about the weather.`, 
			messages: convertToModelMessages(messages),
			// Register the 'getWeather' tool with the streamText call
			tools: { getWeather },
		})

		return result.toUIMessageStreamResponse()
	} catch (error) {
		console.error('Chat API error:', error)
		return new Response(JSON.stringify({ error: 'Failed to generate chat response.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}