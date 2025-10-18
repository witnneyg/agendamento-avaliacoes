"use client";

import { useEffect, useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Filter, Menu, X } from "lucide-react";

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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  Class,
} from "@prisma/client";
import { getUser } from "../_actions/getUser";
import { AppointmentItem } from "../_components/AppointItem";
import { getDepartmentColor } from "@/utils/getDepartamentColor";

export type SchedulingWithRelations = Scheduling & {
  course: Course;
  semester: Semester;
  discipline: Discipline;
  class: Class;
};

export type UserWithoutEmailVerified = Omit<User, "emailVerified">;

const timeSlots = Array.from({ length: 17 }, (_, i) => i + 7);

const loadVisibleDepartmentsFromStorage = (courses: Course[]) => {
  if (typeof window === "undefined") {
    return courses.reduce((acc, course) => ({ ...acc, [course.id]: true }), {});
  }

  try {
    const stored = localStorage.getItem("visibleDepartments");
    if (stored) {
      const parsed = JSON.parse(stored);
      return courses.reduce(
        (acc, course) => ({
          ...acc,
          [course.id]:
            parsed[course.id] !== undefined ? parsed[course.id] : true,
        }),
        {}
      );
    }
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error);
  }

  return courses.reduce((acc, course) => ({ ...acc, [course.id]: true }), {});
};

const saveVisibleDepartmentsToStorage = (
  departments: Record<string, boolean>
) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("visibleDepartments", JSON.stringify(departments));
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
    }
  }
};

export default function CalendarPage() {
  const [academicCourses, setAcademicCourses] = useState<Course[]>([]);
  const [schedulingCourses, setSchedulingCourses] = useState<
    SchedulingWithRelations[]
  >([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleDepartments, setVisibleDepartments] = useState<
    Record<string, boolean>
  >({});
  const [user, setUser] = useState<UserWithoutEmailVerified | null>(null);
  const [view, setView] = useState<"week" | "day" | "fortnight">("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controlar sidebar
  const router = useRouter();

  // Calcular dias baseado na visualização
  const daysToShow = view === "week" ? 7 : view === "day" ? 1 : 14;
  const startDate =
    view === "week" || view === "fortnight"
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

  useEffect(() => {
    async function fetchUser() {
      const session = await getUser();
      console.log({ session });
      setUser(session);
    }

    fetchUser();
  }, []);

  const navigatePrevious = () => {
    if (view === "day") {
      setCurrentDate((prev) => addDays(prev, -1));
    } else if (view === "week") {
      setCurrentDate((prev) => addDays(prev, -7));
    } else if (view === "fortnight") {
      setCurrentDate((prev) => addDays(prev, -14));
    }
  };

  const navigateNext = () => {
    if (view === "day") {
      setCurrentDate((prev) => addDays(prev, 1));
    } else if (view === "week") {
      setCurrentDate((prev) => addDays(prev, 7));
    } else if (view === "fortnight") {
      setCurrentDate((prev) => addDays(prev, 14));
    }
  };

  const toggleDepartment = (departmentId: string) => {
    setVisibleDepartments((prev) => {
      const newDepartments = {
        ...prev,
        [departmentId]: !prev[departmentId],
      };
      saveVisibleDepartmentsToStorage(newDepartments);
      return newDepartments;
    });
  };

  const handleNewAppointment = () => {
    router.push("/");
  };

  const handleAppointmentUpdated = (
    updatedAppointments: Partial<SchedulingWithRelations>[]
  ) => {
    console.log("Atualizando agendamentos:", updatedAppointments);

    setSchedulingCourses((prev) =>
      prev.map((apt) => {
        const updated = updatedAppointments.find((u) => u.id === apt.id);
        if (updated) {
          return {
            ...apt,
            ...updated,
            id: updated.id || apt.id,
            date: updated.date || apt.date,
            startTime: updated.startTime || apt.startTime,
            endTime: updated.endTime || apt.endTime,
            details: updated.details || apt.details,
          };
        }
        return apt;
      })
    );
  };

  const handleAppointmentDeleted = (deletedId: string) => {
    console.log("Removendo agendamento:", deletedId);
    setSchedulingCourses((prev) => prev.filter((apt) => apt.id !== deletedId));
  };

  useEffect(() => {
    async function fetch() {
      const coursesData = await getCourses();
      const schedulingData = await getScheduling();
      setSchedulingCourses(schedulingData as any);
      setAcademicCourses(coursesData);

      const savedDepartments = loadVisibleDepartmentsFromStorage(coursesData);
      setVisibleDepartments(savedDepartments);
    }

    fetch();
  }, []);

  useEffect(() => {
    if (Object.keys(visibleDepartments).length > 0) {
      saveVisibleDepartmentsToStorage(visibleDepartments);
    }
  }, [visibleDepartments]);

  const handleDeleteSchedule = async (scheduleId: string) => {
    await deleteSchedule(scheduleId);
    handleAppointmentDeleted(scheduleId);
  };

  const formatDateRange = () => {
    if (view === "day") {
      return format(currentDate, "MMM d, yyyy", { locale: ptBR });
    } else if (view === "week") {
      return `${format(days[0], "MMM d", { locale: ptBR })} - ${format(
        days[days.length - 1],
        "MMM d, yyyy",
        { locale: ptBR }
      )}`;
    } else if (view === "fortnight") {
      return `${format(days[0], "MMM d", { locale: ptBR })} - ${format(
        days[days.length - 1],
        "MMM d, yyyy",
        { locale: ptBR }
      )}`;
    }
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(false)}
          className="h-8 w-8 cursor-pointer lg:hidden bg-amber-200-"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

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
                checked={visibleDepartments[course.id] || false}
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
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
        {/* Sidebar Desktop com toggle */}
        <aside
          className={cn(
            "border-r p-4 flex-col overflow-y-auto bg-background transition-all duration-300 ease-in-out",
            isSidebarOpen ? "w-72" : "w-0 p-0 overflow-hidden",
            "hidden lg:flex"
          )}
        >
          {isSidebarOpen && <SidebarContent />}
        </aside>

        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r transform transition-transform duration-300 ease-in-out lg:hidden",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="p-4 h-full overflow-y-auto">
            <SidebarContent />
          </div>
        </div>

        <main className="flex-1 flex flex-col">
          <div className="p-2 sm:p-4 border-b flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0 h-full">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(true)}
                className="cursor-pointer bg-transparent flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="cursor-pointer bg-transparent flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 hidden lg:flex mr-5"
              >
                {isSidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={navigatePrevious}
                className="cursor-pointer bg-transparent flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={navigateNext}
                className="cursor-pointer bg-transparent flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-sm sm:text-xl font-semibold ml-1 sm:ml-2 truncate">
                {formatDateRange()}
              </h2>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-shrink-0">
              {/* Botão de filtro para mobile (alternativo) */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10 bg-transparent lg:hidden"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filtros</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <SidebarContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
                className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
              >
                Dia
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
                className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
              >
                Semana
              </Button>
              <Button
                variant={view === "fortnight" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("fortnight")}
                className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3 hidden sm:inline-flex"
              >
                Quinzena
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto h-full">
            <div
              className={cn(
                "flex h-full",
                view === "day"
                  ? "min-w-[200px]"
                  : view === "week"
                    ? "min-w-[600px]"
                    : "min-w-[1200px]"
              )}
            >
              <div className="w-12 sm:w-16 flex-shrink-0 border-r">
                <div className="h-10 sm:h-12 border-b text-[10px] sm:text-xs text-gray-500 flex items-center justify-center">
                  GMT-03
                </div>
                {timeSlots.map((hour) => (
                  <div key={hour} className="h-12 sm:h-12 border-b relative">
                    <span className="absolute -top-2 right-1 sm:right-2 text-[10px] sm:text-xs text-gray-500">
                      {String(hour).padStart(2, "0")}:00
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex-1 flex overflow-x-auto">
                {days.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "flex-1 border-r",
                      view === "fortnight"
                        ? "min-w-[85px]"
                        : "min-w-[80px] sm:min-w-[120px]"
                    )}
                  >
                    <div className="h-10 sm:h-12 border-b flex flex-col items-center justify-center">
                      <div className="text-[10px] sm:text-xs text-gray-500">
                        {format(day, "EEE", { locale: ptBR })
                          .charAt(0)
                          .toUpperCase() +
                          format(day, "EEE", { locale: ptBR }).slice(1)}
                      </div>
                      <div
                        className={cn(
                          "flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full mt-1 text-xs sm:text-sm",
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
                              className="h-12 sm:h-12 border-b relative flex"
                            >
                              <div className="absolute left-0 right-0 mx-0.5 sm:mx-1 top-0 h-full">
                                <div className="relative h-full flex">
                                  <AppointmentItem
                                    appointment={firstAppointment}
                                    onDelete={handleDeleteSchedule}
                                    userSession={user}
                                    onAppointmentUpdated={
                                      handleAppointmentUpdated
                                    }
                                    onAppointmentDeleted={
                                      handleAppointmentDeleted
                                    }
                                  />

                                  {remainingCount > 0 && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <div className="absolute h-4 w-4 sm:h-5 sm:w-5 bottom-1 sm:bottom-2 right-0 bg-white text-black text-[10px] sm:text-xs rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-300 border border-white shadow-sm">
                                          +{remainingCount}
                                        </div>
                                      </DialogTrigger>

                                      <DialogContent className="max-w-[90vw] sm:max-w-md">
                                        <DialogHeader>
                                          <DialogTitle className="text-sm sm:text-base">
                                            Agendamentos -{" "}
                                            {format(day, "d 'de' MMMM", {
                                              locale: ptBR,
                                            })}{" "}
                                            às {String(hour).padStart(2, "0")}
                                            :00
                                          </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-2 max-h-[60vh] sm:max-h-96 overflow-y-auto">
                                          {appointmentsInSlot.map(
                                            (appointment) => (
                                              <AppointmentItem
                                                key={appointment.id}
                                                appointment={appointment}
                                                onDelete={handleDeleteSchedule}
                                                userSession={user}
                                                onAppointmentUpdated={
                                                  handleAppointmentUpdated
                                                }
                                                onAppointmentDeleted={
                                                  handleAppointmentDeleted
                                                }
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
                            className="h-12 sm:h-12 border-b relative"
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
