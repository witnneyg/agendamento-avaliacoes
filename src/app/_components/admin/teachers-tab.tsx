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
import { Plus, Edit, Trash2, Mail, Phone } from "lucide-react";
import { academicCourses } from "@/app/mocks";

interface Teacher {
  id: string;
  name: string;
  course: string;
  discipline: string;
  status: "active" | "inactive";
}

const initialTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dra. Sarah Johnson",
    course: "cs",
    discipline: "Programação",
    status: "active",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    course: "math",
    discipline: "Programação",
    status: "active",
  },
  {
    id: "3",
    name: "Dra. Emily Rodriguez",
    course: "medicine",
    discipline: "Programação",
    status: "active",
  },
];

export function TeachersTab() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discipline: "",
    course: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTeacher) {
      // Atualiza professor existente
      setTeachers((prev) =>
        prev.map((teacher) =>
          teacher.id === editingTeacher.id
            ? { ...teacher, ...formData }
            : teacher
        )
      );
    } else {
      // Adiciona novo professor
      const newTeacher: Teacher = {
        id: Date.now().toString(),
        ...formData,
        status: "active",
      };
      setTeachers((prev) => [...prev, newTeacher]);
    }

    // Reseta formulário
    setFormData({
      name: "",
      email: "",
      discipline: "",
      course: "",
    });
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: "",
      email: "",
      discipline: "",
      course: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (teacherId: string) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId));
  };

  const getDepartmentName = (departmentId: string) => {
    const department = academicCourses.find(
      (course) => course.id === departmentId
    );
    return department?.name || departmentId;
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
              {/* <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="joao.silva@university.edu"
                  required
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="department">Curso</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, course: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicCourses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Disciplina</Label>
                <Select
                  value={formData.discipline}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, discipline: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicCourses.map((course: any) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
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
                  <TableCell>{getDepartmentName(teacher.course)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        {teacher.discipline}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        teacher.status === "active" ? "default" : "secondary"
                      }
                    >
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
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
