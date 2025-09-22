"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDisciplinesBySemester } from "../_actions/get-disciplines-by-semester";

export interface Discipline {
  id: string;
  name: string;
}

interface DisciplineSelectorProps {
  semesterId: string;
  onSelectDiscipline: (discipline: Discipline) => void;
  onBack: () => void;
}

export function DisciplineSelector({
  semesterId,
  onSelectDiscipline,
  onBack,
}: DisciplineSelectorProps) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const data = await getDisciplinesBySemester(semesterId);
        setDisciplines(data);
      } finally {
        setIsLoading(false);
      }
    }

    fetch();
  }, [semesterId]);

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para períodos
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando disciplinas...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {disciplines.map((discipline) => (
            <Card
              key={discipline.id}
              className="cursor-pointer transition-all hover:bg-primary/5"
              onClick={() => onSelectDiscipline(discipline)}
            >
              <CardContent className="p-6 h-full">
                <div className="flex flex-col space-y-2 h-full justify-between">
                  <h3 className="font-medium text-lg">{discipline.name}</h3>
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
