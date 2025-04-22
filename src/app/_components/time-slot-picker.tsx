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
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
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
        Voltar ao calendário
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
            {!slot.available && " (Indisponível)"}
          </Button>
        ))}
      </div>
    </div>
  );
}
