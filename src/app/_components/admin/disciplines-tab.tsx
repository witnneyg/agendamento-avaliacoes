"use client";

import type React from "react";

import { useState } from "react";
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
import {
  academicCourses,
  disciplinesBySemesterAndDepartment,
} from "@/app/mocks";

interface Disciplina {
  id: string;
  name?: string;
  description: string;
  courseId: string;
  semesterId: string;
  status: "ativa" | "inativa";
}

// Converter disciplinas existentes para o novo formato
const disciplinasIniciais: Disciplina[] = [];
Object.entries(disciplinesBySemesterAndDepartment).forEach(
  ([courseId, semesters]) => {
    Object.entries(semesters).forEach(([semesterId, disciplinas]) => {
      disciplinas.forEach((disciplina) => {
        disciplinasIniciais.push({
          ...disciplina,
          courseId,
          semesterId,
          status: "ativa",
        });
      });
    });
  }
);

export function DisciplinesTab() {
  const [disciplinas, setDisciplinas] =
    useState<Disciplina[]>(disciplinasIniciais);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [disciplinaEditando, setDisciplinaEditando] =
    useState<Disciplina | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    courseId: "",
    semesterId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (disciplinaEditando) {
      // Atualizar disciplina existente
      setDisciplinas((prev) =>
        prev.map((disciplina) =>
          disciplina.id === disciplinaEditando.id
            ? { ...disciplina, ...formData }
            : disciplina
        )
      );
    } else {
      // Adicionar nova disciplina
      const novaDisciplina: Disciplina = {
        id: Date.now().toString(),
        ...formData,
        status: "ativa",
      };
      setDisciplinas((prev) => [...prev, novaDisciplina]);
    }

    // Resetar formulário
    setFormData({
      name: "",
      description: "",
      courseId: "",
      semesterId: "",
    });
    setDisciplinaEditando(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (disciplina: Disciplina) => {
    setDisciplinaEditando(disciplina);
    setFormData({
      name: disciplina.name ?? "",
      description: disciplina.description,
      courseId: disciplina.courseId,
      semesterId: disciplina.semesterId,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (disciplinaId: string) => {
    setDisciplinas((prev) =>
      prev.filter((disciplina) => disciplina.id !== disciplinaId)
    );
  };

  const getCurso = (courseId: string) => {
    return academicCourses.find((curso: any) => curso.id === courseId);
  };

  const getSemestre = (semesterId: string) => {
    return academicCourses.find((semestre: any) => semestre.id === semesterId);
    // return semestres.find((semestre: any) => semestre.id === semesterId);
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
                <Label htmlFor="title">Título da Disciplina</Label>
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
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Breve descrição da disciplina"
                  rows={3}
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
                    {academicCourses.map((curso: any) => (
                      <SelectItem key={curso.id} value={curso.id}>
                        {curso.title}
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
                    {/* {semestres.map((semestre: any) => (
                      <SelectItem key={semestre.id} value={semestre.id}>
                        {semestre.title}
                      </SelectItem>
                    ))} */}
                    semestres semestres semestres semestres semestres
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
                <TableHead>Descrição</TableHead>
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
                  <TableCell>{getCurso(disciplina.courseId)?.name}</TableCell>
                  <TableCell>
                    {getSemestre(disciplina.semesterId)?.name}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {disciplina.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        disciplina.status === "ativa" ? "default" : "secondary"
                      }
                    >
                      {disciplina.status}
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
