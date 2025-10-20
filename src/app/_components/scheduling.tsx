"use client";
import { useEffect, useState } from "react";
import { parse } from "date-fns";
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
import { Semester, SemesterSelector } from "./semester-selector";
import { useAppointments } from "../context/appointment";
import { createScheduling } from "../_actions/create-schedule";
import { TimePeriod } from "./time-period.selector";
import { getUser } from "../_actions/getUser";
import { Class, Discipline, User } from "@prisma/client";
import { ClassSelector } from "./class-selector";
import { sendSchedulingEmail } from "../_actions/send-scheduling-email";

type Step =
  | "course"
  | "period"
  | "class"
  | "discipline"
  | "details"
  | "confirmation";

type BookingDetails = {
  name: string;
  time: string;
  date: Date;
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
  const [user, setUser] = useState<Omit<User, "emailVerified"> | undefined>(
    undefined
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<
    TimePeriod | undefined
  >(undefined);

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
    setStep("discipline");
  };

  const handleDisciplineSelect = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setStep("details");
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

    let earliestStartTime: Date | null = null;
    let latestEndTime: Date | null = null;

    for (const slot of slots) {
      const [startStr, endStr] = slot.split(" - ");

      const startTime = parse(startStr, "HH:mm", new Date(details.date));
      const endTime = parse(endStr, "HH:mm", new Date(details.date));

      if (!earliestStartTime || startTime < earliestStartTime) {
        earliestStartTime = startTime;
      }

      if (!latestEndTime || endTime > latestEndTime) {
        latestEndTime = endTime;
      }
    }

    if (
      selectedCourse &&
      selectedSemester &&
      details.date &&
      selectedClass &&
      user &&
      selectedDiscipline &&
      earliestStartTime &&
      latestEndTime
    ) {
      const data = {
        userId: user.id,
        courseId: selectedCourse.id,
        disciplineId: selectedDiscipline.id,
        semesterId: selectedSemester.id,
        classId: selectedClass.id,
        date: new Date(details.date),
        startTime: earliestStartTime,
        endTime: latestEndTime,
        timeSlots: details.time,
        details: {
          name: details.name,
          time: details.time,
          timeSlots: slots,
        },
      };

      await createScheduling(data);
      await sendSchedulingEmail({
        to: user!.email as string,
        name: details.name,
        date: details.date,
        time: details.time,
      });
    }

    setStep("confirmation");
  };

  const handleReset = () => {
    setStep("course");
    setSelectedCourse(undefined);
    setSelectedDiscipline(undefined);
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
          {step === "details" && "Selecione data e horário"}
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
          {step === "details" && `Complete os detalhes do seu agendamento`}
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

        {step === "discipline" && selectedClass && selectedSemester && (
          <DisciplineSelector
            classId={selectedClass.id}
            semesterId={selectedSemester.id}
            onSelectDiscipline={handleDisciplineSelect}
            onBack={() => setStep("class")}
          />
        )}
        {step === "details" &&
          selectedCourse &&
          selectedSemester &&
          selectedClass &&
          selectedDiscipline && (
            <BookingForm
              onSubmit={handleCreateScheduling}
              courseId={selectedCourse.id}
              semesterId={selectedSemester.id}
              classId={selectedClass.id}
              disciplineId={selectedDiscipline.id}
              onBack={() => setStep("discipline")}
            />
          )}
        {step === "confirmation" &&
          bookingDetails &&
          selectedClass &&
          selectedCourse &&
          selectedSemester &&
          selectedDiscipline && (
            <BookingConfirmation
              course={selectedCourse}
              classes={selectedClass}
              semester={selectedSemester}
              discipline={selectedDiscipline}
              date={bookingDetails.date} // Use a data do bookingDetails
              details={bookingDetails}
              onScheduleAnother={handleReset}
            />
          )}
      </CardContent>
    </Card>
  );
}
