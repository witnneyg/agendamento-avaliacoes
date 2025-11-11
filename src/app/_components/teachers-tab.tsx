"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Edit,
  Loader2,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Users,
  AlertTriangle,
} from "lucide-react";

import { getTeachers } from "@/app/_actions/get-teacher";
import { getDisciplinesByCourseId } from "@/app/_actions/get-discipline-by-course-id";
import { createTeacher } from "@/app/_actions/create-teacher";
import { getUsers } from "@/app/_actions/get-users";
import type {
  Course,
  Discipline,
  Prisma,
  User as UserType,
  Role,
} from "@prisma/client";
import { translateTeacherStatus } from "@/utils/translate-teacher-status";
import { updateTeacher } from "../_actions/update-teacher";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getCourses } from "../_actions/get-coursers";

type TeacherWithRelations = Prisma.TeacherGetPayload<{
  include: { courses: true; disciplines: true };
}>;

type UserWithRoles = Prisma.UserGetPayload<{
  include: { roles: true };
}>;

type DisciplineWithCourse = Discipline & {
  courseName: string;
  isAssigned: boolean;
  assignedTo?: string;
};

const teacherSchema = z
  .object({
    userId: z.string().min(1, "Selecione um professor"),
    courseIds: z.array(z.string()),
    disciplineIds: z.array(z.string()),
    status: z.enum(["ACTIVE", "INACTIVE"]),
  })
  .refine(
    (data) => {
      if (data.status === "ACTIVE") {
        return data.courseIds.length > 0 && data.disciplineIds.length > 0;
      }
      return true;
    },
    {
      message:
        "Selecione pelo menos um curso e uma disciplina para professores ativos",
      path: ["courseIds"],
    }
  );

type TeacherForm = z.infer<typeof teacherSchema>;

export function TeachersTab() {
  const [teachers, setTeachers] = useState<TeacherWithRelations[]>([]);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableDisciplines, setAvailableDisciplines] = useState<
    DisciplineWithCourse[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] =
    useState<TeacherWithRelations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [teacherSearchTerm, setTeacherSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [courseSearchTerm, setCourseSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set()
  );

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TeacherForm>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      userId: "",
      courseIds: [],
      disciplineIds: [],
      status: "ACTIVE",
    },
  });

  const selectedCourseIds = watch("courseIds");
  const selectedDisciplineIds = watch("disciplineIds");
  const selectedUserId = watch("userId");

  // Função para limpar completamente o formulário
  const clearForm = () => {
    reset({
      userId: "",
      courseIds: [],
      disciplineIds: [],
      status: "ACTIVE",
    });
    setEditingTeacher(null);
    setCourseSearchTerm("");
    setUserSearchTerm("");
    setExpandedCourses(new Set());
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name
      .toLowerCase()
      .includes(teacherSearchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCourses = courses
    .filter((course) =>
      course.name.toLowerCase().includes(courseSearchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filtra apenas usuários com role PROFESSOR
  const filteredUsers = users
    .filter((user) => {
      const hasProfessorRole = user.roles.some(
        (role) => role.name === "PROFESSOR" || role.name === "professor"
      );

      const matchesSearch =
        user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase());

      return hasProfessorRole && matchesSearch;
    })
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const disciplinesByCourse = availableDisciplines.reduce(
    (acc, discipline) => {
      if (!acc[discipline.courseName]) {
        acc[discipline.courseName] = [];
      }
      acc[discipline.courseName].push(discipline);
      return acc;
    },
    {} as Record<string, DisciplineWithCourse[]>
  );

  const sortedDisciplinesByCourse = Object.fromEntries(
    Object.entries(disciplinesByCourse).sort(([courseNameA], [courseNameB]) =>
      courseNameA.localeCompare(courseNameB)
    )
  );

  const getDisciplineAssignmentInfo = (disciplineId: string) => {
    const teacherWithDiscipline = teachers.find((teacher) =>
      teacher.disciplines.some((d) => d.id === disciplineId)
    );

    if (teacherWithDiscipline) {
      return {
        isAssigned: true,
        assignedTo: teacherWithDiscipline.name,
        isAssignedToCurrent: editingTeacher?.id === teacherWithDiscipline.id,
      };
    }

    return {
      isAssigned: false,
      assignedTo: null,
      isAssignedToCurrent: false,
    };
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const teachersData = await getTeachers();
        setTeachers(teachersData as any);
        const coursesData = await getCourses();
        setCourses(coursesData.sort((a, b) => a.name.localeCompare(b.name)));
        const usersData = await getUsers();
        setUsers(usersData as UserWithRoles[]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const currentStatus = watch("status");

    if (currentStatus === "INACTIVE") {
      setValue("courseIds", []);
      setValue("disciplineIds", []);
      setAvailableDisciplines([]);
      setExpandedCourses(new Set());
    }
  }, [watch("status"), setValue]);

  useEffect(() => {
    if (selectedUserId && !users.some((user) => user.id === selectedUserId)) {
      setValue("userId", "");
    }

    const validCourseIds = selectedCourseIds.filter((courseId) =>
      courses.some((course) => course.id === courseId)
    );
    if (validCourseIds.length !== selectedCourseIds.length) {
      setValue("courseIds", validCourseIds);
    }

    const validDisciplineIds = selectedDisciplineIds.filter((disciplineId) =>
      availableDisciplines.some((discipline) => discipline.id === disciplineId)
    );
    if (validDisciplineIds.length !== selectedDisciplineIds.length) {
      setValue("disciplineIds", validDisciplineIds);
    }
  }, [
    courses,
    users,
    availableDisciplines,
    selectedUserId,
    selectedCourseIds,
    selectedDisciplineIds,
    setValue,
  ]);

  useEffect(() => {
    async function fetchDisciplines() {
      if (!selectedCourseIds || selectedCourseIds.length === 0) {
        setAvailableDisciplines([]);
        setValue("disciplineIds", []);
        return;
      }

      const disciplinesData = await Promise.all(
        selectedCourseIds.map(async (courseId) => {
          const disciplines = await getDisciplinesByCourseId(courseId);
          const course = courses.find((c) => c.id === courseId);

          return disciplines.map((discipline) => {
            const assignmentInfo = getDisciplineAssignmentInfo(discipline.id);

            return {
              ...discipline,
              courseName: course?.name || "Curso não encontrado",
              isAssigned: assignmentInfo.isAssigned,
              assignedTo: assignmentInfo.assignedTo,
            };
          });
        })
      );

      const allDisciplines = disciplinesData.flat();
      setAvailableDisciplines(allDisciplines as any);

      const newExpanded = new Set(expandedCourses);
      selectedCourseIds.forEach((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          newExpanded.add(course.name);
        }
      });
      setExpandedCourses(newExpanded);

      const validDisciplineIds = selectedDisciplineIds.filter((id) => {
        const discipline = allDisciplines.find((d) => d.id === id);
        if (!discipline) return false;

        if (editingTeacher && discipline.isAssigned) {
          const assignmentInfo = getDisciplineAssignmentInfo(id);
          return assignmentInfo.isAssignedToCurrent;
        }

        return !discipline.isAssigned;
      });

      setValue("disciplineIds", validDisciplineIds);
    }

    fetchDisciplines();
  }, [selectedCourseIds, setValue, watch, courses, editingTeacher]);

  const toggleCourseExpansion = (courseName: string) => {
    const newExpanded = new Set(expandedCourses);
    if (newExpanded.has(courseName)) {
      newExpanded.delete(courseName);
    } else {
      newExpanded.add(courseName);
    }
    setExpandedCourses(newExpanded);
  };

  const onSubmit = async (data: TeacherForm) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const selectedUser = users.find((user) => user.id === data.userId);
      if (!selectedUser) {
        alert("Usuário selecionado não encontrado");
        return;
      }

      // Verifica se o usuário tem a role PROFESSOR
      const hasProfessorRole = selectedUser.roles.some(
        (role) => role.name === "PROFESSOR" || role.name === "professor"
      );

      if (
        data.status === "INACTIVE" &&
        (data.courseIds.length > 0 || data.disciplineIds.length > 0)
      ) {
        alert(
          "Professores inativos não podem ter cursos ou disciplinas vinculados. Os vínculos serão removidos automaticamente."
        );
        return;
      }

      const existingTeacher = teachers.find(
        (teacher) => teacher.name === selectedUser.name
      );

      const validCourseIds = data.courseIds.filter((courseId) =>
        courses.some((course) => course.id === courseId)
      );
      if (validCourseIds.length === 0 && data.status === "ACTIVE") {
        alert("Nenhum curso válido selecionado");
        return;
      }

      const validDisciplineIds = data.disciplineIds.filter((disciplineId) =>
        availableDisciplines.some(
          (discipline) => discipline.id === disciplineId
        )
      );
      if (validDisciplineIds.length === 0 && data.status === "ACTIVE") {
        alert("Nenhuma disciplina válida selecionada");
        return;
      }

      const conflictedDisciplines = validDisciplineIds.filter(
        (disciplineId) => {
          const assignmentInfo = getDisciplineAssignmentInfo(disciplineId);
          const teacherToUpdate = editingTeacher || existingTeacher;

          return (
            assignmentInfo.isAssigned &&
            !assignmentInfo.isAssignedToCurrent &&
            (!teacherToUpdate ||
              assignmentInfo.assignedTo !== teacherToUpdate.name)
          );
        }
      );

      if (conflictedDisciplines.length > 0) {
        const conflictedNames = conflictedDisciplines
          .map((id) => {
            const discipline = availableDisciplines.find((d) => d.id === id);
            return discipline?.name || id;
          })
          .join(", ");

        alert(
          `As seguintes disciplinas já estão atribuídas a outros professores: ${conflictedNames}`
        );
        return;
      }

      const teacherData = {
        name: selectedUser.name || "Nome não informado",
        courseIds: validCourseIds,
        disciplineIds: validDisciplineIds,
        status: data.status,
      };

      let result;

      if (editingTeacher || existingTeacher) {
        const teacherId = editingTeacher
          ? editingTeacher.id
          : existingTeacher!.id;
        result = await updateTeacher({
          id: teacherId,
          ...teacherData,
        });
      } else {
        result = await createTeacher(teacherData);
      }

      if (result && "error" in result) {
        alert(`Erro ao salvar professor: ${result.error}`);
        return;
      }

      const [teachersData, coursesData, usersData] = await Promise.all([
        getTeachers(),
        getCourses(),
        getUsers(),
      ]);

      setTeachers(teachersData as any);
      setCourses(coursesData.sort((a, b) => a.name.localeCompare(b.name)));
      setUsers(usersData as UserWithRoles[]);

      clearForm(); // Limpa o formulário após sucesso
      setIsDialogOpen(false);
      setTeacherSearchTerm("");
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
      alert("Erro ao salvar professor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (teacher: TeacherWithRelations) => {
    setEditingTeacher(teacher);

    const correspondingUser = users.find((user) => user.name === teacher.name);

    reset({
      userId: correspondingUser ? correspondingUser.id : "",
      courseIds: teacher.courses.map((c) => c.id),
      disciplineIds: teacher.disciplines.map((d) => d.id),
      status: teacher.status,
    });
    setIsDialogOpen(true);

    const coursesToExpand = new Set(teacher.courses.map((c) => c.name));
    setExpandedCourses(coursesToExpand);
  };

  const handleCourseSelect = (course: Course) => {
    const currentCourseIds = watch("courseIds");

    if (currentCourseIds.includes(course.id)) {
      setValue(
        "courseIds",
        currentCourseIds.filter((id) => id !== course.id)
      );
    } else {
      setValue("courseIds", [...currentCourseIds, course.id]);
    }
    setCourseSearchTerm("");
  };

  const handleUserSelect = (userId: string) => {
    if (selectedUserId === userId) {
      setValue("userId", "");
    } else {
      setValue("userId", userId, { shouldValidate: true });
    }
    setUserSearchTerm("");
  };

  const handleDisciplineToggle = (disciplineId: string, checked: boolean) => {
    const currentDisciplineIds = watch("disciplineIds");

    const discipline = availableDisciplines.find((d) => d.id === disciplineId);

    if (
      checked &&
      discipline?.isAssigned &&
      (!editingTeacher || discipline.assignedTo !== editingTeacher.name)
    ) {
      alert(
        `Esta disciplina já está atribuída ao professor: ${discipline.assignedTo}`
      );
      return;
    }

    if (checked) {
      setValue("disciplineIds", [...currentDisciplineIds, disciplineId]);
    } else {
      setValue(
        "disciplineIds",
        currentDisciplineIds.filter((id) => id !== disciplineId)
      );
    }
  };

  const clearTeacherSearch = () => {
    setTeacherSearchTerm("");
  };

  const clearCourseSearch = () => {
    setCourseSearchTerm("");
  };

  const clearUserSearch = () => {
    setUserSearchTerm("");
  };

  const selectAllDisciplinesInCourse = (courseName: string) => {
    const courseDisciplines = sortedDisciplinesByCourse[courseName] || [];
    const currentDisciplineIds = watch("disciplineIds");

    const availableDisciplines = courseDisciplines.filter(
      (discipline) =>
        !discipline.isAssigned ||
        (editingTeacher && discipline.assignedTo === editingTeacher.name)
    );

    const allSelected = availableDisciplines.every((d) =>
      currentDisciplineIds.includes(d.id)
    );

    if (allSelected) {
      const newDisciplineIds = currentDisciplineIds.filter(
        (id) => !availableDisciplines.some((d) => d.id === id)
      );
      setValue("disciplineIds", newDisciplineIds);
    } else {
      const availableDisciplineIds = availableDisciplines.map((d) => d.id);
      const newDisciplineIds = [
        ...new Set([...currentDisciplineIds, ...availableDisciplineIds]),
      ];
      setValue("disciplineIds", newDisciplineIds);
    }
  };

  const getSelectedUserInfo = () => {
    if (!selectedUserId) return null;
    return users.find((user) => user.id === selectedUserId);
  };

  const isUserAlreadyTeacher = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return false;

    return teachers.some((teacher) => teacher.name === user.name);
  };

  const hasProfessorRole = (user: UserWithRoles) => {
    return user.roles.some(
      (role) => role.name === "PROFESSOR" || role.name === "professor"
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Professores</h2>
          <p className="text-muted-foreground">
            Gerencie os docentes e suas informações
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              clearForm(); // Limpa o formulário quando o dialog fecha
            }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={clearForm} // LIMPA O FORMULÁRIO AO CLICAR EM "ADICIONAR PROFESSOR"
            >
              <Plus className="mr-2 h-4 w-4" />
              {editingTeacher ? "Editar Professor" : "Adicionar Professor"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher
                  ? `Editar Professor: ${editingTeacher.name}`
                  : "Adicionar Professor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId">
                  <User className="inline h-4 w-4 mr-2" />
                  {editingTeacher ? "Professor" : "Selecionar Usuário"}
                </Label>

                {(selectedUserId || editingTeacher) && (
                  <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {editingTeacher
                            ? "Professor em edição:"
                            : "Usuário selecionado:"}
                        </span>
                      </div>
                      <Badge variant="secondary">1 usuário</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() =>
                          !editingTeacher && setValue("userId", "")
                        }
                      >
                        <User className="h-3 w-3" />
                        {editingTeacher
                          ? editingTeacher.name
                          : getSelectedUserInfo()?.name}
                        {!editingTeacher &&
                          isUserAlreadyTeacher(selectedUserId!) && (
                            <Badge variant="secondary" className="ml-1 text-xs">
                              Professor
                            </Badge>
                          )}
                        {!editingTeacher && <X className="h-3 w-3" />}
                      </Badge>
                    </div>
                  </div>
                )}

                {!editingTeacher && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar usuários com perfil de professor..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {userSearchTerm && (
                        <X
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
                          onClick={clearUserSearch}
                        />
                      )}
                    </div>

                    {userSearchTerm && (
                      <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                          <div className="text-center py-2">
                            <p className="text-sm text-muted-foreground">
                              {users.length === 0
                                ? "Nenhum usuário encontrado"
                                : "Nenhum usuário com perfil de professor encontrado"}
                            </p>
                          </div>
                        ) : (
                          filteredUsers.map((user) => {
                            const isSelected = selectedUserId === user.id;
                            const isTeacher = isUserAlreadyTeacher(user.id);
                            const isProfessor = hasProfessorRole(user);

                            return (
                              <div
                                key={user.id}
                                className={`p-2 rounded cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary"
                                    : "hover:bg-muted/50"
                                } ${isTeacher ? "border-l-4 border-l-blue-500" : ""}`}
                                onClick={() => handleUserSelect(user.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                      <User className="h-3 w-3 text-primary" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">
                                          {user.name}
                                        </span>
                                        {isProfessor && (
                                          <Badge
                                            variant="default"
                                            className="text-xs bg-green-500"
                                          >
                                            Professor
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {user.email}
                                      </span>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}
                {errors.userId && (
                  <p className="text-sm text-red-500">
                    {errors.userId.message}
                  </p>
                )}
              </div>

              {/* SEÇÃO DE CURSOS - MODIFICADA PARA STATUS INACTIVE */}
              <div className="space-y-3">
                <Label>Cursos</Label>

                {watch("status") === "INACTIVE" ? (
                  <Alert className="bg-gray-50 border-gray-200">
                    <AlertDescription className="text-gray-600">
                      Professores inativos não podem ter cursos vinculados.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Digite o nome do curso..."
                        value={courseSearchTerm}
                        onChange={(e) => setCourseSearchTerm(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {courseSearchTerm && (
                        <X
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
                          onClick={clearCourseSearch}
                        />
                      )}
                    </div>

                    {selectedCourseIds.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCourseIds.map((courseId) => {
                          const course = courses.find((c) => c.id === courseId);
                          return course ? (
                            <Badge
                              key={courseId}
                              variant="secondary"
                              className="flex items-center gap-1 cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => handleCourseSelect(course)}
                            >
                              {course.name}
                              <X className="h-3 w-3" />
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    )}

                    {courseSearchTerm && (
                      <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
                        {filteredCourses.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Nenhum curso encontrado
                          </p>
                        ) : (
                          filteredCourses.map((course) => {
                            const isSelected = selectedCourseIds.includes(
                              course.id
                            );
                            return (
                              <div
                                key={course.id}
                                className={`p-2 rounded cursor-pointer transition-colors ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary"
                                    : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleCourseSelect(course)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">{course.name}</span>
                                  {isSelected && (
                                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}

                {errors.courseIds && (
                  <p className="text-sm text-red-500">
                    {errors.courseIds.message}
                  </p>
                )}
              </div>

              {/* SEÇÃO DE DISCIPLINAS - MODIFICADA PARA STATUS INACTIVE */}
              <div className="space-y-3">
                <Label>Disciplinas</Label>

                {watch("status") === "INACTIVE" ? (
                  <Alert className="bg-gray-50 border-gray-200">
                    <AlertDescription className="text-gray-600">
                      Professores inativos não podem ter disciplinas vinculadas.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div>
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Cada disciplina só pode ser atribuída a um professor.
                        Disciplinas já atribuídas estarão desabilitadas.
                      </AlertDescription>
                    </Alert>

                    <div className="border rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                      {availableDisciplines.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {selectedCourseIds.length === 0
                            ? "Selecione pelo menos um curso para ver as disciplinas disponíveis"
                            : "Nenhuma disciplina disponível para os cursos selecionados"}
                        </p>
                      ) : (
                        Object.entries(sortedDisciplinesByCourse).map(
                          ([courseName, disciplines]) => {
                            const isExpanded = expandedCourses.has(courseName);
                            const availableDisciplines = disciplines.filter(
                              (discipline) =>
                                !discipline.isAssigned ||
                                (editingTeacher &&
                                  discipline.assignedTo === editingTeacher.name)
                            );
                            const courseDisciplineIds =
                              availableDisciplines.map((d) => d.id);
                            const allSelected = courseDisciplineIds.every(
                              (id) => selectedDisciplineIds.includes(id)
                            );
                            const someSelected = courseDisciplineIds.some(
                              (id) => selectedDisciplineIds.includes(id)
                            );

                            return (
                              <div key={courseName} className="space-y-2">
                                <div
                                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg cursor-pointer"
                                  onClick={() =>
                                    toggleCourseExpansion(courseName)
                                  }
                                >
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      checked={allSelected}
                                      onCheckedChange={() =>
                                        selectAllDisciplinesInCourse(courseName)
                                      }
                                      onClick={(e) => e.stopPropagation()}
                                      disabled={
                                        availableDisciplines.length === 0
                                      }
                                    />
                                    <span className="font-medium text-sm">
                                      {courseName}
                                    </span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {availableDisciplines.length} de{" "}
                                      {disciplines.length} disponíveis
                                    </Badge>
                                  </div>
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </div>

                                {isExpanded && (
                                  <div className="ml-6 space-y-2 border-l-2 border-muted pl-4">
                                    {disciplines.map((discipline) => (
                                      <div
                                        key={discipline.id}
                                        className={`flex items-center space-x-2 py-1 ${
                                          discipline.isAssigned &&
                                          (!editingTeacher ||
                                            discipline.assignedTo !==
                                              editingTeacher.name)
                                            ? "opacity-50"
                                            : ""
                                        }`}
                                      >
                                        <Checkbox
                                          id={`discipline-${discipline.id}`}
                                          checked={selectedDisciplineIds.includes(
                                            discipline.id
                                          )}
                                          onCheckedChange={(checked) =>
                                            handleDisciplineToggle(
                                              discipline.id,
                                              checked as boolean
                                            )
                                          }
                                          disabled={
                                            discipline.isAssigned &&
                                            (!editingTeacher ||
                                              discipline.assignedTo !==
                                                editingTeacher.name)
                                          }
                                        />
                                        <Label
                                          htmlFor={`discipline-${discipline.id}`}
                                          className="text-sm font-normal cursor-pointer flex-1"
                                        >
                                          <div className="flex items-center justify-between">
                                            <span>{discipline.name}</span>
                                            {discipline.isAssigned && (
                                              <Badge
                                                variant="outline"
                                                className="text-xs ml-2"
                                              >
                                                {discipline.assignedTo ===
                                                editingTeacher?.name
                                                  ? "Sua disciplina"
                                                  : `Prof: ${discipline.assignedTo}`}
                                              </Badge>
                                            )}
                                          </div>
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          }
                        )
                      )}
                    </div>
                  </div>
                )}
                {errors.disciplineIds && (
                  <p className="text-sm text-red-500">
                    {errors.disciplineIds.message}
                  </p>
                )}
              </div>

              {/* SEÇÃO DE STATUS - COM ALERTA PARA INACTIVE */}
              <div className="space-y-3">
                <Label>Status do Professor</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Ativo</SelectItem>
                          <SelectItem value="INACTIVE">Inativo</SelectItem>
                        </SelectContent>
                      </Select>

                      {field.value === "INACTIVE" && (
                        <Alert className="bg-amber-50 border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <AlertDescription className="text-amber-800">
                            Professores inativos são automaticamente
                            desvinculados de todos os cursos e disciplinas.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingTeacher ? "Atualizando..." : "Salvando..."}
                    </>
                  ) : editingTeacher ? (
                    "Atualizar Professor"
                  ) : (
                    "Adicionar Professor"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative max-w-sm">
            <Input
              placeholder="Buscar professores por nome..."
              value={teacherSearchTerm}
              onChange={(e) => setTeacherSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            {teacherSearchTerm && (
              <X
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer hover:text-foreground"
                onClick={clearTeacherSearch}
              />
            )}
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="ACTIVE">Ativos</SelectItem>
            <SelectItem value="INACTIVE">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Professores</CardTitle>
          <CardDescription>
            {filteredTeachers.length} professores encontrados
            {statusFilter !== "ALL" &&
              ` (filtro: ${statusFilter === "ACTIVE" ? "Ativos" : "Inativos"})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando professores...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Cursos</TableHead>
                  <TableHead>Disciplinas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {teacher.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.courses.length > 0 ? (
                          teacher.courses.map((course) => (
                            <Badge
                              key={course.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {course.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            {teacher.status === "INACTIVE"
                              ? "Desvinculado (Inativo)"
                              : "Nenhum curso"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {teacher.disciplines.length > 0 ? (
                          teacher.disciplines.map((discipline) => (
                            <Badge
                              key={discipline.id}
                              variant="outline"
                              className="text-xs"
                            >
                              {discipline.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            {teacher.status === "INACTIVE"
                              ? "Desvinculado (Inativo)"
                              : "Nenhuma disciplina"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          teacher.status === "ACTIVE" ? "default" : "secondary"
                        }
                        className={
                          teacher.status === "ACTIVE"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-500 hover:bg-gray-600"
                        }
                      >
                        {translateTeacherStatus(teacher.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(teacher)}
                          disabled={isSubmitting}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
