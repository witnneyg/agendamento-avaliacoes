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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import type { Class, Course, Prisma, Semester } from "@prisma/client";

import { getDisciplines } from "@/app/_actions/get-disciplines";
import { getCourses } from "@/app/_actions/get-courses";
import { createDiscipline } from "@/app/_actions/create-discipline";
import { getClassBySemesterId } from "@/app/_actions/get-class-by-semester-id";
import { getSemesterByCourse } from "@/app/_actions/get-semester-by-course-selected";
import { deleteDiscipline } from "../_actions/delete-discipline";

const disciplineSchema = z.object({
  name: z.string().min(1, "O nome da disciplina é obrigatório"),
  courseId: z.string().min(1, "O curso é obrigatório"),
  semesterId: z.string().min(1, "O período é obrigatório"),
  // classId: z.string().min(1, "A turma é obrigatória"),
});

type DisciplineFormData = z.infer<typeof disciplineSchema>;

export type DisciplineWithRelations = Prisma.DisciplineGetPayload<{
  include: {
    courses: true;
    semester: true;
    // class: true;
  };
}>;

export default function DisciplinesTab() {
  const [disciplinas, setDisciplinas] = useState<DisciplineWithRelations[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] =
    useState<DisciplineWithRelations | null>(null);
  const [disciplinaParaDeletar, setDisciplinaParaDeletar] =
    useState<DisciplineWithRelations | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DisciplineFormData>({
    resolver: zodResolver(disciplineSchema),
    defaultValues: {
      name: "",
      courseId: "",
      semesterId: "",
      // classId: "",
    },
  });

  const selectedCourseId = watch("courseId");
  const selectedSemesterId = watch("semesterId");

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const disciplinesData = await getDisciplines();
        setDisciplinas(disciplinesData as any);

        const coursesData = await getCourses();
        setCourses(coursesData);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchSemesters() {
      if (!selectedCourseId) {
        setSemesters([]);
        setValue("semesterId", "");
        // setValue("classId", "");
        return;
      }
      const semestersData = await getSemesterByCourse(selectedCourseId);
      setSemesters(semestersData);
      setValue("semesterId", "");
      // setValue("classId", "");
    }
    fetchSemesters();
  }, [selectedCourseId, setValue]);

  useEffect(() => {
    async function fetchClasses() {
      if (!selectedSemesterId) {
        setClasses([]);
        // setValue("classId", "");
        return;
      }
      const classesData = await getClassBySemesterId(selectedSemesterId);
      setClasses(classesData);
      // setValue("classId", "");
    }
    fetchClasses();
  }, [selectedSemesterId, setValue]);

  const onSubmit = async (data: DisciplineFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newDiscipline = await createDiscipline(data);
      setDisciplinas((prev) => [...prev, newDiscipline]);
      reset();
      setDisciplinaEditando(null);
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (disciplina: DisciplineWithRelations) => {
    reset({
      name: disciplina.name ?? "",
      courseId: disciplina.id,
      semesterId: disciplina.semesterId,
      // classId: disciplina.classId ?? "",
    });
    setDisciplinaEditando(disciplina);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (disciplina: DisciplineWithRelations) => {
    setDisciplinaParaDeletar(disciplina);
  };

  const handleConfirmDelete = async () => {
    if (!disciplinaParaDeletar || isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteDiscipline(disciplinaParaDeletar.id);

      setDisciplinas((prev) =>
        prev.filter((d) => d.id !== disciplinaParaDeletar.id)
      );
      setDisciplinaParaDeletar(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDisciplinaParaDeletar(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Disciplinas</h2>
          <p className="text-muted-foreground">
            Gerencie as disciplinas e matérias dos cursos
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Disciplina
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md [&>button]:cursor-pointer">
            <DialogHeader>
              <DialogTitle>
                {disciplinaEditando ? "Editar Disciplina" : "Nova Disciplina"}
              </DialogTitle>
              <DialogDescription>
                {disciplinaEditando
                  ? "Atualize as informações da disciplina"
                  : "Adicione uma nova disciplina ao sistema"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome da Disciplina</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Introdução à Programação" />
                  )}
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
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((curso) => (
                          <SelectItem key={curso.id} value={curso.id}>
                            {curso.name}
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
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um período" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semestre) => (
                          <SelectItem key={semestre.id} value={semestre.id}>
                            {semestre.name}
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

              {/* <div className="space-y-2">
                <Label htmlFor="classId">Turma</Label>
                <Controller
                  name="classId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.classId && (
                  <p className="text-sm text-red-500">
                    {errors.classId.message}
                  </p>
                )}
              </div> */}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {disciplinaEditando ? "Atualizando..." : "Criando..."}
                    </>
                  ) : (
                    <>
                      {disciplinaEditando ? "Atualizar" : "Adicionar"}{" "}
                      Disciplina
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Disciplinas</CardTitle>
          <CardDescription>
            {disciplinas.length} disciplinas cadastradas em todos os cursos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Carregando disciplinas...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead></TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {disciplinas.map((disciplina) => (
                  <TableRow key={disciplina.id}>
                    <TableCell className="font-medium">
                      {disciplina.name}
                    </TableCell>
                    <TableCell>
                      {disciplina.courses.map((item) => item.name)}
                    </TableCell>
                    <TableCell>{disciplina.semester.name}</TableCell>
                    <TableCell></TableCell>
                    {/* <TableCell>{disciplina.class?.name}</TableCell> */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer"
                          onClick={() => handleEdit(disciplina)}
                          disabled={isSubmitting || isDeleting}
                        >
                          <Edit className="h-4 w-4 " />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(disciplina)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              disabled={isSubmitting || isDeleting}
                            >
                              {isDeleting ? (
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
                                Tem certeza que deseja excluir esta disciplina?
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={handleCancelDelete}
                                className="cursor-pointer"
                                disabled={isDeleting}
                              >
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleConfirmDelete}
                                className="bg-red-500 hover:bg-red-600 cursor-pointer"
                                disabled={isDeleting}
                              >
                                {isDeleting ? (
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
