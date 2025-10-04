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
  Plus,
  Edit,
  Trash2,
  Loader2,
  Search,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { getTeachers } from "@/app/_actions/get-teacher";
import { getCourses } from "@/app/_actions/get-courses";
import { getDisciplinesByCourseId } from "@/app/_actions/get-discipline-by-course-id";
import { createTeacher } from "@/app/_actions/create-teacher";
import { deleteTeacher } from "@/app/_actions/delete-teacher";
import type { Course, Discipline, Prisma } from "@prisma/client";
import { translateTeacherStatus } from "@/utils/translate-teacher-status";
import { updateTeacher } from "../_actions/update-teacher";

type TeacherWithRelations = Prisma.TeacherGetPayload<{
  include: { courses: true; disciplines: true };
}>;

type DisciplineWithCourse = Discipline & { courseName: string };

const teacherSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  courseIds: z.array(z.string()).min(1, "Selecione pelo menos um curso"),
  disciplineIds: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma disciplina"),
});

type TeacherForm = z.infer<typeof teacherSchema>;

export function TeachersTab() {
  const [teachers, setTeachers] = useState<TeacherWithRelations[]>([]);
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
    defaultValues: { name: "", courseIds: [], disciplineIds: [] },
  });

  const selectedCourseIds = watch("courseIds");
  const selectedDisciplineIds = watch("disciplineIds");

  // Filtrar cursos baseado no termo de busca
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agrupar disciplinas por curso
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

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const teachersData = await getTeachers();
        setTeachers(teachersData as any);
        const coursesData = await getCourses();
        setCourses(coursesData);
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

      // Auto-expandir cursos quando selecionados
      const newExpanded = new Set(expandedCourses);
      selectedCourseIds.forEach((courseId) => {
        const course = courses.find((c) => c.id === courseId);
        if (course) {
          newExpanded.add(course.name);
        }
      });
      setExpandedCourses(newExpanded);

      // Manter apenas disciplinas válidas selecionadas
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
      if (editingTeacher) {
        const updated = await updateTeacher({ id: editingTeacher.id, ...data });
        setTeachers((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
      } else {
        await createTeacher(data);
        const updatedTeachers = await getTeachers();
        setTeachers(updatedTeachers as any);
      }

      reset();
      setEditingTeacher(null);
      setIsDialogOpen(false);
      setSearchTerm("");
      setExpandedCourses(new Set());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (teacher: TeacherWithRelations) => {
    setEditingTeacher(teacher);
    reset({
      name: teacher.name,
      courseIds: teacher.courses.map((c) => c.id),
      disciplineIds: teacher.disciplines.map((d) => d.id),
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

  const selectAllDisciplinesInCourse = (courseName: string) => {
    const courseDisciplines = disciplinesByCourse[courseName] || [];
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
              reset({ name: "", courseIds: [], disciplineIds: [] });
              setEditingTeacher(null);
              setSearchTerm("");
              setExpandedCourses(new Set());
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Professor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher
                  ? "Editar Professor"
                  : "Adicionar Novo Professor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

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
                    Object.entries(disciplinesByCourse).map(
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
                      {editingTeacher ? "Atualizando..." : "Adicionando..."}
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

      <Card>
        <CardHeader>
          <CardTitle>Todos os Professores</CardTitle>
          <CardDescription>
            {teachers.length} professores cadastrados
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
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
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
