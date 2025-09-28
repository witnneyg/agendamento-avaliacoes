"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SchedulingWithRelations } from "../calendar/page";
import { CalendarDate } from "./calendar-date";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";

interface EditAppointmentModalProps {
  appointment: SchedulingWithRelations;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAppointment: Partial<SchedulingWithRelations>) => void;
}

export const EditSchedulingModal = ({
  appointment,
  isOpen,
  onClose,
  onSave,
}: EditAppointmentModalProps) => {
  const [formData, setFormData] = useState({
    name: appointment.name,
    notes: appointment.notes || "",
    startTime: new Date(appointment.startTime).toISOString().slice(0, 16),
    endTime: new Date(appointment.endTime).toISOString().slice(0, 16),
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSave = () => {
    onSave({
      ...appointment,
      name: formData.name,
      notes: formData.notes,
      startTime: new Date(formData.startTime),
      endTime: new Date(formData.endTime),
    });
    onClose();
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Agendamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Professor
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <Label htmlFor="name" className="text-right">
            Calendário
          </Label>
          <div className="flex flex-col items-center justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) =>
                date < new Date() || date.getDay() === 0 || date.getDay() === 6
              }
              locale={ptBR}
              className="rounded-md border mt-2"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Anotações
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
