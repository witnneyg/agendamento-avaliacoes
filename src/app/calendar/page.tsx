"use client";

import { useEffect, useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit,
  X,
  CalendarXIcon as Calendar1Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { NavBar } from "../_components/navbar";
import { ptBR } from "date-fns/locale";
import { getCourses } from "../_actions/get-courses";
import { getScheduling } from "../_actions/get-scheduling";
import { deleteSchedule } from "../_actions/delete-schedule";
import type { Scheduling, Course, Semester, Discipline } from "@prisma/client";

export type SchedulingWithRelations = Scheduling & {
  course: Course;
  semester: Semester;
  discipline: Discipline;
};

const mockSession = {
  user: {
    id: "user1",
    name: "Usuário Demo",
    email: "demo@example.com",
  },
};

const getDepartmentColor = (departmentId: string) => {
  const colors: Record<string, string> = {
    "Gestão da Tecnologia da Informação":
      "bg-teal-500 border-teal-600 text-teal-100",
    Medicina: "bg-emerald-500 border-emerald-600 text-emerald-100",
    Psicologia: "bg-indigo-500 border-indigo-600 text-indigo-100",
    Administração: "bg-amber-500 border-amber-600 text-amber-100",
    Agronomia: "bg-pink-500 border-pink-600 text-pink-100",
    Contabilidade: "bg-orange-500 border-orange-600 text-orange-100",
    Direito: "bg-red-500 border-red-600 text-red-100",
    "Educação Física": "bg-yellow-500 border-yellow-600 text-yellow-100",
    Enfermagem: "bg-lime-500 border-lime-600 text-lime-100",
    "Engenharia Civil": "bg-blue-500 border-blue-600 text-blue-100",
    Fisioterapia: "bg-cyan-500 border-cyan-600 text-cyan-100",
    Literatura: "bg-purple-500 border-purple-600 text-purple-100",
    Veterinária: "bg-gray-500 border-brown-600 text-brown-100",
    Odontologia: "bg-gray-500 border-gray-600 text-gray-100",
    Pedagogia: "bg-green-500 border-green-600 text-green-100",
  };
  return colors[departmentId] || "bg-gray-500 border-gray-500 text-gray-800";
};

const getPeriodLabel = (period: string) => {
  switch (period) {
    case "MORNING":
      return "manhä";
    case "AFTERNOON":
      return "tarde";
    case "EVENING":
      return "noite";
    default:
      return period;
  }
};

const timeSlots = Array.from({ length: 17 }, (_, i) => i + 7);

const AppointmentItem = ({
  appointment,
  onDelete,
  session,
}: {
  appointment: SchedulingWithRelations;
  onDelete: (id: string) => void;
  session: any;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <div
        className={cn(
          "w-full p-2 rounded border-l-4 overflow-hidden cursor-pointer mb-1",
          getDepartmentColor(appointment.course.name)
        )}
      >
        <div className="overflow-hidden">
          <div className="flex gap-2 font-medium text-xs truncate">
            {appointment.discipline.name}{" "}
            <div className="text-xs truncate">
              {new Intl.DateTimeFormat("pt-BR", {
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(appointment.startTime))}
              {" – "}
              {new Intl.DateTimeFormat("pt-BR", {
                hour: "numeric",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(appointment.endTime))}
            </div>
          </div>
          <div className="text-xs truncate">{appointment.name}</div>
        </div>
      </div>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <div className="flex gap-4 justify-end">
          <Edit className="h-4 w-4 cursor-pointer" />
          {appointment.userId === session?.user?.id && (
            <Trash2
              className="h-4 w-4 cursor-pointer"
              onClick={() => onDelete(appointment.id)}
            />
          )}
          <AlertDialogCancel className="h-4 w-4 cursor-pointer border-none">
            <X />
          </AlertDialogCancel>
        </div>
        <AlertDialogTitle className="flex gap-2 items-center mt-2">
          <div
            className={cn(
              "flex gap-2 w-3 h-3 rounded-xs flex-shrink-0",
              getDepartmentColor(appointment.course.name)
            )}
          />
          <p className="font-medium">Disciplina:</p>

          {appointment.discipline.name}
        </AlertDialogTitle>
      </AlertDialogHeader>

      <div className="space-y-3 text-sm pt-2">
        <div className="flex gap-2 items-center">
          <p className="font-medium">Curso:</p>
          {appointment.course.name}
        </div>
        <div className="flex gap-2 items-center">
          <p className="font-medium">Professor:</p>
          {appointment.name}
        </div>
        <div className="flex gap-2 items-center">
          <p className="font-medium">Horário:</p>

          {new Intl.DateTimeFormat("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long",
          }).format(new Date(appointment.startTime))}
          {" ⋅ "}
          {new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(appointment.startTime))}
          {" – "}
          {new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(appointment.endTime))}
        </div>
        <div className="flex gap-2 items-center">
          {appointment.course.periods.map((p) => (
            <span key={p} className="flex gap-1 items-center">
              <p className="font-medium">Período:</p>

              {getPeriodLabel(p)}
            </span>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <p className="font-medium">Anotações:</p>

          {appointment.notes ? appointment.notes : "Sem anotações"}
        </div>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);

export default function CalendarPage() {
  const session = mockSession;

  const [academicCourses, setAcademicCourses] = useState<Course[]>([]);
  const [schedulingCourses, setSchedulingCourses] = useState<
    SchedulingWithRelations[]
  >([]);
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

  const filteredAppointments = schedulingCourses.filter((appointment) =>
    academicCourses.some(
      (course) =>
        course.name === appointment.course.name && visibleDepartments[course.id]
    )
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

  useEffect(() => {
    async function fetch() {
      const coursesData = await getCourses();
      const schedulingData = await getScheduling();

      setSchedulingCourses(schedulingData);
      setAcademicCourses(coursesData);
    }

    fetch();
  }, []);

  const handleDeleteSchedule = async (scheduleId: string) => {
    await deleteSchedule(scheduleId);

    setSchedulingCourses((prev) =>
      prev.filter((schedule) => schedule.id !== scheduleId)
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        <aside className="w-72 border-r p-4 flex flex-col overflow-y-auto">
          <div className="mb-6">
            <Button
              onClick={handleNewAppointment}
              className="w-full flex items-center gap-2 cursor-pointer"
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
              className="rounded-md border "
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
                    className="cursor-pointer"
                  />
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full flex-shrink-0",
                      getDepartmentColor(course.name)
                    )}
                  />
                  <label
                    htmlFor={course.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {course.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={navigatePrevious}
                className="cursor-pointer bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={navigateNext}
                className="cursor-pointer bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold ml-2">
                {view === "week"
                  ? `${format(days[0], "MMMM d", { locale: ptBR })} - ${format(
                      days[days.length - 1],
                      "MMMM d, yyyy",
                      {
                        locale: ptBR,
                      }
                    )}`
                  : format(currentDate, "MMMM d, yyyy", { locale: ptBR })}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
                className="cursor-pointer"
              >
                Dia
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
                className="cursor-pointer"
              >
                Semana
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto h-full">
            <div className="flex h-full">
              <div className="w-16 flex-shrink-0 border-r">
                <div className="h-12 border-b text-xs text-gray-500 flex items-center justify-center">
                  GMT-03
                </div>
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-12 border-b relative">
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
                    <div className="h-12 border-b flex flex-col items-center justify-center">
                      <div className="text-xs text-gray-500">
                        {format(day, "EEE", { locale: ptBR })
                          .charAt(0)
                          .toUpperCase() +
                          format(day, "EEE", { locale: ptBR }).slice(1)}
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
                      {timeSlots.map((hour) => {
                        const appointmentsInSlot = filteredAppointments.filter(
                          (appointment) => {
                            return (
                              isSameDay(new Date(appointment.date), day) &&
                              new Date(appointment.startTime).getHours() ===
                                hour
                            );
                          }
                        );

                        if (appointmentsInSlot.length > 0) {
                          const firstAppointment = appointmentsInSlot[0];
                          const remainingCount = appointmentsInSlot.length - 1;

                          return (
                            <div
                              key={hour}
                              className="h-12 border-b relative flex"
                            >
                              {/* First appointment */}
                              <div className="absolute left-0 right-0 mx-1 top-0 h-full ">
                                <div className="relative h-full flex ">
                                  <AppointmentItem
                                    appointment={firstAppointment}
                                    onDelete={handleDeleteSchedule}
                                    session={session}
                                  />

                                  {/* +X badge in bottom right corner */}
                                  {remainingCount > 0 && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <div className="absolute h-5 w-5 bottom-2 right-0 bg-white text-black text-xs rounded-full w flex items-center justify-center cursor-pointer hover:bg-gray-300 border border-white shadow-sm">
                                          +{remainingCount}
                                        </div>
                                      </DialogTrigger>

                                      <DialogContent className="max-w-md">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Agendamentos -{" "}
                                            {format(day, "d 'de' MMMM", {
                                              locale: ptBR,
                                            })}{" "}
                                            às {String(hour).padStart(2, "0")}
                                            :00
                                          </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                          {appointmentsInSlot.map(
                                            (appointment) => (
                                              <AppointmentItem
                                                key={appointment.id}
                                                appointment={appointment}
                                                onDelete={handleDeleteSchedule}
                                                session={session}
                                              />
                                            )
                                          )}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div
                            key={hour}
                            className="h-12 border-b relative"
                          ></div>
                        );
                      })}
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
