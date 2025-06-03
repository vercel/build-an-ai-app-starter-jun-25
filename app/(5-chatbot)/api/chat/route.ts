import { gateway } from '@vercel/ai-sdk-gateway'
import { streamText, convertToModelMessages, UIMessage } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
	try {
		const { messages }: { messages: UIMessage[] } = await req.json()

		const result = await streamText({
			model: gateway('openai/o3'),
			// Add system prompt here
			system: `You are a support assistant for TechCorp's cloud platform.
  Focus on helping users troubleshoot deployment issues, API usage, and account settings.
  Be concise but thorough. Link to documentation at docs.techcorp.com when relevant.
  If a question is outside your knowledge area, politely redirect to contact@techcorp.com.`,
			messages: convertToModelMessages(messages),
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