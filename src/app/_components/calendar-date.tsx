import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";

interface CalendarDateProps {
  date: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onBack?: () => void;
}

export function CalendarDate({
  date,
  onSelectDate,
  onBack,
}: CalendarDateProps) {
  return (
    <div className="flex flex-col space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="self-start mb-2"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Voltar a disciplinas
      </Button>
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelectDate}
          disabled={(date) =>
            date < new Date() || date.getDay() === 0 || date.getDay() === 6
          }
          locale={ptBR}
          className="rounded-md border"
        />
      </div>
    </div>
  );
}
