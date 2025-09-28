import { Moon, Sun, Sunset } from "lucide-react";
import { TimePeriod } from "./_components/time-period.selector";

export const timePeriods: TimePeriod[] = [
  {
    id: "morning",
    title: "Matutino",
    period: "8:00 AM - 12:00 PM",
    icon: <Sun className="h-6 w-6 text-yellow-500" />,
    description: "Horários realizados no período da manhã",
  },
  {
    id: "afternoon",
    title: "Vespertino",
    period: "1:00 PM - 6:00 PM",
    icon: <Sunset className="h-6 w-6 text-orange-500" />,
    description: "Horários realizados no período da tarde",
  },
  {
    id: "evening",
    title: "Noturno",
    period: "6:00 PM - 10:00 PM",
    icon: <Moon className="h-6 w-6 text-blue-500" />,
    description: "Horários realizados no período da noite",
  },
];
