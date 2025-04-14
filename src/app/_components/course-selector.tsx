"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Course {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface CourseSelectorProps {
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export function CourseSelector({
  courses,
  onSelectCourse,
}: CourseSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 ">
      {courses.map((course) => (
        <Card
          key={course.id}
          className="cursor-pointer transition-all hover:bg-primary/5"
          onClick={() => onSelectCourse(course)}
        >
          <CardContent className="p-6  h-full">
            <div className="flex flex-col items-center text-center space-y-3 h-full  justify-between">
              <div className="bg-primary/10 p-3 rounded-full hover:bg-primary/15">
                {course.icon}
              </div>
              <h3 className="font-medium text-lg">{course.title}</h3>
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
              <Button className="mt-2 w-full cursor-pointer">Selecionar</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
