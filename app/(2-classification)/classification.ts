import dotenvFlow from "dotenv-flow";
dotenvFlow.config();

import supportRequests from "./support_requests_multilanguage.json";
import { z } from 'zod'
import { generateObject } from "ai";
import { gateway } from "@vercel/ai-sdk-gateway";

// Define the schema for a single classified request
const classificationSchema = z.object({
	request: z.string().describe('The original support request text.'),
	category: z
		.enum(['billing', 'product_issues', 'enterprise_sales', 'account_issues', 'product_feedback'])
		.describe('The most relevant category for the support request.'),
    urgency: z
		.enum(['low', 'medium', 'high'])
    .describe('The probable urgency of the support request.'),
    language: z
		.string()
		.describe('The full name of the language the support request is in (e.g., English, Spanish, German).'),
})

async function main() {
	console.log('Asking AI to classify support requests...')

	// Use generateObject to get structured output
	const { object: classifiedRequests } = await generateObject({
		model: gateway('openai/gpt-4.1-nano'), // A capable yet cost-effective choice
		// Prompt combines instruction + stringified data
		prompt: `Classify the following support requests based on the defined categories.\n\n${JSON.stringify(supportRequests)}`,
		// Our Zod schema defines the structure for each item
		schema: classificationSchema,
		// Crucial: Tell the SDK we expect an array of these objects
		output: 'array',
	})

	console.log('\n--- AI Response (Structured JSON) ---')
	// Output the validated, structured array
	console.log(JSON.stringify(classifiedRequests, null, 2))
	console.log('-----------------------------------')
}

main().catch(console.error)
