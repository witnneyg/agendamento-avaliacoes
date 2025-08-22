"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";
import { Period } from "@prisma/client";

export interface TimePeriod {
  id: string;
  title: string;
  period: string;
  icon: React.ReactNode;
  description: string;
}

interface TimePeriodSelectorProps {
  timePeriods: TimePeriod[];
  coursePeriod: Period[];
  onSelectTimePeriod: (timePeriod: TimePeriod) => void;
  onBack: () => void;
}

export function TimePeriodSelector({
  timePeriods,
  coursePeriod,
  onSelectTimePeriod,
  onBack,
}: TimePeriodSelectorProps) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar para datas
      </Button>

      <div className="grid gap-4 md:grid-cols-3">
        {timePeriods.map((timePeriod) => {
          const isAvailable = coursePeriod.includes(
            timePeriod.id.toUpperCase() as Period
          );

          return (
            <Card
              key={timePeriod.id}
              className={`transition-all ${
                isAvailable
                  ? "cursor-pointer hover:shadow-md"
                  : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => isAvailable && onSelectTimePeriod(timePeriod)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    {timePeriod.icon}
                  </div>
                  <h3 className="font-medium text-lg">{timePeriod.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium">
                    {timePeriod.period}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timePeriod.description}
                  </p>
                  <Button className="mt-2 w-full" disabled={!isAvailable}>
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
