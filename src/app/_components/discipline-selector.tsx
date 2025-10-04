"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDisciplinesByClass } from "../_actions/get-disciplines-by-class";
import { Discipline } from "@prisma/client";
import { getOrderedPeriods } from "../_helpers/getOrderedPeriods";

interface DisciplineSelectorProps {
  classId: string;
  semesterId: string;
  onSelectDiscipline: (discipline: Discipline) => void;
  onBack: () => void;
}

export function DisciplineSelector({
  classId,
  onSelectDiscipline,
  onBack,
}: DisciplineSelectorProps) {
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function fetch() {
      setIsLoading(true);
      try {
        const data = await getDisciplinesByClass(classId);
        setDisciplines(data);
      } finally {
        setIsLoading(false);
      }
    }

    fetch();
  }, [classId]);
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para turmas
      </Button>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando disciplinas...</span>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {disciplines.length > 0 ? (
            disciplines.map((discipline) => (
              <Card
                key={discipline.id}
                className="cursor-pointer transition-all hover:bg-primary/5"
                onClick={() => onSelectDiscipline(discipline)}
              >
                <CardContent className="p-6 h-full">
                  <div className="flex flex-col space-y-2 h-full justify-between">
                    <h3 className="font-medium text-lg">{discipline.name}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {getOrderedPeriods(discipline.dayPeriods).map(
                        (period) => (
                          <span
                            key={period.value}
                            className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
                          >
                            {period.label}
                          </span>
                        )
                      )}
                    </div>
                    <Button className="mt-2 w-full cursor-pointer">
                      Selecionar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-muted-foreground">
                Nenhuma disciplina disponível para esta turma.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
