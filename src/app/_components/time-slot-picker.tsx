"use client";

import { Button } from "@/components/ui/button";

import { ChevronLeft } from "lucide-react";
import { Scheduling } from "@prisma/client";
import { useEffect, useState } from "react";
import { getSchedulingById } from "../_actions/scheduling/get-scheduling-by-id";
import { format, isSameDay } from "date-fns";
interface TimeSlotPickerProps {
  date: Date;
  disciplineId: string;
  onSelectTime: (time: string) => void;
  timePeriodId: string;
  onBack: () => void;
}

const generateTimeSlotsAndCheeckAvailability = (
  date: Date,
  scheduledTimes: Scheduling[] = [],
  timePeriodId: string
) => {
  let slots: string[] = [];

  const morningSlots = [
    "07:30 - 08:20",
    "08:20 - 09:10",
    "09:40 - 10:30",
    "10:30 - 11:20",
  ];

  const afternoonSlots = [
    "13:00 - 13:50",
    "13:50 - 14:40",
    "14:40 - 15:30",
    "15:30 - 16:20",
    "16:30 - 17:20",
    "17:20 - 18:10",
    "18:10 - 19:00",
  ];

  const eveningSlots = [
    "19:00 - 19:50",
    "19:50 - 20:40",
    "21:00 - 21:50",
    "21:50 - 22:40",
  ];

  if (timePeriodId === "morning") {
    slots = morningSlots;
  } else if (timePeriodId === "afternoon") {
    slots = afternoonSlots;
  } else if (timePeriodId === "evening") {
    slots = eveningSlots;
  }
  return slots.map((slot) => {
    const [startStr, endStr] = slot.split(" - ");

    const isTaken = scheduledTimes.some((s) => {
      return (
        isSameDay(new Date(s.date), date) &&
        format(new Date(s.startTime), "HH:mm") === startStr &&
        format(new Date(s.endTime), "HH:mm") === endStr
      );
    });

    return {
      time: slot,
      available: !isTaken,
    };
  });
};

export function TimeSlotPicker({
  date,
  disciplineId,
  timePeriodId,
  onSelectTime,
  onBack,
}: TimeSlotPickerProps) {
  const [schedulingTimes, setSchedulingTimes] = useState<Scheduling[]>();
  const timeSlots = generateTimeSlotsAndCheeckAvailability(
    date,
    schedulingTimes,
    timePeriodId
  );
  useEffect(() => {
    async function fetch() {
      const data = await getSchedulingById(disciplineId);

      setSchedulingTimes(data);
    }

    fetch();
  }, [disciplineId]);

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
