"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getIconByName } from "../_helpers/getIconByName";
import { Period } from "@prisma/client";
import { getCourses } from "../_actions/get-courses";

export interface Course {
  id: string;
  name: string;
  periods: Period[];
  description: string;
}

interface CourseSelectorProps {
  onSelectCourse: (course: Course) => void;
}

export function CourseSelector({ onSelectCourse }: CourseSelectorProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const data = await getCourses();
        setCourses(data);
      } finally {
        setIsLoading(false);
      }
    }

    fetch();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando cursos...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3">
          {courses.map((course) => {
            const icon = getIconByName(course.name);

            return (
              <Card
                key={course.id}
                className="cursor-pointer transition-all hover:bg-primary/5"
                onClick={() => onSelectCourse(course)}
              >
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col items-center text-center space-y-3 h-full justify-between">
                    <div className="bg-primary/10 p-3 rounded-full hover:bg-primary/15">
                      {icon}
                    </div>
                    <h3 className="font-medium text-lg">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.description}
                    </p>
                    <Button className="mt-2 w-full cursor-pointer">
                      Selecionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
