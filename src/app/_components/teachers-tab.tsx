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
  Trash2,
  Loader2,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Users,
} from "lucide-react";

import { getTeachers } from "@/app/_actions/get-teacher";
import { getCourses } from "@/app/_actions/get-courses";
import { getDisciplinesByCourseId } from "@/app/_actions/get-discipline-by-course-id";
import { createTeacher } from "@/app/_actions/create-teacher";
import { deleteTeacher } from "@/app/_actions/delete-teacher";
import { getUsers } from "@/app/_actions/get-users";
import type {
  Course,
  Discipline,
  Prisma,
  User as UserType,
} from "@prisma/client";
import { translateTeacherStatus } from "@/utils/translate-teacher-status";
import { updateTeacher } from "../_actions/update-teacher";

type TeacherWithRelations = Prisma.TeacherGetPayload<{
  include: { courses: true; disciplines: true };
}>;

type DisciplineWithCourse = Discipline & { courseName: string };

const teacherSchema = z.object({
  userIds: z.array(z.string()).min(1, "Selecione pelo menos um professor"),
  courseIds: z.array(z.string()).min(1, "Selecione pelo menos um curso"),
  disciplineIds: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma disciplina"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type TeacherForm = z.infer<typeof teacherSchema>;

export function TeachersTab() {
  const [teachers, setTeachers] = useState<TeacherWithRelations[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [availableDisciplines, setAvailableDisciplines] = useState<
    DisciplineWithCourse[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] =
    useState<TeacherWithRelations | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
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
      userIds: [],
      courseIds: [],
      disciplineIds: [],
      status: "ACTIVE",
    },
  });

  const selectedCourseIds = watch("courseIds");
  const selectedDisciplineIds = watch("disciplineIds");
  const selectedUserIds = watch("userIds");

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch = teacher.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || teacher.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCourses = courses
    .filter((course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

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

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const teachersData = await getTeachers();
        setTeachers(teachersData as any);
        const coursesData = await getCourses();
        setCourses(coursesData.sort((a, b) => a.name.localeCompare(b.name)));
        const usersData = await getUsers();
        setUsers(usersData);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

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
          return disciplines.map((discipline) => ({
            ...discipline,
            courseName: course?.name || "Curso não encontrado",
          }));
        })
      );

      const allDisciplines = disciplinesData.flat();
      setAvailableDisciplines(allDisciplines);

      const newExpanded = new Set(expandedCourses);
      selectedCourseIds.forEach((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          newExpanded.add(course.name);
        }
      });
      setExpandedCourses(newExpanded);

      const validDisciplineIds = selectedDisciplineIds.filter((id) =>
        allDisciplines.some((d) => d.id === id)
      );
      setValue("disciplineIds", validDisciplineIds);
    }

    fetchDisciplines();
  }, [selectedCourseIds, setValue, watch, courses]);

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
      const selectedUsers = users.filter((user) =>
        data.userIds.includes(user.id)
      );

      if (selectedUsers.length === 0) {
        alert("Nenhum usuário selecionado");
        return;
      }

      const results = await Promise.allSettled(
        selectedUsers.map(async (user) => {
          const teacherData = {
            name: user.name || "Nome não informado",
            courseIds: data.courseIds,
            disciplineIds: data.disciplineIds,
            status: data.status,
          };

          const existingTeacher = teachers.find(
            (teacher) => teacher.name === user.name
          );

          if (existingTeacher) {
            return await updateTeacher({
              id: existingTeacher.id,
              ...teacherData,
            });
          } else {
            return await createTeacher(teacherData);
          }
        })
      );

      const failedResults = results.filter(
        (result) => result.status === "rejected"
      );
      if (failedResults.length > 0) {
        console.error("Alguns professores falharam:", failedResults);
        alert(
          `Erro ao salvar ${failedResults.length} professores. Verifique o console.`
        );
      }

      const updatedTeachers = await getTeachers();
      setTeachers(updatedTeachers as any);

      reset();
      setEditingTeacher(null);
      setIsDialogOpen(false);
      setSearchTerm("");
      setUserSearchTerm("");
      setExpandedCourses(new Set());
    } catch (error) {
      console.error("Erro ao salvar professores:", error);
      alert("Erro ao salvar professores. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (teacher: TeacherWithRelations) => {
    setEditingTeacher(teacher);

    // Para edição, selecionar apenas o usuário correspondente ao professor
    const correspondingUser = users.find((user) => user.name === teacher.name);

    reset({
      userIds: correspondingUser ? [correspondingUser.id] : [],
      courseIds: teacher.courses.map((c) => c.id),
      disciplineIds: teacher.disciplines.map((d) => d.id),
      status: teacher.status,
    });
    setIsDialogOpen(true);

    // Expandir todos os cursos ao editar
    const coursesToExpand = new Set(teacher.courses.map((c) => c.name));
    setExpandedCourses(coursesToExpand);
  };

  const handleDelete = async (teacherId: string) => {
    setLoadingDeleteId(teacherId);
    try {
      await deleteTeacher(teacherId);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
    } finally {
      setLoadingDeleteId(null);
    }
  };

  const handleCourseSelect = (courseId: string) => {
    const currentCourseIds = watch("courseIds");

    if (currentCourseIds.includes(courseId)) {
      setValue(
        "courseIds",
        currentCourseIds.filter((id) => id !== courseId)
      );
    } else {
      setValue("courseIds", [...currentCourseIds, courseId]);
    }
  };

  const handleUserToggle = (userId: string, checked: boolean) => {
    const currentUserIds = watch("userIds");
    let newUserIds: string[];

    if (checked) {
      newUserIds = [...currentUserIds, userId];
    } else {
      newUserIds = currentUserIds.filter((id) => id !== userId);
    }

    setValue("userIds", newUserIds, { shouldValidate: true });
  };

  const handleDisciplineToggle = (disciplineId: string, checked: boolean) => {
    const currentDisciplineIds = watch("disciplineIds");
    if (checked) {
      setValue("disciplineIds", [...currentDisciplineIds, disciplineId]);
    } else {
      setValue(
        "disciplineIds",
        currentDisciplineIds.filter((id) => id !== disciplineId)
      );
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const clearUserSearch = () => {
    setUserSearchTerm("");
  };

  const selectAllDisciplinesInCourse = (courseName: string) => {
    const courseDisciplines = sortedDisciplinesByCourse[courseName] || [];
    const currentDisciplineIds = watch("disciplineIds");

    const allSelected = courseDisciplines.every((d) =>
      currentDisciplineIds.includes(d.id)
    );

    if (allSelected) {
      // Desmarcar todas
      const newDisciplineIds = currentDisciplineIds.filter(
        (id) => !courseDisciplines.some((d) => d.id === id)
      );
      setValue("disciplineIds", newDisciplineIds);
    } else {
      // Marcar todas
      const courseDisciplineIds = courseDisciplines.map((d) => d.id);
      const newDisciplineIds = [
        ...new Set([...currentDisciplineIds, ...courseDisciplineIds]),
      ];
      setValue("disciplineIds", newDisciplineIds);
    }
  };

  const selectAllUsers = () => {
    const currentUserIds = watch("userIds");
    const allSelected = filteredUsers.every((user) =>
      currentUserIds.includes(user.id)
    );

    if (allSelected) {
      // Desmarcar todos
      setValue("userIds", []);
    } else {
      // Marcar todos
      setValue(
        "userIds",
        filteredUsers.map((user) => user.id)
      );
    }
  };

  const getSelectedUsersInfo = () => {
    return selectedUserIds
      .map((userId) => {
        const user = users.find((u) => u.id === userId);
        return user;
      })
      .filter(Boolean);
  };

  const isUserAlreadyTeacher = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return teachers.some((teacher) => teacher.name === user?.name);
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
              reset({
                userIds: [],
                courseIds: [],
                disciplineIds: [],
                status: "ACTIVE",
              });
              setEditingTeacher(null);
              setSearchTerm("");
              setUserSearchTerm("");
              setExpandedCourses(new Set());
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {editingTeacher ? "Editar Professor" : "Gerenciar Professores"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher
                  ? `Editar Professor: ${editingTeacher.name}`
                  : "Adicionar/Atualizar Professores"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {!editingTeacher && (
                <div className="space-y-2">
                  <Label htmlFor="userIds">
                    <User className="inline h-4 w-4 mr-2" />
                    Selecionar Usuários ({selectedUserIds.length} selecionados)
                  </Label>

                  {selectedUserIds.length > 0 && (
                    <div className="mb-3 p-3 bg-primary/10 rounded-lg border border-primary">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-medium">
                            Usuários selecionados:
                          </span>
                        </div>
                        <Badge variant="secondary">
                          {selectedUserIds.length} usuários
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {getSelectedUsersInfo().map((user) => (
                          <Badge
                            key={user!.id}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <User className="h-3 w-3" />
                            {user!.name}
                            {isUserAlreadyTeacher(user!.id) && (
                              <Badge
                                variant="secondary"
                                className="ml-1 text-xs"
                              >
                                Professor
                              </Badge>
                            )}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => handleUserToggle(user!.id, false)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Buscar usuários por nome ou email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10 pr-10"
                      />
                      {userSearchTerm && (
                        <X
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer"
                          onClick={clearUserSearch}
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllUsers}
                      className="ml-2"
                    >
                      {filteredUsers.every((user) =>
                        selectedUserIds.includes(user.id)
                      )
                        ? "Desmarcar Todos"
                        : "Selecionar Todos"}
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                    {filteredUsers.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {userSearchTerm
                          ? "Nenhum usuário encontrado"
                          : "Nenhum usuário disponível"}
                      </p>
                    ) : (
                      filteredUsers.map((user) => {
                        const isSelected = selectedUserIds.includes(user.id);
                        const isTeacher = isUserAlreadyTeacher(user.id);

                        return (
                          <div
                            key={user.id}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-primary/10 border-primary"
                                : "hover:bg-muted/50"
                            } ${isTeacher ? "border-l-4 border-l-blue-500" : ""}`}
                            onClick={(e) => {
                              // Prevenir que o clique no checkbox dispare também o clique no container
                              if (
                                (e.target as HTMLElement).closest(
                                  'button, input, [role="checkbox"]'
                                )
                              ) {
                                return;
                              }
                              handleUserToggle(user.id, !isSelected);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">
                                      {user.name}
                                    </span>
                                    {isTeacher && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
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
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    handleUserToggle(
                                      user.id,
                                      checked as boolean
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  {errors.userIds && (
                    <p className="text-sm text-red-500">
                      {errors.userIds.message}
                    </p>
                  )}
                </div>
              )}

              {editingTeacher && (
                <div className="space-y-2">
                  <Label>
                    <User className="inline h-4 w-4 mr-2" />
                    Editando Professor: {editingTeacher.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Você está editando as informações do professor{" "}
                    {editingTeacher.name}. Para alterar o usuário associado,
                    cancele a edição e crie um novo professor.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Label>Cursos</Label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchTerm && (
                    <X
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 cursor-pointer"
                      onClick={clearSearch}
                    />
                  )}
                </div>

                {selectedCourseIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedCourseIds.map((courseId) => {
                      const course = courses.find((c) => c.id === courseId);
                      return course ? (
                        <Badge
                          key={courseId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {course.name}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() => handleCourseSelect(courseId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}

                <div className="border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                  {filteredCourses.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      {searchTerm
                        ? "Nenhum curso encontrado"
                        : "Nenhum curso disponível"}
                    </p>
                  ) : (
                    filteredCourses.map((course) => {
                      const isSelected = selectedCourseIds.includes(course.id);
                      return (
                        <div
                          key={course.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10 border-primary"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => handleCourseSelect(course.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {course.name}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {errors.courseIds && (
                  <p className="text-sm text-red-500">
                    {errors.courseIds.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Disciplinas</Label>
                <div className="border rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                  {availableDisciplines.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Selecione pelo menos um curso para ver as disciplinas
                      disponíveis
                    </p>
                  ) : (
                    Object.entries(sortedDisciplinesByCourse).map(
                      ([courseName, disciplines]) => {
                        const isExpanded = expandedCourses.has(courseName);
                        const courseDisciplineIds = disciplines.map(
                          (d) => d.id
                        );
                        const allSelected = courseDisciplineIds.every((id) =>
                          selectedDisciplineIds.includes(id)
                        );
                        const someSelected = courseDisciplineIds.some((id) =>
                          selectedDisciplineIds.includes(id)
                        );

                        return (
                          <div key={courseName} className="space-y-2">
                            {/* Cabeçalho do curso */}
                            <div
                              className="flex items-center justify-between p-2 bg-muted/30 rounded-lg cursor-pointer"
                              onClick={() => toggleCourseExpansion(courseName)}
                            >
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={() =>
                                    selectAllDisciplinesInCourse(courseName)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="font-medium text-sm">
                                  {courseName}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {disciplines.length} disciplinas
                                </Badge>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>

                            {/* Lista de disciplinas (expandida) */}
                            {isExpanded && (
                              <div className="ml-6 space-y-2 border-l-2 border-muted pl-4">
                                {disciplines.map((discipline) => (
                                  <div
                                    key={discipline.id}
                                    className="flex items-center space-x-2 py-1"
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
                                    />
                                    <Label
                                      htmlFor={`discipline-${discipline.id}`}
                                      className="text-sm font-normal cursor-pointer flex-1"
                                    >
                                      {discipline.name}
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
                {errors.disciplineIds && (
                  <p className="text-sm text-red-500">
                    {errors.disciplineIds.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Status do Professor</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Ativo</SelectItem>
                        <SelectItem value="INACTIVE">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
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
                    "Aplicar aos Professores"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar professores por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
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
                            Nenhum curso
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
                            Nenhuma disciplina
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
                          disabled={
                            isSubmitting || loadingDeleteId === teacher.id
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-600"
                              disabled={
                                isSubmitting || loadingDeleteId === teacher.id
                              }
                            >
                              {loadingDeleteId === teacher.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar Exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este professor?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDelete(teacher.id)}
                                disabled={loadingDeleteId === teacher.id}
                              >
                                {loadingDeleteId === teacher.id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Excluindo...
                                  </>
                                ) : (
                                  "Excluir"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
