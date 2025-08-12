"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  useEffect(() => {
    const fetch = async () => {
      const data = await getCourses();
      setCourses(data);
    };

    fetch();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-3 ">
      {courses.map((course) => {
        const icon = getIconByName(course.name);

        return (
          <Card
            key={course.id}
            className="cursor-pointer transition-all hover:bg-primary/5"
            onClick={() => onSelectCourse(course)}
          >
            <CardContent className="p-6  h-full">
              <div className="flex flex-col items-center text-center space-y-3 h-full  justify-between">
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
  );
}
