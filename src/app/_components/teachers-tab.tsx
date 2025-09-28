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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

import { getTeachers } from "@/app/_actions/get-teacher";
import { getCourses } from "@/app/_actions/get-courses";
import { getDisciplinesByCourseId } from "@/app/_actions/get-discipline-by-course-id";
import { createTeacher } from "@/app/_actions/create-teacher";
import { deleteTeacher } from "@/app/_actions/delete-teacher";
import type { Course, Discipline, Prisma, Teacher } from "@prisma/client";
import { translateTeacherStatus } from "@/utils/translate-teacher-status";

type TeacherWithRelations = Prisma.TeacherGetPayload<{
  include: { courses: true; disciplines: true };
}>;

const teacherSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  courseId: z.string().min(1, "Selecione um curso"),
  disciplineId: z.string().min(1, "Selecione uma disciplina"),
});

type TeacherForm = z.infer<typeof teacherSchema>;

export function TeachersTab() {
  const [teachers, setTeachers] = useState<TeacherWithRelations[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
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
    defaultValues: { name: "", courseId: "", disciplineId: "" },
  });

  const selectedCourseId = watch("courseId");

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
      if (!selectedCourseId) {
        setDisciplines([]);
        return;
      }
      const disciplinesData = await getDisciplinesByCourseId(selectedCourseId);
      setDisciplines(disciplinesData);
    }
    fetchDisciplines();
  }, [selectedCourseId]);

  const onSubmit = async (data: TeacherForm) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingTeacher) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === editingTeacher.id ? { ...t, ...data } : t))
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
      courseId: teacher.courses[0]?.id || "",
      disciplineId: teacher.disciplines[0]?.id || "",
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
              reset({ name: "", courseId: "", disciplineId: "" });
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTeacher
                  ? "Editar Professor"
                  : "Adicionar Novo Professor"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="space-y-2">
                <Label htmlFor="courseId">Curso</Label>
                <Controller
                  name="courseId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.courseId && (
                  <p className="text-sm text-red-500">
                    {errors.courseId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="disciplineId">Disciplina</Label>
                <Controller
                  name="disciplineId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={disciplines.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplines.map((d) => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.disciplineId && (
                  <p className="text-sm text-red-500">
                    {errors.disciplineId.message}
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
                  <TableHead>Curso</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.name}</TableCell>
                    <TableCell>
                      {teacher.courses.map((c) => c.name).join(", ") ||
                        "Nenhum curso"}
                    </TableCell>
                    <TableCell>
                      {teacher.disciplines.map((d) => d.name).join(", ") ||
                        "Nenhuma disciplina"}
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
