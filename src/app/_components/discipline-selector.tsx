"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getDisciplinesBySemester } from "../_actions/get-disciplines-by-semester";

export interface Discipline {
  id: string;
  name: string;
  description: string;
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

  useEffect(() => {
    async function fetch() {
      const data = await getDisciplinesBySemester(semesterId);

      setDisciplines(data);
    }

    fetch();
  }, []);

  console.log(semesterId);
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para períodos
      </Button>

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
                <p className="text-sm text-muted-foreground">
                  {discipline.description}
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
