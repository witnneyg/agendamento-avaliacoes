"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Course } from "./course-selector";

interface BookingConfirmationProps {
  course: Course;
  date: Date;
  time: string;
  details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  onScheduleAnother: () => void;
}

export function BookingConfirmation({
  course,
  date,
  time,
  details,
  onScheduleAnother,
}: BookingConfirmationProps) {
  // In a real app, you would save this data to your backend

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold">
          Your appointment is confirmed!
        </h3>
        <p className="text-muted-foreground mt-2">
          we ve sent a confirmation email to {details.email}
        </p>
      </div>

      <div className="w-full max-w-md bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Department:</span>
          <span>{course.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Date:</span>
          <span>{format(date, "PPPP")}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Time:</span>
          <span>{time}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Name:</span>
          <span>{details.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Phone:</span>
          <span>{details.phone}</span>
        </div>
        {details.notes && (
          <div className="pt-2 border-t">
            <span className="font-medium">Notes:</span>
            <p className="mt-1 text-sm">{details.notes}</p>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onScheduleAnother}
        >
          Schedule Another
        </Button>
        <Button className="flex-1">Add to Calendar</Button>
      </div>
    </div>
  );
}
