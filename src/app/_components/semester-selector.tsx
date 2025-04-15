"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, NotebookPen } from "lucide-react";
import { JSX } from "react";

export interface Semester {
  id: string;
  title: string;
  icon: JSX.Element;
  description: string;
}

interface SemesterSelectorProps {
  semesters: Semester[];
  onSelectSemester: (semester: Semester) => void;
  onBack: () => void;
}

export function SemesterSelector({
  semesters,
  onSelectSemester,
  onBack,
}: SemesterSelectorProps) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para cursos
      </Button>

      <div className="grid gap-4 md:grid-cols-2">
        {semesters.map((semester) => (
          <Card
            key={semester.id}
            className="cursor-pointer transition-all hover:bg-primary/5"
            onClick={() => onSelectSemester(semester)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col space-y-2">
                <div className="flex gap-2 items-center">
                  {semester.icon}
                  <h3 className="font-medium text-lg">{semester.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {semester.description}
                </p>
                <Button className="mt-2 w-full">Selecionar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
