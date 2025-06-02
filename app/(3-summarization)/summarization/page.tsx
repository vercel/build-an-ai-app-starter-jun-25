// app/(3-summarization)/summarization/page.tsx
'use client'

import { useState } from 'react' // Import useState
import { MessageList } from './message-list'
import { Button } from '@/components/ui/button'
import messages from './messages.json'
import { generateSummary } from './actions' // Import the action
import { SummaryCard } from './summary-card' // Import the UI component

// Define the expected type based on the action's return type
// This uses TypeScript utility types for automatic type safety!
type Summary = Awaited<ReturnType<typeof generateSummary>>

export default function Home() {
	const [summary, setSummary] = useState<Summary | null>(null) // State for the summary
	const [loading, setLoading] = useState(false) // State for loading indicator
  return (
    <main className="mx-auto max-w-2xl pt-8">
      <div className="flex space-x-4 items-center mb-2">
        <h3 className="font-bold">Comments</h3>
        <Button
          variant={"secondary"}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            // generate summary
            setSummary(null); // Clear previous summary
            try {
              // Call the server action
              const result = await generateSummary(messages);
              setSummary(result); // Update state with the result
            } catch (error) {
              // Handle potential errors:
              // - AI might fail schema validation (less likely with good prompts/schemas)
              // - Network issues or API timeouts (especially with very large inputs)
              console.error("Summarization failed:", error);
              // TODO: Add user-friendly error feedback (e.g., toast notification)
            } finally {
              setLoading(false);
            }
          }}
        >
          Summary
        </Button>
      </div>
      {summary && <SummaryCard {...summary} />}
      <MessageList messages={messages} />
    </main>
  );
}
