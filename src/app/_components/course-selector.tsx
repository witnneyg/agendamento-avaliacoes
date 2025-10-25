"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getIconByName } from "../_helpers/getIconByName";
import { Period } from "@prisma/client";
import { getCourses } from "../_actions/get-courses";
import { getUser } from "../_actions/getUser";
import { getTeacherByUserId } from "../_actions/get-teacher-by-user-id";
import { getTeacherCourses } from "../_actions/get-teacher-courses";

export interface Course {
  id: string;
  name: string;
  periods: Period[];
  description: string;
}

interface CourseSelectorProps {
  onSelectCourse: (course: Course) => void;
  teacherId?: string;
  filterByUser?: boolean;
}

export function CourseSelector({
  onSelectCourse,
  teacherId,
  filterByUser = false,
}: CourseSelectorProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      setIsLoading(true);
      setError(null);

      console.log("CourseSelector - Iniciando busca:", {
        teacherId,
        filterByUser,
      });

      try {
        // Se não tem teacherId nem filterByUser, não busca nada
        if (!teacherId && !filterByUser) {
          console.log("Nenhum filtro especificado - não buscando cursos");
          setCourses([]);
          return;
        }

        let coursesData: Course[] = [];

        if (teacherId) {
          // Busca cursos do professor específico
          console.log("Buscando cursos para o professor:", teacherId);
          coursesData = await getTeacherCourses(teacherId);
          console.log("Cursos do professor encontrados:", coursesData);
        } else if (filterByUser) {
          // Busca cursos do usuário logado
          console.log("Buscando cursos para o usuário logado");
          const userData = await getUser();

          if (!userData) {
            setError("Usuário não encontrado");
            setCourses([]);
            return;
          }

          const teacherData = await getTeacherByUserId(userData.id);

          if (!teacherData) {
            setError("Professor não encontrado para este usuário");
            setCourses([]);
            return;
          }

          coursesData = await getTeacherCourses(teacherData.id);
          console.log("Cursos do usuário logado encontrados:", coursesData);
        }

        setCourses(coursesData || []);
      } catch (error) {
        console.error("Erro ao carregar cursos:", error);
        setError("Erro ao carregar cursos. Tente novamente.");
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourses();
  }, [teacherId, filterByUser]);

  // Estados de renderização
  if (isLoading) {
    const loadingMessage =
      teacherId || filterByUser
        ? "Carregando seus cursos..."
        : "Aguardando seleção...";

    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">{loadingMessage}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-destructive/10 p-4 rounded-lg max-w-md mx-auto">
          <p className="text-destructive font-medium mb-2">Erro</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    const noCoursesMessage =
      teacherId || filterByUser
        ? "Nenhum curso encontrado"
        : "Nenhum curso disponível";

    const noCoursesDescription =
      teacherId || filterByUser
        ? "Você não está associado a nenhum curso no momento."
        : "Não há cursos cadastrados no sistema.";

    return (
      <div className="text-center py-8">
        <div className="bg-muted/50 p-6 rounded-lg max-w-md mx-auto">
          <p className="font-medium mb-2">{noCoursesMessage}</p>
          <p className="text-sm text-muted-foreground">
            {noCoursesDescription}
          </p>
        </div>
      </div>
    );
  }

  // Renderização dos cursos
  const coursesCountMessage =
    teacherId || filterByUser
      ? `${courses.length} curso(s) disponível(eis) para você`
      : `${courses.length} curso(s) disponível(eis)`;

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">{coursesCountMessage}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => {
          const icon = getIconByName(course.name);

          return (
            <Card
              key={course.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 border-2"
              onClick={() => onSelectCourse(course)}
            >
              <CardContent className="p-6 h-full">
                <div className="flex flex-col items-center text-center space-y-3 h-full justify-between">
                  <div className="bg-primary/10 p-3 rounded-full hover:bg-primary/15 transition-colors">
                    {icon}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {course.name}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="w-full">
                    <div className="flex flex-wrap gap-1 justify-center mb-3">
                      {course.periods.map((period) => (
                        <span
                          key={period}
                          className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                        >
                          {period === Period.MORNING && "Matutino"}
                          {period === Period.AFTERNOON && "Vespertino"}
                          {period === Period.EVENING && "Noturno"}
                        </span>
                      ))}
                    </div>

                    <Button className="w-full cursor-pointer">
                      Selecionar Curso
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
