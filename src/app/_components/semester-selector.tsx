"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { getSemesterByCourse } from "../_actions/get-semester-by-course-selected";

export interface Semester {
  id: string;
  name: string;
  description: string;
}

interface SemesterSelectorProps {
  courseId: string;
  onSelectSemester: (semester: Semester) => void;
  onBack: () => void;
}

export function SemesterSelector({
  courseId,
  onSelectSemester,
  onBack,
}: SemesterSelectorProps) {
  const [semesterByCourse, setSemesterByCourse] = useState<Semester[]>([]);

  useEffect(() => {
    async function fetch() {
      const data = await getSemesterByCourse(courseId);

      setSemesterByCourse(data);
    }

    fetch();
  }, []);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para cursos
      </Button>
      <div className="grid gap-4 md:grid-cols-2">
        {semesterByCourse.map((semester) => (
          <Card
            key={semester.id}
            className="cursor-pointer transition-all hover:bg-primary/5"
            onClick={() => onSelectSemester(semester)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex gap-2 items-center">
                  <h3 className="font-medium text-lg">{semester.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {semester.description}
                </p>
                <Button className="mt-2 w-full cursor-pointer">
                  Selecionar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
