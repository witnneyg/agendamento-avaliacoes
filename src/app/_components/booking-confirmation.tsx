"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Course } from "./course-selector";
import { Semester } from "./semester-selector";
import { Discipline } from "./discipline-selector";
import { ptBR } from "date-fns/locale";

interface BookingConfirmationProps {
  course: Course;
  semester: Semester;
  date: Date;
  time: string;
  details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  discipline: Discipline;
  onScheduleAnother: () => void;
}

export function BookingConfirmation({
  course,
  semester,
  date,
  time,
  details,
  discipline,
  onScheduleAnother,
}: BookingConfirmationProps) {
  // In a real app, you would save this data to your backend

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold">
          Seu agendamento está confirmado!
        </h3>
        <p className="text-muted-foreground mt-2">
          enviamos um e-mail de confirmação para {details.email}
        </p>
      </div>

      <div className="w-full max-w-md bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Curso:</span>
          <span>{course.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Semestre:</span>
          <span>{semester.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Disciplina:</span>
          <span>{discipline.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Data:</span>
          <span>{format(date, "PPPP", { locale: ptBR })}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Horas:</span>
          <span>{time}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Nome:</span>
          <span>{details.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Telefone:</span>
          <span>{details.phone}</span>
        </div>
        {details.notes && (
          <div className="pt-2 border-t">
            <span className="font-medium">Anotações:</span>
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
          Agendar outro
        </Button>
        <Button className="flex-1">Adicionar ao calendário</Button>
      </div>
    </div>
  );
}
