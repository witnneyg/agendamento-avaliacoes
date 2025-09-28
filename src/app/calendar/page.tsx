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
import type {
  Scheduling,
  Course,
  Semester,
  Discipline,
  User,
} from "@prisma/client";
import { getUser } from "../_actions/getUser";
import { AppointmentItem } from "../_components/AppointItem";
import { getDepartmentColor } from "@/utils/getDepartamentColor";

export type SchedulingWithRelations = Scheduling & {
  course: Course;
  semester: Semester;
  discipline: Discipline;
};

export type UserWithoutEmailVerified = Omit<User, "emailVerified">;

const timeSlots = Array.from({ length: 17 }, (_, i) => i + 7);

export default function CalendarPage() {
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
  const [user, setUser] = useState<UserWithoutEmailVerified | null>(null);
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
    async function fetchUser() {
      const session = await getUser();
      console.log({ session });
      setUser(session);
    }

    fetchUser();
  }, []);

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
                                    userSession={user}
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
                                                userSession={user}
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
