"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  Code,
  Calculator,
  FlaskRoundIcon as Flask,
  Globe,
  Microscope,
  Brain,
} from "lucide-react";
import { academicCourses } from "@/app/mocks";

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "active" | "inactive";
  disciplineCount: number;
}

const iconMap = {
  cs: <Code className="h-5 w-5" />,
  medicine: <Microscope className="h-5 w-5" />,
  math: <Calculator className="h-5 w-5" />,
  biology: <Flask className="h-5 w-5" />,
  psychology: <Brain className="h-5 w-5" />,
  geography: <Globe className="h-5 w-5" />,
};

const initialCourses: Course[] = academicCourses.map((course: any) => ({
  id: course.id,
  title: course.title,
  description: course.description,
  icon: course.id,
  status: "active" as const,
  disciplineCount: Math.floor(Math.random() * 10) + 5, // Contagem aleatória para demonstração
}));

export function CoursesTab() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "cs",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCourse) {
      // Atualiza curso existente
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id ? { ...course, ...formData } : course
        )
      );
    } else {
      // Adiciona novo curso
      const newCourse: Course = {
        id: formData.title.toLowerCase().replace(/\s+/g, "-"),
        ...formData,
        status: "active",
        disciplineCount: 0,
      };
      setCourses((prev) => [...prev, newCourse]);
    }

    // Reseta formulário
    setFormData({
      title: "",
      description: "",
      icon: "cs",
    });
    setEditingCourse(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      icon: course.icon,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (courseId: string) => {
    setCourses((prev) => prev.filter((course) => course.id !== courseId));
  };

  const toggleStatus = (courseId: string) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              status: course.status === "active" ? "inactive" : "active",
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
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Curso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Curso</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Ciência da Computação"
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
                  placeholder="Breve descrição do curso"
                  rows={3}
                  required
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
                    {iconMap[course.icon as keyof typeof iconMap] || iconMap.cs}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge
                      variant={
                        course.status === "active" ? "default" : "secondary"
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {course.disciplineCount} disciplinas
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(course)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleStatus(course.id)}
                    className={
                      course.status === "active"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    {course.status === "active" ? "Pausar" : "Ativar"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(course.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
