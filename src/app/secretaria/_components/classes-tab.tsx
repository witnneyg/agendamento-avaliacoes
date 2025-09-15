"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
import { Plus, Edit, Trash2, AlertTriangle } from "lucide-react";

import { getCourses } from "@/app/_actions/get-courses";
import { Class, Course, Prisma, Semester } from "@prisma/client";
import { getSemesterByCourse } from "@/app/_actions/get-semester-by-course-selected";
import { getDisciplinesBySemester } from "@/app/_actions/get-disciplines-by-semester";
import { DisciplineWithRelations } from "./disciplines-tab";
import { createClasses } from "@/app/_actions/create-classes";
import { getClasses } from "@/app/_actions/get-classes";
import { deleteClass } from "@/app/_actions/delete-classes";

export type ClassesWithRelations = Prisma.ClassGetPayload<{
  include: {
    course: true;
    semester: true;
    disciplines: true;
  };
}>;

export function ClassesTab() {
  const [classes, setClasses] = useState<ClassesWithRelations[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineWithRelations[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [editingClass, setEditingClass] = useState<ClassesWithRelations | null>(
    null
  );
  const [classToDelete, setClassToDelete] =
    useState<ClassesWithRelations | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    semesterId: "",
    disciplineId: "",
  });

  console.log(courses);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCourses();
      setCourses(data);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!formData.courseId) return;
    const fetch = async () => {
      const data = await getSemesterByCourse(formData.courseId);
      setSemesters(data);
    };
    fetch();
  }, [formData.courseId]);

  useEffect(() => {
    if (!formData.semesterId) return;
    const fetch = async () => {
      const data = await getDisciplinesBySemester(formData.semesterId);
      setDisciplines(data as any);
    };
    fetch();
  }, [formData.semesterId]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getClasses();
      setClasses(data);
    };
    fetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingClass) {
      setClasses((prev) =>
        prev.map((cls) =>
          cls.id === editingClass.id
            ? {
                ...cls,
                name: formData.name,
                course: courses.find((c) => c.id === formData.courseId)!,
                semester: semesters.find((s) => s.id === formData.semesterId)!,
                disciplines: disciplines.filter(
                  (d) => d.id === formData.disciplineId
                ),
              }
            : cls
        )
      );
    } else {
      const newClass = await createClasses({
        courseId: formData.courseId,
        name: formData.name,
        semesterId: formData.semesterId,
        disciplineId: formData.disciplineId,
      });
      setClasses((prev) => [...prev, newClass]);
    }

    setFormData({
      name: "",
      courseId: "",
      semesterId: "",
      disciplineId: "",
    });
    setEditingClass(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (cls: ClassesWithRelations) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      courseId: cls.courseId,
      semesterId: cls.semesterId,
      disciplineId: cls.disciplines[0]?.id || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (cls: ClassesWithRelations) => {
    await deleteClass(cls.id);

    setClassToDelete(cls);
  };

  const handleConfirmDelete = () => {
    if (classToDelete) {
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
              <DialogDescription>
                {editingClass
                  ? "Atualize as informações da turma"
                  : "Adicione uma nova turma ao sistema"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Turma</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Turma A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseId">Curso</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      courseId: value,
                      semesterId: "",
                      disciplineId: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semesterId">Semestre</Label>
                <Select
                  value={formData.semesterId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      semesterId: value,
                      disciplineId: "",
                    }))
                  }
                  disabled={!formData.courseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um semestre" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester.id} value={semester.id}>
                        {semester.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disciplineId">Disciplina</Label>
                <Select
                  value={formData.disciplineId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, disciplineId: value }))
                  }
                  disabled={!formData.courseId || !formData.semesterId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplines.map((discipline) => (
                      <SelectItem key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <CardDescription>
            {classes.length} turmas cadastradas no sistema
          </CardDescription>
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
                  <TableCell>
                    <div className="font-medium">{cls.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{cls.course.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{cls.semester.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {cls.disciplines.map((discipline) => discipline.name)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
                            onClick={() => handleDeleteClick(cls)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
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
                            <AlertDialogCancel
                              onClick={handleCancelDelete}
                              className="cursor-pointer"
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleConfirmDelete}
                              className="bg-red-500 hover:bg-red-600 cursor-pointer"
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
