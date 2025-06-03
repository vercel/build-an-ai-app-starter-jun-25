import { gateway } from '@vercel/ai-sdk-gateway'
import { streamText, convertToModelMessages } from 'ai' 
import type { UIMessage } from '@ai-sdk/react'; // import UIMessage type

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
	try {
		// Extract the `messages` array from the body of the request
		const { messages }: { messages: UIMessage[] } = await req.json()

		// Call the language model
		const result = await streamText({
			model: gateway('openai/gpt-4.1-nano'), // Use openai/gpt-4.1-nano for faster responses
			messages: convertToModelMessages(messages),
		})

		// Respond with the stream
		return result.toUIMessageStreamResponse()
	} catch (error) {
		console.error('Chat API error:', error)
		// Generic error response
		return new Response(JSON.stringify({ error: 'Failed to generate chat response.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}