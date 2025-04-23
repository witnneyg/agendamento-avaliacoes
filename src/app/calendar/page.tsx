"use client";

import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useAppointments } from "../context/appointment";

const getDepartmentColor = (departmentId: string) => {
  const colors: Record<string, string> = {
    itManagement: "bg-teal-500 border-teal-600 text-teal-100",
    medicine: "bg-emerald-500 border-emerald-600 text-emerald-100",
    psychology: "bg-indigo-500 border-indigo-600 text-indigo-100",
    administration: "bg-amber-500 border-amber-600 text-amber-100",
    agronomy: "bg-pink-500 border-pink-600 text-pink-100",
    accounting: "bg-orange-500 border-orange-600 text-orange-100",
    law: "bg-red-500 border-red-600 text-red-100",
    physicalEducation: "bg-yellow-500 border-yellow-600 text-yellow-100",
    nursing: "bg-lime-500 border-lime-600 text-lime-100",
    civilEngineering: "bg-blue-500 border-blue-600 text-blue-100",
    physiotherapy: "bg-cyan-500 border-cyan-600 text-cyan-100",
    literature: "bg-purple-500 border-purple-600 text-purple-100",
    veterinary: "bg-gray-500 border-brown-600 text-brown-100",
    dentistry: "bg-gray-500 border-gray-600 text-gray-100",
    pedagogy: "bg-green-500 border-green-600 text-green-100",
  };
  return colors[departmentId] || "bg-gray-500 border-gray-500 text-gray-800";
};

const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

export default function CalendarPage() {
  const { appointments, removeAppointment } = useAppointments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleDepartments, setVisibleDepartments] = useState<
    Record<string, boolean>
  >(
    academicCourses.reduce((acc, course) => ({ ...acc, [course.id]: true }), {})
  );
  const [view, setView] = useState<"week" | "day">("week");
  const router = useRouter();
  const daysToShow = view === "week" ? 7 : 1;
  const startDate =
    view === "week"
      ? startOfWeek(currentDate, { weekStartsOn: 0 })
      : currentDate;
  const days = Array.from({ length: daysToShow }, (_, i) =>
    addDays(startDate, i)
  );
  const filteredAppointments = appointments.filter(
    (appointment) => visibleDepartments[appointment.course.id]
  );

  const navigatePrevious = () => {
    setCurrentDate((prev) => addDays(prev, view === "week" ? -7 : -1));
  };

  const navigateNext = () => {
    setCurrentDate((prev) => addDays(prev, view === "week" ? 7 : 1));
  };

  const toggleDepartment = (departmentId: string) => {
    setVisibleDepartments((prev) => ({
      ...prev,
      [departmentId]: !prev[departmentId],
    }));
  };

  const handleNewAppointment = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <aside className="w-72 border-r p-4 flex flex-col overflow-y-auto">
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
                    id={course.id}
                    checked={visibleDepartments[course.id]}
                    onCheckedChange={() => toggleDepartment(course.id)}
                  />
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full flex-shrink-0",
                      getDepartmentColor(course.id)
                    )}
                  />
                  <label
                    htmlFor={course.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {course.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
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

          <div className="flex-1 overflow-y-auto h-full">
            <div className="flex h-full">
              <div className="w-16 flex-shrink-0 border-r">
                <div className="h-12 border-b"></div> {/* Header spacer */}
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-20 border-b relative">
                    <span className="absolute -top-2 right-2 text-xs text-gray-500">
                      {String(hour).padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex">
                {days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="flex-1 min-w-[120px] border-r "
                  >
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
                              const [hourStr] = appointment.time.split(":");
                              const appointmentHour = Number.parseInt(
                                hourStr,
                                10
                              );

                              return (
                                isSameDay(appointmentDate, day) &&
                                appointmentHour === hour
                              );
                            })
                            .map((appointment) => {
                              const [hourStr, minuteStr] =
                                appointment.time.split(":");
                              const hour = Number.parseInt(hourStr, 10);
                              const minute = Number.parseInt(minuteStr, 10);
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
                                        {appointment.discipline.title}
                                      </div>
                                      <div className="text-xs truncate">
                                        {appointment.details.name}
                                      </div>
                                      <div className="text-xs truncate">
                                        {appointment.time}
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
                                            Excluir Agendamento
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Tem certeza de que deseja excluir
                                            este agendamento? Essa ação não
                                            poderá ser desfeita.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Manter Agendamento
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-red-500 hover:bg-red-600"
                                            onClick={() =>
                                              removeAppointment(appointment.id)
                                            }
                                          >
                                            Excluir Agendamento
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
