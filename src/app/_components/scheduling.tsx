"use client";
import { useEffect, useState } from "react";
import { format, parse } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course, CourseSelector } from "./course-selector";
import { BookingForm } from "./booking-form";
import { BookingConfirmation } from "./booking-confirmation";
import { DisciplineSelector } from "./discipline-selector";

import { ptBR } from "date-fns/locale";
import { Semester, SemesterSelector } from "./semester-selector";
import { useAppointments } from "../context/appointment";
import { CalendarDate } from "./calendar-date";
import { createScheduling } from "../_actions/create-schedule";
import { TimePeriod, TimePeriodSelector } from "./time-period.selector";
import { timePeriods } from "../mocks";
import { getUser } from "../_actions/getUser";
import { Class, Discipline, User } from "@prisma/client";
import { ClassSelector } from "./class-selector";

type Step =
  | "course"
  | "period"
  | "class"
  | "timePeriod"
  | "discipline"
  | "date"
  | "details"
  | "confirmation";

type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  time: string;
};

export function Scheduling() {
  const { addAppointment } = useAppointments();
  const [step, setStep] = useState<Step>("course");
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(
    undefined
  );
  const [selectedClass, setSelectedClass] = useState<Class | undefined>(
    undefined
  );
  const [selectedSemester, setSelectedSemester] = useState<
    Semester | undefined
  >(undefined);
  const [selectedDiscipline, setSelectedDiscipline] = useState<
    Discipline | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [user, setUser] = useState<Omit<User, "emailVerified"> | undefined>(
    undefined
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<
    TimePeriod | undefined
  >(undefined);
  console.log(selectedTimePeriod);

  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setStep("period");
  };
  const handleSelectSemester = (semester: any) => {
    setSelectedSemester(semester);
    setStep("class");
  };

  const handleSelecteClass = (classes: Class) => {
    setSelectedClass(classes);
    setStep("timePeriod");
  };

  const handleTimePeriodSelect = (timePeriod: TimePeriod) => {
    setSelectedTimePeriod(timePeriod);
    setStep("discipline");
  };
  const handleDisciplineSelect = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setStep("date");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep("details");
    }
  };

  useEffect(() => {
    async function fetch() {
      const data = await getUser();

      setUser(data);
    }

    fetch();
  }, []);

  const handleCreateScheduling = async (details: BookingDetails) => {
    setBookingDetails(details);

    const slots = details.time.split(",").map((slot) => slot.trim());

    for (const slot of slots) {
      const [startStr, endStr] = slot.split(" - ");

      const startTime = parse(
        `${selectedDate!.toISOString().split("T")[0]} ${startStr}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );
      const endTime = parse(
        `${selectedDate!.toISOString().split("T")[0]} ${endStr}`,
        "yyyy-MM-dd HH:mm",
        new Date()
      );

      if (
        selectedCourse &&
        selectedSemester &&
        selectedDate &&
        selectedClass &&
        user &&
        selectedDiscipline
      ) {
        const data = {
          userId: user.id,
          courseId: selectedCourse.id,
          disciplineId: selectedDiscipline.id,
          semesterId: selectedSemester.id,
          classId: selectedClass.id,
          date: new Date(selectedDate),
          startTime,
          endTime,
          details: {
            name: details.name,
            email: details.email,
            phone: details.phone,
            notes: details.notes,
            time: details.time,
          },
        };

        await createScheduling(data);
      }
      setStep("confirmation");
    }
  };

  const handleReset = () => {
    setStep("course");
    setSelectedCourse(undefined);
    setSelectedDiscipline(undefined);
    setSelectedDate(undefined);
    setBookingDetails(null);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          {step === "course" && "Selecione um curso"}
          {step === "period" && "Selecione seu periodo"}
          {step === "class" && "Selecione sua turma"}
          {step === "discipline" && "Selecione uma disciplina"}
          {step === "date" && "Selecione uma data"}
          {step === "timePeriod" && "Selecione um período"}
          {step === "details" && "Seus detalhes"}
          {step === "confirmation" && "Agendamento confirmado"}
        </CardTitle>
        <CardDescription>
          {step === "course" &&
            "Selecione o curso com o qual deseja agendar uma avaliação"}
          {step === "period" && "Selecione o periodo da sua turma"}
          {step === "class" && "Selecione sua turma do agendamento"}
          {step === "discipline" &&
            selectedCourse &&
            `Selecione uma disciplina específica em ${selectedCourse.name}`}
          {step === "date" &&
            selectedCourse &&
            `Disciplina selecionada: ${selectedCourse.name}`}
          {step === "details" &&
            `Data selecionada: ${format(selectedDate!, "PPPP", {
              locale: ptBR,
            })} a ${bookingDetails?.time} horas`}
          {step === "confirmation" && "Seu agendamento foi agendado"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "course" && (
          <CourseSelector onSelectCourse={handleCourseSelect} />
        )}
        {step === "period" && selectedCourse && (
          <SemesterSelector
            courseId={selectedCourse.id}
            onSelectSemester={handleSelectSemester}
            onBack={() => setStep("course")}
          />
        )}
        {step === "class" && selectedSemester && (
          <ClassSelector
            semesterId={selectedSemester.id}
            onSelectClass={handleSelecteClass}
            onBack={() => setStep("period")}
          />
        )}
        {step === "timePeriod" && selectedCourse && (
          <TimePeriodSelector
            coursePeriod={selectedCourse?.periods}
            timePeriods={timePeriods}
            onSelectTimePeriod={handleTimePeriodSelect}
            onBack={() => setStep("class")}
          />
        )}
        {step === "discipline" &&
          selectedCourse &&
          selectedSemester &&
          selectedTimePeriod && (
            <DisciplineSelector
              timePeriod={selectedTimePeriod}
              semesterId={selectedSemester.id}
              onSelectDiscipline={handleDisciplineSelect}
              onBack={() => setStep("timePeriod")}
            />
          )}
        {step === "date" && (
          <CalendarDate
            date={selectedDate}
            onSelectDate={handleDateSelect}
            onBack={() => setStep("discipline")}
          />
        )}
        {step === "details" &&
          selectedCourse &&
          selectedSemester &&
          selectedDate &&
          selectedTimePeriod && (
            <BookingForm
              onSubmit={handleCreateScheduling}
              courseId={selectedCourse.id}
              date={selectedDate}
              timePeriodId={selectedTimePeriod.id}
              semesterId={selectedSemester.id}
              onBack={() => setStep("date")}
            />
          )}
        {step === "confirmation" &&
          bookingDetails &&
          selectedDate &&
          selectedClass &&
          selectedCourse &&
          selectedSemester &&
          selectedDiscipline && (
            <BookingConfirmation
              course={selectedCourse}
              classes={selectedClass}
              semester={selectedSemester}
              discipline={selectedDiscipline}
              date={selectedDate}
              details={bookingDetails}
              onScheduleAnother={handleReset}
            />
          )}
      </CardContent>
    </Card>
  );
}
