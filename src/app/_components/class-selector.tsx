"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getClassesByCourse } from "../_actions/get-class-by-course-id";
import { Class } from "@prisma/client";
import { getClassBySemesterId } from "../_actions/get-class-by-semester-id";

interface ClassSelectorProps {
  semesterId: string;
  onSelectClass: (cls: Class) => void;
  onBack: () => void;
}

export function ClassSelector({
  semesterId,
  onSelectClass,
  onBack,
}: ClassSelectorProps) {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      setIsLoading(true);
      try {
        const data = await getClassBySemesterId(semesterId);
        setClasses(data as any);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClasses();
  }, [semesterId]);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para cursos
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando turmas...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="cursor-pointer transition-all hover:bg-primary/5"
              onClick={() => onSelectClass(cls)}
            >
              <CardContent className="p-6 h-full">
                <div className="flex flex-col space-y-2 h-full justify-between">
                  <h3 className="font-medium text-lg">{cls.name}</h3>
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
