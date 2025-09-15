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
import { Plus, Edit, Trash2 } from "lucide-react";

import { getCourses } from "@/app/_actions/get-courses";
import { getSemesterByCourse } from "@/app/_actions/get-semester-by-course-selected";
import { getDisciplinesBySemester } from "@/app/_actions/get-disciplines-by-semester";
import { createClasses } from "@/app/_actions/create-classes";
import { getClasses } from "@/app/_actions/get-classes";
import { deleteClass } from "@/app/_actions/delete-classes";

import type { Course, Prisma, Semester } from "@prisma/client";
import type { DisciplineWithRelations } from "./disciplines-tab";

export type ClassesWithRelations = Prisma.ClassGetPayload<{
  include: { course: true; semester: true; disciplines: true };
}>;

const classSchema = z.object({
  name: z.string().min(1, "Nome da turma é obrigatório"),
  courseId: z.string().min(1, "Selecione um curso"),
  semesterId: z.string().min(1, "Selecione um período"),
  disciplineId: z.string().min(1, "Selecione uma disciplina"),
});

type ClassForm = z.infer<typeof classSchema>;

export function ClassesTab() {
  const [classes, setClasses] = useState<ClassesWithRelations[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineWithRelations[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassesWithRelations | null>(
    null
  );
  const [classToDelete, setClassToDelete] =
    useState<ClassesWithRelations | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClassForm>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      courseId: "",
      semesterId: "",
      disciplineId: "",
    },
  });

  const selectedCourseId = watch("courseId");
  const selectedSemesterId = watch("semesterId");

  useEffect(() => {
    async function fetchData() {
      const coursesData = await getCourses();
      setCourses(coursesData);
      const classesData = await getClasses();
      setClasses(classesData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setSemesters([]);
      setValue("semesterId", "");
      setValue("disciplineId", "");
      return;
    }

    async function fetchSemesters() {
      const semestersData = await getSemesterByCourse(selectedCourseId);
      setSemesters(semestersData);
      setValue("semesterId", "");
      setValue("disciplineId", "");
    }

    fetchSemesters();
  }, [selectedCourseId, setValue]);

  useEffect(() => {
    if (!selectedSemesterId) {
      setDisciplines([]);
      setValue("disciplineId", "");
      return;
    }

    async function fetchDisciplines() {
      const disciplinesData =
        await getDisciplinesBySemester(selectedSemesterId);
      setDisciplines(disciplinesData as any);
      setValue("disciplineId", "");
    }

    fetchDisciplines();
  }, [selectedSemesterId, setValue]);

  const onSubmit = async (data: ClassForm) => {
    if (editingClass) {
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === editingClass.id
            ? {
                ...cls,
                name: data.name,
                course: courses.find((c) => c.id === data.courseId)!,
                semester: semesters.find((s) => s.id === data.semesterId)!,
                disciplines: disciplines.filter(
                  (d) => d.id === data.disciplineId
                ),
              }
            : cls
        )
      );
    } else {
      const newClass = await createClasses(data);
      setClasses((prev) => [...prev, newClass]);
    }
    reset();
    setEditingClass(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cls: ClassesWithRelations) => {
    setEditingClass(cls);
    reset({
      name: cls.name,
      courseId: cls.course.id,
      semesterId: cls.semester.id,
      disciplineId: cls.disciplines[0]?.id || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (cls: ClassesWithRelations) => {
    setClassToDelete(cls);
  };

  const handleConfirmDelete = async () => {
    if (classToDelete) {
      await deleteClass(classToDelete.id);
      setClasses((prev) => prev.filter((cls) => cls.id !== classToDelete.id));
      setClassToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setClassToDelete(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Turmas</h2>
          <p className="text-muted-foreground">
            Gerencie as turmas e suas configurações
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingClass ? "Editar Turma" : "Nova Turma"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Turma</Label>
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
                        <SelectValue placeholder="Selecione um curso" />
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
                <Label htmlFor="semesterId">Período</Label>
                <Controller
                  name="semesterId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={semesters.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um período" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.semesterId && (
                  <p className="text-sm text-red-500">
                    {errors.semesterId.message}
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
                        <SelectValue placeholder="Selecione uma disciplina" />
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
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingClass ? "Atualizar" : "Criar"} Turma
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Turmas</CardTitle>
          <CardDescription>{classes.length} turmas cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Turma</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell>{cls.name}</TableCell>
                  <TableCell>{cls.course.name}</TableCell>
                  <TableCell>{cls.semester.name}</TableCell>
                  <TableCell>
                    {cls.disciplines.map((d) => d.name).join(", ")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(cls)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteClick(cls)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar Exclusão
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta turma? Esta
                              ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={handleCancelDelete}>
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConfirmDelete}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Excluir
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
        </CardContent>
      </Card>
    </div>
  );
}
