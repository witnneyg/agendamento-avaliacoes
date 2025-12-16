"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Period } from "@prisma/client";

import { getIconByName } from "../_helpers/getIconByName";
import { getUser } from "../_actions/user/getUser";
import { getTeacherByUserId } from "../_actions/teacher/get-teacher-by-user-id";
import { getTeacherCourses } from "../_actions/teacher/get-teacher-courses";

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
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    async function fetchCourses() {
      if (!teacherId && !filterByUser) {
        setHasFetched(false);
        return;
      }

      setIsLoading(true);
      setHasFetched(false);

      try {
        let coursesData: Course[] = [];

        if (teacherId) {
          coursesData = (await getTeacherCourses(teacherId)) ?? [];
        } else {
          const user = await getUser();
          if (!user) {
            setCourses([]);
            return;
          }

          const teacher = await getTeacherByUserId(user.id);
          if (!teacher) {
            setCourses([]);
            return;
          }

          coursesData = (await getTeacherCourses(teacher.id)) ?? [];
        }

        setCourses(coursesData);
      } catch {
        setCourses([]);
      } finally {
        setIsLoading(false);
        setHasFetched(true);
      }
    }

    fetchCourses();
  }, [teacherId, filterByUser]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-10">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Carregando cursos...</span>
      </div>
    );
  }
  if (hasFetched && courses.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <div className="rounded-lg border bg-muted/40 px-6 py-4 text-center">
          <p className="font-medium">Cursos indisponíveis</p>
          <p className="text-sm text-muted-foreground">
            Nenhum curso foi encontrado.
          </p>
        </div>
      </div>
    );
  }

  if (courses.length > 0) {
    return (
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          {courses.length} curso(s) encontrado(s)
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const icon = getIconByName(course.name);

            return (
              <Card
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="cursor-pointer border-2 transition hover:border-primary/50 hover:shadow-md"
              >
                <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                  <div className="rounded-full bg-primary/10 p-3">{icon}</div>

                  <div>
                    <h3 className="text-lg font-semibold">{course.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <Button className="w-full">Selecionar curso</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
