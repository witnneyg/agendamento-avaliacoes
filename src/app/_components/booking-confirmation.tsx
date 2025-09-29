"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Course } from "./course-selector";
import { Semester } from "./semester-selector";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Class, Discipline } from "@prisma/client";
import { getUser } from "../_actions/getUser";
import { useEffect, useState } from "react";

interface BookingConfirmationProps {
  course: Course;
  classes: Class;
  semester: Semester;
  date: Date;
  details: {
    name: string;
    time: string;
  };
  discipline: Discipline;
  onScheduleAnother: () => void;
}
export function BookingConfirmation({
  course,
  semester,
  classes,
  date,
  details,
  discipline,
  onScheduleAnother,
}: BookingConfirmationProps) {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  function handleViewCalendar() {
    router.push("calendar");
  }

  useEffect(() => {
    async function fetchData() {
      const { email } = await getUser();

      setUser(email);
    }
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold">
          Seu agendamento está confirmado!
        </h3>
        <p className="text-muted-foreground mt-2">
          enviamos um e-mail de confirmação para {}
        </p>
      </div>

      <div className="w-full max-w-md bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="font-medium">Curso:</span>
          <span>{course.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Turma:</span>
          <span>{classes.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Semestre:</span>
          <span>{semester.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Disciplina:</span>
          <span>{discipline.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Data:</span>
          <span>{format(date, "PPPP", { locale: ptBR })}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Horas:</span>
          <span>{details.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Nome:</span>
          <span>{details.name}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer"
          onClick={onScheduleAnother}
        >
          Agendar outro
        </Button>

        <Button
          variant="default"
          className="cursor-pointer"
          onClick={handleViewCalendar}
        >
          Ver meu calendário
        </Button>
      </div>
    </div>
  );
}
