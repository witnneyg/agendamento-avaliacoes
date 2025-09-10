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
import { Plus, Edit, Trash2 } from "lucide-react";
import { getTeachers } from "@/app/_actions/get-teacher";
import type { Course, Discipline, Prisma, Teacher } from "@prisma/client";
import { translateTeacherStatus } from "@/utils/translate-teacher-status";
import { getCourses } from "@/app/_actions/get-courses";
import { getDisciplinesByCourseId } from "@/app/_actions/get-discipline-by-course-id";
import { createTeacher } from "@/app/_actions/create-teacher";

type TeacherWithRelations = Prisma.TeacherGetPayload<{
  include: { courses: true; disciplines: true };
}>;

export function TeachersTab() {
  const [teachers, setTeachers] = useState<TeacherWithRelations[]>([]);
  const [coursers, setCourses] = useState<Course[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<string | null>(null);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    disciplineId: "",
    courseId: "",
  });

  useEffect(() => {
    const fetch = async () => {
      const data = await getTeachers();
      setTeachers(data as any);
    };

    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCourses();
      setCourses(data);
    };

    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      const data = await getDisciplinesByCourseId(formData.courseId);
      setDisciplines(data);
    };

    fetch();
  }, [formData.courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, ...formData }
            : teacher
        )
      );
    } else {
      await createTeacher({
        name: formData.name,
        courseId: formData.courseId,
        disciplineId: formData.disciplineId,
      });

      const updatedTeachers = await getTeachers();
      setTeachers(updatedTeachers as any);
    }

    setFormData({
      name: "",
      disciplineId: "",
      courseId: "",
    });
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: "",
      disciplineId: "",
      courseId: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (teacherId: string) => {
    setTeacherToDelete(teacherId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      setTeachers((prev) =>
        prev.filter((teacher) => teacher.id !== teacherToDelete)
      );
      setTeacherToDelete(null);
    }
    setDeleteConfirmOpen(false);
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
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
              <DialogDescription>
                {editingTeacher
                  ? "Atualize as informações do professor"
                  : "Adicione um novo professor ao sistema"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Dr. João Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Curso</Label>

                <Select
                  value={formData.courseId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, courseId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursers.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discipline">Disciplina</Label>
                <Select
                  value={formData.disciplineId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, disciplineId: value }))
                  }
                  disabled={!formData.courseId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a disciplina" />
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
                  className="cursor-pointer"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="cursor-pointer">
                  {editingTeacher ? "Atualizar" : "Adicionar"} Professor
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
            {teachers.length} professores cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead></TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{teacher.name}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {teacher.courses?.map((course) => (
                      <div key={course.id}>{course.name}</div>
                    )) ?? (
                      <div className="text-sm text-gray-400">Nenhum curso</div>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      {teacher.disciplines.length > 0 ? (
                        teacher.disciplines.map((discipline) => (
                          <div
                            key={discipline.id}
                            className="flex items-center text-sm"
                          >
                            {discipline.name}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-400">
                          Nenhuma disciplina
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell></TableCell>

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
                        className="cursor-pointer"
                        onClick={() => handleEdit(teacher)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(teacher.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 cursor-pointer" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este professor? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancelar
            </AlertDialogCancel>
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
