"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import { Period } from "./course-selector";

interface TimeSlotPickerProps {
  date: Date;
  coursePeriod: Period[];
  onSelectTime: (time: string) => void;
  onBack: () => void;
}

const generateTimeSlots = (coursePeriod: string[], date: Date) => {
  let slots: string[] = [];

  const morningSlots = [
    "07:00",
    "07:30",
    "8:00",
    "8:30",
    "9:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
  ];
  const afternoonSlots = [
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];
  const eveningSlots = [
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
  ];

  if (coursePeriod.includes(Period.MORNING)) {
    slots = slots.concat(morningSlots);
  }

  if (coursePeriod.includes(Period.AFTERNOON)) {
    slots = slots.concat(afternoonSlots);
  }
  if (coursePeriod.includes(Period.EVENING)) {
    slots = slots.concat(eveningSlots);
  }

  return slots.map((slot) => ({
    time: slot,
    available: Math.random() > 0.3,
  }));
};

export function TimeSlotPicker({
  date,
  coursePeriod,
  onSelectTime,
  onBack,
}: TimeSlotPickerProps) {
  const timeSlots = generateTimeSlots(coursePeriod, date);
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
                ? "hover:bg-primary/10 cursor-pointer"
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
