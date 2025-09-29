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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

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
    Discipline[]
  >([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] =
    useState<TeacherWithRelations | null>(null);
  const [loadingDeleteId, setLoadingDeleteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        selectedCourseIds.map(getDisciplinesByCourseId)
      );
      const allDisciplines = disciplinesData.flat();

      setAvailableDisciplines(allDisciplines);

      const validDisciplineIds = watch("disciplineIds").filter((id) =>
        allDisciplines.some((d) => d.id === id)
      );
      setValue("disciplineIds", validDisciplineIds);
    }

    fetchDisciplines();
  }, [selectedCourseIds, setValue, watch]);

  const onSubmit = async (data: TeacherForm) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingTeacher) {
        // update no banco
        const updated = await updateTeacher({ id: editingTeacher.id, ...data });

        // atualiza no estado local
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

  const handleCourseToggle = (courseId: string, checked: boolean) => {
    const currentCourseIds = watch("courseIds");
    if (checked) {
      setValue("courseIds", [...currentCourseIds, courseId]);
    } else {
      setValue(
        "courseIds",
        currentCourseIds.filter((id) => id !== courseId)
      );
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
                <div className="border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={
                          selectedCourseIds?.includes(course.id) || false
                        }
                        onCheckedChange={(checked) =>
                          handleCourseToggle(course.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`course-${course.id}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {course.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.courseIds && (
                  <p className="text-sm text-red-500">
                    {errors.courseIds.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Disciplinas</Label>
                <div className="border rounded-lg p-4 space-y-3 max-h-48 overflow-y-auto">
                  {availableDisciplines.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Selecione pelo menos um curso para ver as disciplinas
                      disponíveis
                    </p>
                  ) : (
                    availableDisciplines.map((discipline) => (
                      <div
                        key={discipline.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`discipline-${discipline.id}`}
                          checked={
                            watch("disciplineIds")?.includes(discipline.id) ||
                            false
                          }
                          onCheckedChange={(checked) =>
                            handleDisciplineToggle(
                              discipline.id,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`discipline-${discipline.id}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {discipline.name}
                        </Label>
                      </div>
                    ))
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
