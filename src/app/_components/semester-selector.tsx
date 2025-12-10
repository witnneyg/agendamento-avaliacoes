"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getSemestersByCourseForTeacher } from "../_actions/semesters/get-semesters-by-course-for-teacher";

export interface Semester {
  id: string;
  name: string;
  description: string;
}

interface SemesterSelectorProps {
  courseId: string;
  teacherId: string;
  onSelectSemester: (semester: Semester) => void;
  onBack: () => void;
}

export function SemesterSelector({
  courseId,
  teacherId,
  onSelectSemester,
  onBack,
}: SemesterSelectorProps) {
  const [semesterByCourse, setSemesterByCourse] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const data = await getSemestersByCourseForTeacher(courseId, teacherId);
        setSemesterByCourse(data);
      } finally {
        setIsLoading(false);
      }
    }

    fetch();
  }, [courseId]);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para cursos
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando períodos...</span>
        </div>
      ) : (
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
                  <Button className="mt-2 w-full cursor-pointer">
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
