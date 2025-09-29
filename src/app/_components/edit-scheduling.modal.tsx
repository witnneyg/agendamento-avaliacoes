"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { SchedulingWithRelations } from "../calendar/page";
import { generateTimeSlotsAndCheckAvailability } from "./booking-form";

interface EditAppointmentModalProps {
  appointment: SchedulingWithRelations;
  scheduledTimes: SchedulingWithRelations[];
  timePeriodId: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAppointments: Partial<SchedulingWithRelations>[]) => void;
}

export const EditSchedulingModal = ({
  appointment,
  scheduledTimes,
  timePeriodId,
  isOpen,
  onClose,
  onSave,
}: EditAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    name: appointment.name,
    time: [
      format(new Date(appointment.startTime), "HH:mm") +
        " - " +
        format(new Date(appointment.endTime), "HH:mm"),
    ],
  });

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(appointment.startTime)
  );

  const [timeSlots, setTimeSlots] = useState<
    { time: string; available: boolean }[]
  >([]);

  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlotsAndCheckAvailability(
        selectedDate,
        scheduledTimes,
        timePeriodId
      );
      setTimeSlots(slots);
    }
  }, [selectedDate, scheduledTimes, timePeriodId]);

  const handleTimeSelect = (time: string) => {
    setFormData((prev) => {
      if (prev.time.includes(time)) {
        return { ...prev, time: prev.time.filter((t) => t !== time) };
      } else {
        return { ...prev, time: [...prev.time, time] };
      }
    });
  };

  const handleSave = () => {
    const updatedAppointments = formData.time.map((slot) => {
      const [startStr, endStr] = slot.split(" - ");
      const startTime = new Date(selectedDate);
      const endTime = new Date(selectedDate);

      const [startHour, startMinute] = startStr.split(":").map(Number);
      const [endHour, endMinute] = endStr.split(":").map(Number);

      startTime.setHours(startHour, startMinute);
      endTime.setHours(endHour, endMinute);

      return {
        ...appointment,
        startTime,
        endTime,
        date: selectedDate,
      };
    });

    onSave(updatedAppointments);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label>Selecione a data</Label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(day) => day && setSelectedDate(day)}
            disabled={(date) =>
              date < new Date() || date.getDay() === 0 || date.getDay() === 6
            }
            locale={ptBR}
            className="rounded-md border mt-2"
          />
        </div>

        <div className="grid gap-2 mt-4">
          <Label>Horários</Label>
          <div className="grid grid-cols-2 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot.time}
                type="button"
                variant={
                  formData.time.includes(slot.time) ? "default" : "outline"
                }
                disabled={!slot.available}
                className={
                  slot.available
                    ? "cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                }
                onClick={() => slot.available && handleTimeSelect(slot.time)}
              >
                {slot.time}
                {!slot.available && " (Indisponível)"}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
