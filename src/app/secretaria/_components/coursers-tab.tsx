"use client";

import type React from "react";
import { createCourse } from "@/app/_actions/create-course"; // Added import for createCourse

import { useEffect, useState } from "react";
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
import {
  Plus,
  Edit,
  Trash2,
  Code,
  Calculator,
  Flag as Flask,
  Globe,
  Microscope,
  Brain,
  Clock,
  Calendar,
} from "lucide-react";
import { getCourses } from "@/app/_actions/get-courses";
import { deleteCourse } from "@/app/_actions/delete-course";
import { Course } from "@prisma/client";

type Period = "MORNING" | "AFTERNOON" | "EVENING";

const PERIODS: Period[] = ["MORNING", "AFTERNOON", "EVENING"];
const SEMESTER_DURATIONS = Array.from({ length: 12 }, (_, i) => i + 1);

const iconMap = {
  cs: <Code className="h-5 w-5" />,
  medicine: <Microscope className="h-5 w-5" />,
  math: <Calculator className="h-5 w-5" />,
  biology: <Flask className="h-5 w-5" />,
  psychology: <Brain className="h-5 w-5" />,
  geography: <Globe className="h-5 w-5" />,
};

const periodLabels = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  EVENING: "Noite",
};

export function CoursesTab() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    periods: [] as Period[],
    semesterDuration: 8, // Default to 8 semesters
  });

  useEffect(() => {
    const fetch = async () => {
      const data = await getCourses();
      setCourses(data);
    };

    fetch();
  }, []);

  function statusPt(status: "ACTIVE" | "INACTIVE") {
    return status === "ACTIVE" ? "ativo" : "inativo";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id ? { ...course, ...formData } : course
        )
      );
    } else {
      // const newCourse = await createCourse(formData); // Used formData instead of empty object
      // setCourses((prev) => [...prev, newCourse]);
    }

    setFormData({
      name: "",
      periods: [],
      semesterDuration: 8,
    });
    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      periods: (course as any).periods || [],
      semesterDuration: (course as any).semesterDuration || 8,
    });
    setIsDialogOpen(true);
  };

  const handlePeriodToggle = (period: Period) => {
    setFormData((prev) => ({
      ...prev,
      periods: prev.periods.includes(period)
        ? prev.periods.filter((p) => p !== period)
        : [...prev.periods, period],
    }));
  };

  const handleSemesterDurationChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      semesterDuration: Number.parseInt(value),
    }));
  };

  const handleDelete = async (courseId: string) => {
    await deleteCourse(courseId);

    setCourseToDelete(courseId);
    setDeleteConfirmOpen(true);
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

  const toggleStatus = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              status: course.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : course
      )
    );
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Curso</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Ciência da Computação"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Períodos Disponíveis
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {PERIODS.map((period) => (
                    <div key={period} className="flex items-center space-x-2">
                      <Checkbox
                        id={period}
                        checked={formData.periods.includes(period)}
                        onCheckedChange={() => handlePeriodToggle(period)}
                      />
                      <Label
                        htmlFor={period}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {periodLabels[period]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Duração do Curso
                </Label>
                <Select
                  value={formData.semesterDuration.toString()}
                  onValueChange={handleSemesterDurationChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a duração em semestres" />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTER_DURATIONS.map((duration) => (
                      <SelectItem key={duration} value={duration.toString()}>
                        {duration} {duration === 1 ? "semestre" : "semestres"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer bg-transparent"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer">
                  {editingCourse ? "Atualizar" : "Adicionar"} Curso
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    {/* {iconMap[course. as keyof typeof iconMap] || iconMap.cs} */}
                  </div>
                  <div className="flex gap-2">
                    <CardTitle className="text-lg truncate">
                      {course.name}
                    </CardTitle>
                    <Badge
                      variant={
                        course.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {statusPt(course.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(course as any).periods &&
                  (course as any).periods.length > 0 && (
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

                {(course as any).semesterDuration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                      Duração: {(course as any).semesterDuration}{" "}
                      {(course as any).semesterDuration === 1
                        ? "semestre"
                        : "semestres"}
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm font-medium">
                    {courses.length} disciplinas
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleEdit(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleStatus(course.id)}
                      className={
                        course.status === "ACTIVE"
                          ? "text-yellow-500 cursor-pointer"
                          : "text-green-500 cursor-pointer"
                      }
                    >
                      {course.status === "ACTIVE" ? "Pausar" : "Ativar"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(course.id)}
                      className="text-red-500 hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="cursor-pointer">
              Tem certeza que deseja excluir este curso? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
