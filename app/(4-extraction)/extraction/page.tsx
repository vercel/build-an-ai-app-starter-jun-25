"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarAppointment } from "./calendar-appointment";
// Import the action AND the type
import { extractAppointment } from './actions'
import { type AppointmentDetails } from './schemas'

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppointment(null) // Clear previous results
    const formData = new FormData(e.target as HTMLFormElement)
    const input = formData.get('appointment') as string

    try {
      // Call the server action - the result is automatically typed!
      const result: AppointmentDetails = await extractAppointment(input)
      setAppointment(result) // Update state with structured data
    } catch (error) {
      console.error('Extraction failed:', error)
      // TODO: Show error to user
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Extract Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="appointment"
                placeholder="Enter appointment details..."
                className="w-full"
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Extracting..." : "Extract Appointment"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <CalendarAppointment appointment={appointment} />
      </div>
    </div>
  );
}
