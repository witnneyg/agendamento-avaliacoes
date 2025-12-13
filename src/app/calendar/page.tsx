"use client";

import { useEffect, useState, useMemo } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Menu,
  X,
  Shield,
  User,
  Loader2,
  ClipboardList,
  Settings, // Ícone para ADMIN
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
import { getUserCourses } from "../_actions/user/get-user-courses";
import { deleteSchedule } from "../_actions/scheduling/delete-schedule";
import type {
  Scheduling,
  Course,
  Semester,
  Discipline,
  User as PrismaUser,
  Class,
} from "@prisma/client";
import { getUser } from "../_actions/user/getUser";
import { AppointmentItem } from "../_components/AppointItem";
import { getDepartmentColor } from "@/utils/getDepartamentColor";
import { getDirectorByUserId } from "../_actions/get-director-by-user-id";
import { getCoursesByDirectorId } from "../_actions/get-courses-by-director-id";
import { getSchedulingByRole } from "../_actions/scheduling/get-scheduling-by-role";
import { getAllCourses } from "../_actions/coursers/getAllCoursers";

export type SchedulingWithRelations = Scheduling & {
  course: Course;
  semester: Semester;
  discipline: Discipline;
  class: Class;
  user: PrismaUser;
};

export type UserWithoutEmailVerified = Omit<PrismaUser, "emailVerified">;

const timeSlots = Array.from({ length: 17 }, (_, i) => i + 7);

const loadVisibleDepartmentsFromStorage = (allCourses: Course[]) => {
  if (typeof window === "undefined") {
    return allCourses.reduce(
      (acc, course) => ({ ...acc, [course.id]: true }),
      {}
    );
  }

  try {
    const stored = localStorage.getItem("visibleDepartments");
    if (stored) {
      const parsed = JSON.parse(stored);

      return allCourses.reduce(
        (acc, course) => {
          acc[course.id] =
            parsed[course.id] !== undefined ? parsed[course.id] : true;
          return acc;
        },
        {} as Record<string, boolean>
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }

  return allCourses.reduce(
    (acc, course) => ({ ...acc, [course.id]: true }),
    {}
  );
};

const saveVisibleDepartmentsToStorage = (
  departments: Record<string, boolean>
) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("visibleDepartments", JSON.stringify(departments));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
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
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<"week" | "day" | "fortnight">("week");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDirector, setIsDirector] = useState(false);
  const [isSecretary, setIsSecretary] = useState(false);
  const [isProfessor, setIsProfessor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Estado para ADMIN
  const [professorCourses, setProfessorCourses] = useState<Course[]>([]);
  const [directorCourses, setDirectorCourses] = useState<Course[]>([]);
  const [isLoadingUserRoles, setIsLoadingUserRoles] = useState(true);
  const router = useRouter();

  const daysToShow = view === "week" ? 7 : view === "day" ? 1 : 14;
  const startDate =
    view === "week" || view === "fortnight"
      ? startOfWeek(currentDate, { weekStartsOn: 0 })
      : currentDate;

  const days = Array.from({ length: daysToShow }, (_, i) =>
    addDays(startDate, i)
  );

  const allUniqueCourses = useMemo(() => {
    const allCoursesMap = new Map<string, Course>();

    directorCourses.forEach((course) => {
      allCoursesMap.set(course.id, course);
    });

    academicCourses.forEach((course) => {
      allCoursesMap.set(course.id, course);
    });

    return Array.from(allCoursesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [directorCourses, academicCourses]);

  const filteredAppointments = schedulingCourses.filter((appointment) => {
    const course = allUniqueCourses.find(
      (c) => c.name === appointment.course.name
    );
    return course && visibleDepartments[course.id];
  });

  useEffect(() => {
    async function fetchUserAndCourses() {
      try {
        setIsLoadingUserRoles(true);
        const session = await getUser();
        setUser(session);

        if (session) {
          const hasProfessorRole = session.roles?.some(
            (role) => role.name === "PROFESSOR"
          );

          const hasDirectorRole = session.roles?.some(
            (role) => role.name === "DIRECAO"
          );

          const hasSecretaryRole = session.roles?.some(
            (role) => role.name === "SECRETARIA"
          );

          const hasAdminRole = session.roles?.some(
            (role) => role.name === "ADMIN"
          );

          setIsSecretary(hasSecretaryRole || false);
          setIsDirector(hasDirectorRole || false);
          setIsProfessor(hasProfessorRole || false);
          setIsAdmin(hasAdminRole || false);

          let professorCoursesData: Course[] = [];
          let directorCoursesData: Course[] = [];
          let allCoursesData: any = [];
          let schedulingData: any = [];

          if (hasProfessorRole) {
            professorCoursesData = (await getUserCourses()) as Course[];
            setProfessorCourses(professorCoursesData);
          }

          if (hasDirectorRole) {
            const directorData = await getDirectorByUserId(session.id);
            if (directorData) {
              directorCoursesData = await getCoursesByDirectorId(
                directorData.id
              );
              setDirectorCourses(directorCoursesData);
            }
          }

          if (hasSecretaryRole || hasAdminRole) {
            allCoursesData = await getAllCourses();
          }

          const allCoursesMap = new Map<string, Course>();

          if (hasSecretaryRole || hasAdminRole) {
            allCoursesData.forEach((course: Course) => {
              allCoursesMap.set(course.id, course);
            });
          } else {
            professorCoursesData.forEach((course: Course) => {
              allCoursesMap.set(course.id, course);
            });
          }

          directorCoursesData.forEach((course: Course) => {
            allCoursesMap.set(course.id, course);
          });

          const combinedCourses = Array.from(allCoursesMap.values());
          setAcademicCourses(combinedCourses);

          if (hasProfessorRole && professorCoursesData.length > 0) {
            const courseIds = professorCoursesData.map((course) => course.id);
            schedulingData = await getSchedulingByRole({
              courseIds: courseIds,
              isProfessor: true,
            });
          } else if (hasSecretaryRole || hasAdminRole) {
            schedulingData = await getSchedulingByRole({ isSecretary: true });
          } else if (hasDirectorRole) {
            const allUserAppointments = await getSchedulingByRole({
              userId: session.id,
            });

            const directorData = await getDirectorByUserId(session.id);
            if (directorData) {
              const directorAppointments = await getSchedulingByRole({
                directorId: directorData.id,
              });

              const allAppointments = [
                ...allUserAppointments,
                ...directorAppointments,
              ];
              const uniqueAppointments = new Map();

              allAppointments.forEach((appointment: any) => {
                uniqueAppointments.set(appointment.id, appointment);
              });

              schedulingData = Array.from(uniqueAppointments.values());
            } else {
              schedulingData = allUserAppointments;
            }
          } else {
            schedulingData = await getSchedulingByRole({ userId: session.id });
          }

          setSchedulingCourses(schedulingData as any);

          const allCoursesForStorage = [
            ...combinedCourses,
            ...directorCoursesData,
          ];

          const savedDepartments =
            loadVisibleDepartmentsFromStorage(allCoursesForStorage);
          setVisibleDepartments(savedDepartments);

          saveVisibleDepartmentsToStorage(savedDepartments);
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        }
      } finally {
        setIsLoadingUserRoles(false);
      }
    }

    fetchUserAndCourses();
  }, []);

  useEffect(() => {
    if (Object.keys(visibleDepartments).length > 0) {
      saveVisibleDepartmentsToStorage(visibleDepartments);
    }
  }, [visibleDepartments]);

  useEffect(() => {
    if (
      directorCourses.length > 0 &&
      Object.keys(visibleDepartments).length > 0
    ) {
      const hasNewCourses = directorCourses.some(
        (course) => !(course.id in visibleDepartments)
      );

      if (hasNewCourses) {
        const updatedDepartments = { ...visibleDepartments };

        directorCourses.forEach((course) => {
          if (!(course.id in updatedDepartments)) {
            updatedDepartments[course.id] = true;
          }
        });

        setVisibleDepartments(updatedDepartments);
      }
    }
  }, [directorCourses, visibleDepartments]);

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
    setSchedulingCourses((prev) => prev.filter((apt) => apt.id !== deletedId));
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!user) return;

    try {
      await deleteSchedule(scheduleId);
      handleAppointmentDeleted(scheduleId);
    } catch (error: any) {
      alert(error.message || "Erro ao excluir agendamento");
    }
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

  const SidebarContent = () => {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
            className="h-8 w-8 cursor-pointer lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex gap-2 shrink-0">
            {isLoadingUserRoles ? (
              <div className="flex items-center gap-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Carregando...</span>
              </div>
            ) : user ? (
              <>
                {isAdmin && (
                  <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                    <Settings className="h-4 w-4" />
                    <span>Administrador</span>
                  </div>
                )}
                {isSecretary && (
                  <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    <ClipboardList className="h-4 w-4" />
                    <span>Secretaria</span>
                  </div>
                )}
                {isDirector && (
                  <div className="flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Diretor</span>
                  </div>
                )}
                {isProfessor && (
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    <User className="h-4 w-4" />
                    <span>Professor</span>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
        <div className="mb-6">
          <Button
            onClick={handleNewAppointment}
            className="w-full flex items-center gap-2 cursor-pointer"
            disabled={isLoadingUserRoles}
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
            {isLoadingUserRoles
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 animate-pulse"
                  >
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                  </div>
                ))
              : allUniqueCourses.map((course) => {
                  const isDirectorCourse = directorCourses.some(
                    (c) => c.id === course.id
                  );

                  const isProfessorCourse = professorCourses.some(
                    (c) => c.id === course.id
                  );

                  return (
                    <div
                      key={course.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={course.id}
                        checked={visibleDepartments[course.id] || false}
                        onCheckedChange={() => toggleDepartment(course.id)}
                        className="cursor-pointer"
                      />
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full shrink-0",
                          getDepartmentColor(course.name)
                        )}
                      />
                      <label
                        htmlFor={course.id}
                        className="text-sm font-medium leading-none cursor-pointer flex-1 truncate"
                      >
                        {course.name}
                      </label>
                      <div className="flex gap-1 shrink-0 flex-wrap justify-end">
                        {isAdmin && (
                          <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                            <Settings className="h-3 w-3" />
                          </span>
                        )}

                        {isSecretary && (
                          <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                            <ClipboardList className="h-3 w-3" />
                          </span>
                        )}

                        {isDirector && isDirectorCourse && (
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                            <Shield className="h-3 w-3" />
                          </span>
                        )}

                        {isProfessor && isProfessorCourse && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap">
                            <User className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex flex-1">
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
                className="cursor-pointer bg-transparent shrink-0 h-8 w-8 sm:h-10 sm:w-10 lg:hidden"
                disabled={isLoadingUserRoles}
              >
                <Menu className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="cursor-pointer bg-transparent shrink-0 h-8 w-8 sm:h-10 sm:w-10 hidden lg:flex mr-5"
                disabled={isLoadingUserRoles}
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
                className="cursor-pointer bg-transparent shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                disabled={isLoadingUserRoles}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={navigateNext}
                className="cursor-pointer bg-transparent shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                disabled={isLoadingUserRoles}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <h2 className="text-sm sm:text-xl font-semibold ml-1 sm:ml-2 truncate">
                {formatDateRange()}
              </h2>
            </div>
            <div className="flex gap-1 sm:gap-2 shrink-0">
              <Button
                variant={view === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("day")}
                className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                disabled={isLoadingUserRoles}
              >
                Dia
              </Button>
              <Button
                variant={view === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("week")}
                className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                disabled={isLoadingUserRoles}
              >
                Semana
              </Button>
              <Button
                variant={view === "fortnight" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("fortnight")}
                className="cursor-pointer h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3 hidden sm:inline-flex"
                disabled={isLoadingUserRoles}
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
              <div className="w-12 sm:w-16 shrink-0 border-r">
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
                                    isDirector={isDirector}
                                    isSecretary={isSecretary}
                                    isAdmin={isAdmin}
                                    directorCourses={directorCourses}
                                    academicCourses={professorCourses}
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
                                                isDirector={isDirector}
                                                isSecretary={isSecretary}
                                                isAdmin={isAdmin}
                                                directorCourses={
                                                  directorCourses
                                                }
                                                academicCourses={
                                                  professorCourses
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
