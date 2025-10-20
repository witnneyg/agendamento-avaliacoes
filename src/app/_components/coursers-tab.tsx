"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCourse } from "@/app/_actions/create-course";
import { getCourses } from "@/app/_actions/get-courses";
import { deleteCourse } from "@/app/_actions/delete-course";
import type { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Edit, Trash2, Clock, Calendar, Loader2 } from "lucide-react";
import { updateCourse } from "../_actions/update-course";

type Period = "MORNING" | "AFTERNOON" | "EVENING";

const PERIODS: Period[] = ["MORNING", "AFTERNOON", "EVENING"];
const SEMESTER_DURATIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const periodLabels = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  EVENING: "Noite",
};

const courseSchema = z.object({
  name: z.string().min(1, "O nome do curso é obrigatório"),
  periods: z
    .array(z.enum(["MORNING", "AFTERNOON", "EVENING"]))
    .min(1, "Selecione pelo menos um período"),
  semesterDuration: z
    .number()
    .min(1, "A duração deve ser de pelo menos 1 período"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export function CoursesTab() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      periods: [],
      semesterDuration: 0,
    },
  });

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await getCourses();
        setCourses(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  const onSubmit = async (data: CourseFormData) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const courseData = {
        ...data,
        name: data.name.toUpperCase(),
      };

      if (editingCourse) {
        const updatedCourse = await updateCourse({
          id: editingCourse.id,
          ...courseData,
        });

        setCourses((prev) =>
          prev.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          )
        );
      } else {
        const newCourse = await createCourse(courseData);
        setCourses((prev) => [...prev, newCourse]);
      }

      reset();
      setEditingCourse(null);
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    reset({
      name: course.name,
      periods: (course as any).periods || [],
      semesterDuration: (course as any).semesterDuration || 8,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (courseId: string) => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await deleteCourse(courseId);
      setCourseToDelete(courseId);
      setDeleteConfirmOpen(true);
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      setCourses((prev) =>
        prev.filter((course) => course.id !== courseToDelete)
      );
      setCourseToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cursos</h2>
          <p className="text-muted-foreground">
            Gerencie cursos acadêmicos e departamentos
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              reset({ name: "", periods: [], semesterDuration: 0 });
              setEditingCourse(null);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl [&>button]:cursor-pointer">
            <DialogHeader>
              <DialogTitle>
                {editingCourse ? "Editar Curso" : "Adicionar Novo Curso"}
              </DialogTitle>
              <DialogDescription>
                {editingCourse
                  ? "Atualize as informações do curso"
                  : "Adicione um novo curso ao sistema"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Curso</Label>
                <Input
                  id="name"
                  placeholder="Ciência da Computação"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Períodos Disponíveis
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {PERIODS.map((period) => (
                    <div key={period} className="flex items-center space-x-2">
                      <Controller
                        name="periods"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            id={period}
                            checked={field.value.includes(period)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                field.onChange([...field.value, period]);
                              } else {
                                field.onChange(
                                  field.value.filter((p) => p !== period)
                                );
                              }
                            }}
                          />
                        )}
                      />
                      <Label htmlFor={period}>{periodLabels[period]}</Label>
                    </div>
                  ))}
                </div>
                {errors.periods && (
                  <p className="text-sm text-red-500">
                    {errors.periods.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Duração do Curso
                </Label>
                <Controller
                  name="semesterDuration"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value ? field.value.toString() : undefined}
                      onValueChange={(val) => field.onChange(Number(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a duração em períodos" />
                      </SelectTrigger>
                      <SelectContent>
                        {SEMESTER_DURATIONS.map((duration) => (
                          <SelectItem
                            key={duration}
                            value={duration.toString()}
                          >
                            {duration} {duration === 1 ? "período" : "períodos"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.semesterDuration && (
                  <p className="text-sm text-red-500">
                    {errors.semesterDuration.message}
                  </p>
                )}
              </div>

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
                      {editingCourse ? "Atualizando..." : "Adicionando..."}
                    </>
                  ) : (
                    `${editingCourse ? "Atualizar" : "Adicionar"} Curso`
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Carregando cursos...
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.periods && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="flex gap-1 flex-wrap">
                        {(course as any).periods.map((period: Period) => (
                          <Badge
                            key={period}
                            variant="outline"
                            className="text-xs"
                          >
                            {periodLabels[period]}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {course.semesterDuration && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        {(course as any).semesterDuration} períodos
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(course)}
                      disabled={isSubmitting || isDeleting}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(course.id)}
                      className="text-red-500"
                      disabled={isSubmitting || isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este curso?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
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
  );
}
