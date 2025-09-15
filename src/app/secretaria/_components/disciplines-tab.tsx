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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { getDisciplines } from "@/app/_actions/get-disciplines";
import type { Class, Course, Prisma, Semester } from "@prisma/client";
import { getCourses } from "@/app/_actions/get-courses";
import { translateTeacherStatus } from "@/utils/translate-teacher-status";
import { createDiscipline } from "@/app/_actions/create-discipline";
import { getClassBySemesterId } from "@/app/_actions/get-class-by-semester-id";
import { getSemesterByCourse } from "@/app/_actions/get-semester-by-course-selected";

interface Disciplina {
  id: string;
  name?: string;
  description: string;
  courseId: string;
  semesterId: string;
  status: "ativa" | "inativa";
}

export type DisciplineWithRelations = Prisma.DisciplineGetPayload<{
  include: {
    courses: true;
    semester: true;
    class: true;
  };
}>;

export default function DisciplinesTab() {
  const [disciplinas, setDisciplinas] = useState<DisciplineWithRelations[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] =
    useState<Disciplina | null>(null);
  const [disciplinaParaDeletar, setDisciplinaParaDeletar] =
    useState<DisciplineWithRelations | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    semesterId: "",
    classId: "",
  });

  useEffect(() => {
    const fetch = async () => {
      const data = await getDisciplines();
      setDisciplinas(data as any);
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
      const data = await getSemesterByCourse(formData.courseId);
      setSemesters(data);
    };

    fetch();
  }, [formData.courseId]);
  useEffect(() => {
    const fetch = async () => {
      const data = await getClassBySemesterId(formData.semesterId);
      setClasses(data);
    };

    fetch();
  }, [formData.semesterId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDiscipline = await createDiscipline({
      courseId: formData.courseId,
      name: formData.name,
      semesterId: formData.semesterId,
      classId: formData.classId,
    });

    setDisciplinas((prev) => [...prev, newDiscipline]);
    setFormData({
      name: "",
      courseId: "",
      semesterId: "",
      classId: "",
    });
    setDisciplinaEditando(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (disciplina: DisciplineWithRelations) => {
    setFormData({
      name: disciplina.name ?? "",
      courseId: disciplina.id,
      semesterId: disciplina.semesterId,
      classId: disciplina.classId ?? "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (disciplina: DisciplineWithRelations) => {
    setDisciplinaParaDeletar(disciplina);
  };

  const handleConfirmDelete = () => {
    if (disciplinaParaDeletar) {
      setDisciplinas((prev) =>
        prev.filter((disciplina) => disciplina.id !== disciplinaParaDeletar.id)
      );
      setDisciplinaParaDeletar(null);
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
          <DialogContent className="max-w-md">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nome da Disciplina</Label>
                <Input
                  id="title"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Introdução à Programação"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseId">Curso</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, courseId: value }))
                  }
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="semesterId">Período</Label>
                <Select
                  value={formData.semesterId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, semesterId: value }))
                  }
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="classId">Turma</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, classId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
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
                  {disciplinaEditando ? "Atualizar" : "Adicionar"} Disciplina
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Turma</TableHead>
                {/* <TableHead>Status</TableHead> */}
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
                  <TableCell>{disciplina.class?.name}</TableCell>
                  {/* <TableCell>
                    <Badge
                      variant={
                        disciplina.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {translateTeacherStatus(disciplina.status)}
                    </Badge>
                  </TableCell> */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => handleEdit(disciplina)}
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
                              Tem certeza que deseja excluir esta disciplina?
                              Esta ação não pode ser desfeita.
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
