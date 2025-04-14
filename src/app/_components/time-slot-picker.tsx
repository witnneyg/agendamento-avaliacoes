"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface TimeSlotPickerProps {
  date: Date;
  onSelectTime: (time: string) => void;
  onBack: () => void;
}

const generateTimeSlots = (date: Date) => {
  console.log(date);
  const slots = [
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  return slots.map((slot) => ({
    time: slot,
    available: Math.random() > 0.3,
  }));
};

export function TimeSlotPicker({
  date,
  onSelectTime,
  onBack,
}: TimeSlotPickerProps) {
  const timeSlots = generateTimeSlots(date);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to calendar
      </Button>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {timeSlots.map((slot, index) => (
          <Button
            key={index}
            variant={slot.available ? "outline" : "ghost"}
            className={
              slot.available
                ? "hover:bg-primary/10"
                : "opacity-50 cursor-not-allowed"
            }
            disabled={!slot.available}
            onClick={() => slot.available && onSelectTime(slot.time)}
          >
            {slot.time}
            {!slot.available && " (Unavailable)"}
          </Button>
        ))}
      </div>
    </div>
  );
}
