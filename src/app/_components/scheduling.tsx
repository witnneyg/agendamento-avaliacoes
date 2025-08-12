"use client";

import { useState } from "react";
import { format, set } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Course, CourseSelector } from "./course-selector";
import { TimeSlotPicker } from "./time-slot-picker";
import { BookingForm } from "./booking-form";
import { BookingConfirmation } from "./booking-confirmation";
import { Discipline, DisciplineSelector } from "./discipline-selector";

import { ptBR } from "date-fns/locale";
import { Semester, SemesterSelector } from "./semester-selector";
import { useAppointments } from "../context/appointment";
import { CalendarDate } from "./calendar-date";
import { createScheduling } from "../_actions/create-schedule";

type Step =
  | "course"
  | "discipline"
  | "semester"
  | "date"
  | "time"
  | "details"
  | "confirmation";

type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export function Scheduling() {
  const { addAppointment } = useAppointments();
  const [step, setStep] = useState<Step>("course");
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(
    undefined
  );
  const [selectedSemester, setSelectedSemester] = useState<
    Semester | undefined
  >(undefined);
  const [selectedDiscipline, setSelectedDiscipline] = useState<
    Discipline | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setStep("semester");
  };

  const handleSelectSemester = (semester: any) => {
    setSelectedSemester(semester);
    setStep("discipline");
  };

  const handleDisciplineSelect = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setStep("date");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  function extractTimes(date: Date, timeRange: string) {
    const [startStr, endStr] = timeRange.split(" - ");

    const [startHour, startMinute] = startStr.split(":").map(Number);
    const [endHour, endMinute] = endStr.split(":").map(Number);

    const startTime = set(date, {
      hours: startHour,
      minutes: startMinute,
      seconds: 0,
      milliseconds: 0,
    });
    const endTime = set(date, {
      hours: endHour,
      minutes: endMinute,
      seconds: 0,
      milliseconds: 0,
    });

    return { startTime, endTime };
  }

  const handleCreateScheduling = async (details: BookingDetails) => {
    setBookingDetails(details);

    if (
      selectedCourse &&
      selectedSemester &&
      selectedDate &&
      selectedTime &&
      selectedDiscipline
    ) {
      const { startTime, endTime } = extractTimes(
        new Date(selectedDate),
        selectedTime
      );

      const data = {
        courseName: selectedCourse.name,
        disciplineName: selectedDiscipline.name,
        disciplineId: selectedDiscipline.id,
        semesterName: selectedSemester.name,
        date: new Date(selectedDate),
        startTime,
        endTime,
        details: {
          name: details.name,
          email: details.email,
          phone: details.phone,
          notes: details.notes,
        },
      };

      await createScheduling(data);
    }
    setStep("confirmation");
  };

  const handleReset = () => {
    setStep("course");
    setSelectedCourse(undefined);
    setSelectedDiscipline(undefined);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setBookingDetails(null);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          {step === "course" && "Selecione um curso"}
          {step === "semester" && "Selecione seu periodo"}
          {step === "discipline" && "Selecione uma disciplina"}
          {step === "date" && "Selecione uma data"}
          {step === "time" && "Escolha um horário"}
          {step === "details" && "Seus detalhes"}
          {step === "confirmation" && "Agendamento confirmado"}
        </CardTitle>
        <CardDescription>
          {step === "course" &&
            "Selecione o curso com o qual deseja agendar uma avaliação"}
          {step === "semester" && "Selecione o periodo da sua turma"}
          {step === "discipline" &&
            selectedCourse &&
            `Selecione uma disciplina específica em ${selectedCourse.name}`}
          {step === "date" &&
            selectedCourse &&
            `Disciplina selecionada: ${selectedCourse.name}`}
          {step === "time" &&
            selectedDate &&
            `Data selecionada: ${format(selectedDate, "PPPP", {
              locale: ptBR,
            })}`}
          {step === "details" &&
            selectedTime &&
            `Data selecionada: ${format(selectedDate!, "PPPP", {
              locale: ptBR,
            })} a ${selectedTime} horas`}
          {step === "confirmation" && "Seu agendamento foi agendado"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "course" && (
          <CourseSelector onSelectCourse={handleCourseSelect} />
        )}
        {step === "semester" && selectedCourse && (
          <SemesterSelector
            courseId={selectedCourse.id}
            onSelectSemester={handleSelectSemester}
            onBack={() => setStep("course")}
          />
        )}
        {step === "discipline" && selectedCourse && selectedSemester && (
          <DisciplineSelector
            semesterId={selectedSemester.id}
            onSelectDiscipline={handleDisciplineSelect}
            onBack={() => setStep("semester")}
          />
        )}
        {step === "date" && (
          <CalendarDate
            date={selectedDate}
            onSelectDate={handleDateSelect}
            onBack={() => setStep("discipline")}
          />
        )}
        {step === "time" &&
          selectedDate &&
          selectedCourse &&
          selectedDiscipline && (
            <TimeSlotPicker
              date={selectedDate}
              coursePeriod={selectedCourse.periods}
              disciplineId={selectedDiscipline.id}
              onSelectTime={handleTimeSelect}
              onBack={() => setStep("date")}
            />
          )}
        {step === "details" &&
          selectedDate &&
          selectedTime &&
          selectedCourse && (
            <BookingForm
              onSubmit={handleCreateScheduling}
              courseId={selectedCourse.id}
              onBack={() => setStep("time")}
            />
          )}
        {step === "confirmation" &&
          bookingDetails &&
          selectedDate &&
          selectedTime &&
          selectedCourse &&
          selectedSemester &&
          selectedDiscipline && (
            <BookingConfirmation
              course={selectedCourse}
              semester={selectedSemester}
              discipline={selectedDiscipline}
              date={selectedDate}
              time={selectedTime}
              details={bookingDetails}
              onScheduleAnother={handleReset}
            />
          )}
      </CardContent>
    </Card>
  );
}
