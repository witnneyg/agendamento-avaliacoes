"use client";

import { Button } from "@/components/ui/button";

import { ChevronLeft } from "lucide-react";
import { Period, Scheduling } from "@prisma/client";
import { useEffect, useState } from "react";
import { getSchedulingTime } from "../_actions/get-scheduling-time";
import { format, isSameDay } from "date-fns";
import { Item } from "@radix-ui/react-select";
import { ptBR } from "date-fns/locale";
interface TimeSlotPickerProps {
  date: Date;
  coursePeriod: Period[];
  disciplineId: string;
  onSelectTime: (time: string) => void;
  onBack: () => void;
}

const generateTimeSlots = (
  coursePeriod: string[],
  date: Date,
  scheduledTimes: Scheduling[] = []
) => {
  let slots: string[] = [];

  const morningSlots = [
    "07:00 - 07:30",
    "08:00 - 08:30",
    "08:30 - 09:00",
    "09:00 - 09:30",
    "09:30 - 10:00",
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
  ];
  const afternoonSlots = [
    "13:00 - 13:30",
    "13:30 - 14:00",
    "14:00 - 14:30",
    "14:30 - 15:00",
    "15:00 - 15:30",
    "15:30 - 16:00",
    "16:00 - 16:30",
    "16:30 - 17:00",
    "17:00 - 17:30",
    "17:30 - 18:00",
  ];

  const eveningSlots = [
    "18:00 - 18:30",
    "18:30 - 19:00",
    "19:00 - 19:30",
    "19:30 - 20:00",
    "20:00 - 20:30",
    "20:30 - 21:00",
    "21:00 - 21:30",
    "21:30 - 22:00",
    "22:00 - 22:30",
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
  coursePeriod,
  disciplineId,
  onSelectTime,
  onBack,
}: TimeSlotPickerProps) {
  const [schedulingTimes, setSchedulingTimes] = useState<Scheduling[]>();
  const timeSlots = generateTimeSlots(coursePeriod, date, schedulingTimes);

  useEffect(() => {
    async function fetch() {
      const data = await getSchedulingTime(disciplineId);
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
