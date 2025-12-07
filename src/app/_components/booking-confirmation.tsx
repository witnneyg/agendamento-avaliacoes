"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Course } from "./course-selector";
import { Semester } from "./semester-selector";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { Class, Discipline } from "@prisma/client";
import { getUser } from "../_actions/user/getUser";
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

const formatSemesterNumber = (semesterName: string): string => {
  const numberMatch = semesterName.match(/^(\d+)/);
  if (numberMatch) {
    return `${numberMatch[1]}° período`;
  }

  if (semesterName.match(/Primeiro|primeiro|1/i)) {
    return "1° período";
  } else if (semesterName.match(/Segundo|segundo|2/i)) {
    return "2° período";
  } else if (semesterName.match(/Terceiro|terceiro|3/i)) {
    return "3° período";
  } else if (semesterName.match(/Quarto|quarto|4/i)) {
    return "4° período";
  } else if (semesterName.match(/Quinto|quinto|5/i)) {
    return "5° período";
  } else if (semesterName.match(/Sexto|sexto|6/i)) {
    return "6° período";
  } else if (semesterName.match(/Sétimo|sétimo|7/i)) {
    return "7° período";
  } else if (semesterName.match(/Oitavo|oitavo|8/i)) {
    return "8° período";
  }

  return semesterName;
};

export function BookingConfirmation({
  course,
  semester,
  classes,
  date,
  details,
  discipline,
  onScheduleAnother,
}: BookingConfirmationProps) {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  function handleViewCalendar() {
    router.push("calendar");
  }

  useEffect(() => {
    async function fetchData() {
      const user = await getUser();

      setEmail(user.email);
    }

    fetchData();
  }, []);

  const formattedSemesterNumber = formatSemesterNumber(semester.name);

  return (
    <div className="flex flex-col items-center space-y-6 py-4">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold">
          Seu agendamento está confirmado!
        </h3>
        <p className="text-muted-foreground mt-2">
          {`enviamos um e-mail de confirmação para ${email}`}
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
          <span className="font-medium">Período:</span>
          <span>{formattedSemesterNumber}</span>
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
          <span className="font-medium">Horários:</span>
          <span>{details.time}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Professor:</span>
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
