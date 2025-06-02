'use server'

import { generateObject } from 'ai'
import { gateway } from '@vercel/ai-sdk-gateway'
import { appointmentSchema, AppointmentDetails } from './schemas'

export const extractAppointment = async (input: string): Promise<AppointmentDetails> => {
  console.log(`Extracting from: "${input}"`)

  const { object: appointmentDetails } = await generateObject({
    model: gateway('openai/gpt-4.1-nano'),
    prompt: `Extract the appointment details from the following natural language input:\n\n"${input}"`,
    // Pass our Zod schema
    schema: appointmentSchema,
  })

  console.log('Extracted details:', appointmentDetails)
  // The SDK guarantees the output matches the schema, so the return type is safe.
  return appointmentDetails
}