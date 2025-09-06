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
import { Textarea } from "@/components/ui/textarea";
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
import { Course, Discipline, Prisma, Semester } from "@prisma/client";
import { getCourses } from "@/app/_actions/get-courses";
import { getSemesters } from "@/app/_actions/get-semester";
import { translateTeacherStatus } from "@/utils/translate-teacher-status";
import { createDiscipline } from "@/app/_actions/create-discipline";

interface Disciplina {
  id: string;
  name?: string;
  description: string;
  courseId: string;
  semesterId: string;
  status: "ativa" | "inativa";
}

type DisciplineWithRelations = Prisma.DisciplineGetPayload<{
  include: {
    courses: true;
    semester: true;
  };
}>;

// Converter disciplinas existentes para o novo formato
// const disciplinasIniciais: Disciplina[] = [];
// Object.entries(disciplinesBySemesterAndDepartment).forEach(
//   ([courseId, semesters]) => {
//     Object.entries(semesters).forEach(([semesterId, disciplinas]) => {
//       disciplinas.forEach((disciplina) => {
//         disciplinasIniciais.push({
//           ...disciplina,
//           courseId,
//           semesterId,
//           status: "ativa",
//         });
//       });
//     });
//   }

export default function DisciplinesTab() {
  const [disciplinas, setDisciplinas] = useState<DisciplineWithRelations[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] =
    useState<Disciplina | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    semesterId: "",
  });

  console.log({ formData });

  useEffect(() => {
    const fetch = async () => {
      const data = await getDisciplines();
      setDisciplinas(data);
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
      const data = await getSemesters();
      setSemesters(data);
    };

    fetch();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDiscipline = await createDiscipline({
      courseId: formData.courseId,
      name: formData.name,
      semesterId: formData.semesterId,
    });

    setDisciplinas((prev) => [...prev, newDiscipline]);
    setFormData({
      name: "",
      courseId: "",
      semesterId: "",
    });
    setDisciplinaEditando(null);
    setIsDialogOpen(false);
  };

  console.log({ disciplinas });

  const handleEdit = (disciplina: DisciplineWithRelations) => {
    setFormData({
      name: disciplina.name ?? "",
      courseId: disciplina.id,
      semesterId: disciplina.semesterId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (disciplinaId: string) => {
    setDisciplinas((prev) =>
      prev.filter((disciplina) => disciplina.id !== disciplinaId)
    );
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
            <Button>
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
                <Label htmlFor="semesterId">Semestre</Label>
                <Select
                  value={formData.semesterId}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, semesterId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um semestre" />
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
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
                <TableHead>Semestre</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell>
                    <Badge
                      variant={
                        disciplina.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {translateTeacherStatus(disciplina.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(disciplina)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(disciplina.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
