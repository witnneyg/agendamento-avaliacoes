"use client";

import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useAppointments } from "@/context/appointment-context";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { academicCourses } from "../mocks";
import { NavBar } from "../_components/navbar";
import { ptBR } from "date-fns/locale";

// Function to get color for each department
const getDepartmentColor = (departmentId: string) => {
  const colors: Record<string, string> = {
    cs: "bg-blue-100 border-blue-500 text-blue-800",
    medicine: "bg-green-100 border-green-500 text-green-800",
    math: "bg-purple-100 border-purple-500 text-purple-800",
    biology: "bg-yellow-100 border-yellow-500 text-yellow-800",
    psychology: "bg-pink-100 border-pink-500 text-pink-800",
    geography: "bg-orange-100 border-orange-500 text-orange-800",
  };
  return colors[departmentId] || "bg-gray-100 border-gray-500 text-gray-800";
};

// Time slots for the calendar
const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

export default function CalendarPage() {
  // const { appointments, removeAppointment } = useAppointments();
  const appointments = [
    {
      id: "1",
      course: {
        id: "course-1",
        name: "Engenharia de Software",
      },
      semester: {
        id: "sem-1",
        name: "1º Semestre de 2025",
      },
      discipline: {
        id: "disc-1",
        name: "Programação Orientada a Objetos",
      },
      date: new Date("2025-05-10"),
      time: "10:00",
      details: {
        name: "João da Silva",
        email: "joao@example.com",
        phone: "11999999999",
        notes: "Gostaria de discutir o projeto final.",
      },
    },
    {
      id: "2",
      course: {
        id: "course-2",
        name: "Ciência da Computação",
      },
      semester: {
        id: "sem-2",
        name: "2º Semestre de 2025",
      },
      discipline: {
        id: "disc-2",
        name: "Estrutura de Dados",
      },
      date: new Date("2025-05-12"),
      time: "14:30",
      details: {
        name: "Maria Oliveira",
        email: "maria@example.com",
        phone: "21988888888",
        notes: "Precisa de ajuda com a atividade da semana.",
      },
    },
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleDepartments, setVisibleDepartments] = useState<
    Record<string, boolean>
  >(
    academicCourses.reduce((acc, course) => ({ ...acc, [course.id]: true }), {})
  );
  const [view, setView] = useState<"week" | "day">("week");
  const router = useRouter();

  // Calculate the days to display based on the current view
  const daysToShow = view === "week" ? 7 : 1;
  const startDate =
    view === "week"
      ? startOfWeek(currentDate, { weekStartsOn: 0 })
      : currentDate;

  const days = Array.from({ length: daysToShow }, (_, i) =>
    addDays(startDate, i)
  );

  // Filter appointments based on visible departments
  const filteredAppointments = appointments.filter(
    (appointment) => visibleDepartments[appointment.course.id]
  );

  // Navigate to previous/next week or day
  const navigatePrevious = () => {
    setCurrentDate((prev) => addDays(prev, view === "week" ? -7 : -1));
  };

  const navigateNext = () => {
    setCurrentDate((prev) => addDays(prev, view === "week" ? 7 : 1));
  };

  // Toggle department visibility
  const toggleDepartment = (departmentId: string) => {
    setVisibleDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  // Handle new appointment
  const handleNewAppointment = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 border-r p-4 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="mb-6">
            <Button
              onClick={handleNewAppointment}
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>

          <div className="mb-6">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={(date) => date && setCurrentDate(date)}
              className="rounded-md border"
              locale={ptBR}
            />
          </div>

          <div>
            <h3 className="font-medium mb-4">Cursos</h3>
            <div className="space-y-2">
              {academicCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${course.id}`}
                    checked={visibleDepartments[course.id]}
                    onCheckedChange={() => toggleDepartment(course.id)}
                  />
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      getDepartmentColor(course.id)
                        .split(" ")[1]
                        .replace("border", "bg")
                    )}
                  />
                  <label
                    htmlFor={`dept-${course.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {course.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold ml-2">
                {view === "week"
                  ? `${format(days[0], "MMMM d", { locale: ptBR })} - ${format(
                      days[days.length - 1],
                      "MMMM d, yyyy",
                      { locale: ptBR }
                    )}`
                  : format(currentDate, "MMMM d, yyyy", { locale: ptBR })}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
              >
                Dia
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
              >
                Semana
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="flex h-full">
              <div className="w-16 flex-shrink-0 border-r">
                <div className="h-12 border-b"></div> {/* Header spacer */}
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-20 border-b relative">
                    <span className="absolute -top-2 right-2 text-xs text-gray-500">
                      {hour % 12 === 0 ? 12 : hour % 12}{" "}
                      {hour < 12 ? "AM" : "PM"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex">
                {days.map((day, dayIndex) => (
                  <div key={dayIndex} className="flex-1 min-w-[120px] border-r">
                    {/* Day header */}
                    <div className="h-12 border-b flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500">
                        {format(day, "EEE", { locale: ptBR })}
                      </div>
                      <div
                        className={cn(
                          "flex items-center justify-center w-8 h-8 rounded-full mt-1",
                          isSameDay(day, new Date())
                            ? "bg-primary text-primary-foreground"
                            : ""
                        )}
                      >
                        {format(day, "d", { locale: ptBR })}
                      </div>
                    </div>

                    <div>
                      {timeSlots.map((hour) => (
                        <div key={hour} className="h-20 border-b relative">
                          {/* Render appointments for this day and hour */}
                          {filteredAppointments
                            .filter((appointment) => {
                              const appointmentDate = appointment.date;
                              const appointmentHour = Number.parseInt(
                                appointment.time.split(":")[0]
                              );
                              const isPM =
                                appointment.time.includes("PM") &&
                                appointmentHour !== 12;
                              const hour24 = isPM
                                ? appointmentHour + 12
                                : appointmentHour;

                              return (
                                isSameDay(appointmentDate, day) &&
                                hour24 === hour
                              );
                            })
                            .map((appointment) => {
                              const timeMatch =
                                appointment.time.match(/(\d+):(\d+) (AM|PM)/);
                              if (!timeMatch) return null;

                              const [_, hourStr, minuteStr, ampm] = timeMatch;
                              let hour = Number.parseInt(hourStr);
                              if (ampm === "PM" && hour !== 12) hour += 12;
                              if (ampm === "AM" && hour === 12) hour = 0;

                              const minute = Number.parseInt(minuteStr);
                              const topOffset = (minute / 60) * 100;

                              return (
                                <div
                                  key={appointment.id}
                                  className={cn(
                                    "absolute left-0 right-0 mx-1 p-2 rounded border-l-4 overflow-hidden",
                                    getDepartmentColor(appointment.course.id)
                                  )}
                                  style={{
                                    top: `${topOffset}%`,
                                    height: "calc(100% - 4px)",
                                  }}
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="overflow-hidden">
                                      <div className="font-medium text-xs truncate">
                                        {/* {appointment.discipline.title} */}
                                        {"title"}
                                      </div>
                                      <div className="text-xs truncate">
                                        {/* {appointment.details.name} */}
                                        {"name"}
                                      </div>
                                    </div>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-5 w-5 text-red-500 hover:text-red-600 -mt-1 -mr-1"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Cancel Appointment
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to cancel this
                                            appointment? This action cannot be
                                            undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Keep Appointment
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600"
                                            // onClick={() =>
                                            //   removeAppointment(appointment.id)
                                            // }
                                          >
                                            Cancel Appointment
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
