'use server'

import { generateObject } from 'ai'
import {gateway} from '@vercel/ai-sdk-gateway'
import { z } from 'zod'

// Define the structure we want for our summary
const summarySchema = z.object({
	headline: z.string().describe('The main topic or title of the summary. Max 5 words.'), // Concise headline
	context: z.string().describe(
		'Briefly explain the situation or background that led to this discussion. Max 2 sentences.', // Length guidance
	),
	discussionPoints: z.string().describe('Summarize the key topics discussed. Max 2 sentences.'), // Focused points
	takeaways: z.string().describe(
		'List the main decisions, action items, or next steps. **Include names** for assigned tasks. Max 2-3 bullet points or sentences.', // Specific instructions!
	),
})

export const generateSummary = async (comments: any[]) => {
	console.log('Generating summary for', comments.length, 'comments...')

	const { object: summary } = await generateObject({
		// Using a more capable model like gpt-4o often yields better summarization
		// results due to stronger comprehension and pattern recognition.
		model: gateway('openai/gpt-4.1-nano'),
		prompt: `Please summarise the following comments concisely, focusing on key decisions and action items.
    Comments:
    ${JSON.stringify(comments)}`,
		// Our Zod schema defines the output structure
		schema: summarySchema,
	})

	console.log('Summary generated:', summary)
	return summary
}