import { z } from "zod"

// Define the exact structure for appointment details
// This schema can be shared between your frontend and backend!

export const appointmentSchema = z.object({
	// Ensure schema is exported
	title: z.string().describe(
		'The title of the event. Should be the main purpose, concise, without names. Capitalize properly.', // Clearer title instructions
	),
	startTime: z
		.string()
		.nullable()
		.describe('Appointment start time in HH:MM format (e.g., 14:00 for 2pm).'), // Specific format
	endTime: z.string().nullable().describe(
		'Appointment end time in HH:MM format. If not specified, assume a 1-hour duration after startTime.', // Default duration logic!
	),
	attendees: z.array(z.string()).nullable().describe(
		'List of attendee names. Extract first and last names if available.', // Attendee details
	),
	location: z.string().nullable(),
	date: z.string().describe(
		`The date of the appointment. Today's date is ${new Date().toISOString().split('T')[0]}. Use YYYY-MM-DD format.`, // Crucial: Give today's date context!
	),
})

// Define the type based on the schema
export type AppointmentDetails = z.infer<typeof appointmentSchema>