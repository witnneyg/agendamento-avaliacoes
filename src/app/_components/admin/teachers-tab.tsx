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
  email: string;
  phone: string;
  department: string;
  specialization: string;
  bio: string;
  status: "active" | "inactive";
}

const initialTeachers: Teacher[] = [
  {
    id: "1",
    name: "Dra. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "(555) 123-4567",
    department: "cs",
    specialization: "Engenharia de Software, IA",
    bio: "Especialista em desenvolvimento de software e inteligência artificial com mais de 10 anos de experiência.",
    status: "active",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@university.edu",
    phone: "(555) 234-5678",
    department: "math",
    specialization: "Cálculo, Álgebra Linear",
    bio: "Professor de matemática especializado em cálculo avançado e álgebra linear.",
    status: "active",
  },
  {
    id: "3",
    name: "Dra. Emily Rodriguez",
    email: "emily.rodriguez@university.edu",
    phone: "(555) 345-6789",
    department: "medicine",
    specialization: "Anatomia, Fisiologia",
    bio: "Médica e educadora com expertise em anatomia e fisiologia humana.",
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
    phone: "",
    department: "",
    specialization: "",
    bio: "",
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
      phone: "",
      department: "",
      specialization: "",
      bio: "",
    });
    setEditingTeacher(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      specialization: teacher.specialization,
      bio: teacher.bio,
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
              <div className="space-y-2">
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="(555) 123-4567"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
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
                <Label htmlFor="specialization">Especialização</Label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specialization: e.target.value,
                    }))
                  }
                  placeholder="Ex.: Engenharia de Software, IA"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Breve descrição da experiência e expertise"
                  rows={3}
                />
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
                <TableHead>Departamento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Especialização</TableHead>
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
                      <div className="text-sm text-muted-foreground">
                        {teacher.bio}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getDepartmentName(teacher.department)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="mr-1 h-3 w-3" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="mr-1 h-3 w-3" />
                        {teacher.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{teacher.specialization}</TableCell>
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
