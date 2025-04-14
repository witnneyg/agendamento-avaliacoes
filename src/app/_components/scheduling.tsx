"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  FlaskRoundIcon as Flask,
  Globe,
  Microscope,
  Code,
  Brain,
} from "lucide-react";
import { Course, CourseSelector } from "./course-selector";
import { TimeSlotPicker } from "./time-slot-picker";
import { BookingForm } from "./booking-form";
import { BookingConfirmation } from "./booking-confirmation";
import { DisciplineSelector } from "./discipline-selector";

import { ptBR } from "date-fns/locale";

export interface Discipline {
  id: string;
  title: string;
  description: string;
}

// interface DisciplineSelectorProps {
//   disciplines: Discipline[];
//   onSelectDiscipline: (discipline: Discipline) => void;
//   onBack: () => void;
// }

const academicCourses: Course[] = [
  {
    id: "cs",
    title: "Computer Science",
    icon: <Code className="h-6 w-6 text-primary" />,
    description:
      "Programming, algorithms, data structures, and software engineering",
  },
  {
    id: "medicine",
    title: "Medicine",
    icon: <Microscope className="h-6 w-6 text-primary" />,
    description: "Medical sciences, healthcare, and clinical studies",
  },
  {
    id: "math",
    title: "Mathematics",
    icon: <Calculator className="h-6 w-6 text-primary" />,
    description: "Pure and applied mathematics, statistics, and analysis",
  },
  {
    id: "biology",
    title: "Biology",
    icon: <Flask className="h-6 w-6 text-primary" />,
    description: "Life sciences, ecology, genetics, and molecular biology",
  },
  {
    id: "psychology",
    title: "Psychology",
    icon: <Brain className="h-6 w-6 text-primary" />,
    description: "Human behavior, cognitive processes, and mental health",
  },
  {
    id: "geography",
    title: "Geography",
    icon: <Globe className="h-6 w-6 text-primary" />,
    description:
      "Physical geography, human geography, and environmental studies",
  },
];

const disciplinesByDepartment: Record<string, Discipline[]> = {
  cs: [
    {
      id: "ai",
      title: "Artificial Intelligence",
      description: "Machine learning, neural networks, and intelligent systems",
    },
    {
      id: "algorithms",
      title: "Algorithms & Data Structures",
      description: "Design and analysis of algorithms and data structures",
    },
    {
      id: "software",
      title: "Software Engineering",
      description: "Software development methodologies and best practices",
    },
    {
      id: "networks",
      title: "Computer Networks",
      description: "Network protocols, architecture, and security",
    },
  ],
  math: [
    {
      id: "calculus",
      title: "Calculus",
      description: "Differential and integral calculus",
    },
    {
      id: "statistics",
      title: "Statistics",
      description: "Statistical methods, probability, and data analysis",
    },
    {
      id: "algebra",
      title: "Linear Algebra",
      description: "Vector spaces, matrices, and linear transformations",
    },
    {
      id: "discrete",
      title: "Discrete Mathematics",
      description: "Logic, set theory, combinatorics, and graph theory",
    },
  ],
  medicine: [
    {
      id: "anatomy",
      title: "Anatomy",
      description: "Structure and organization of the human body",
    },
    {
      id: "physiology",
      title: "Physiology",
      description: "Functions and mechanisms of the human body",
    },
    {
      id: "pathology",
      title: "Pathology",
      description: "Study of diseases and their effects on the body",
    },
    {
      id: "pharmacology",
      title: "Pharmacology",
      description: "Study of drugs and their effects on the body",
    },
  ],
  biology: [
    {
      id: "genetics",
      title: "Genetics",
      description: "Study of genes, heredity, and genetic variation",
    },
    {
      id: "ecology",
      title: "Ecology",
      description: "Relationships between organisms and their environment",
    },
    {
      id: "microbiology",
      title: "Microbiology",
      description: "Study of microorganisms and their effects",
    },
    {
      id: "biochemistry",
      title: "Biochemistry",
      description: "Chemical processes and substances in living organisms",
    },
  ],
  psychology: [
    {
      id: "clinical",
      title: "Clinical Psychology",
      description: "Assessment and treatment of mental disorders",
    },
    {
      id: "cognitive",
      title: "Cognitive Psychology",
      description: "Study of mental processes such as perception and memory",
    },
    {
      id: "developmental",
      title: "Developmental Psychology",
      description: "Psychological changes throughout the lifespan",
    },
    {
      id: "social",
      title: "Social Psychology",
      description:
        "How people's thoughts and behaviors are influenced by others",
    },
  ],
  geography: [
    {
      id: "physical",
      title: "Physical Geography",
      description: "Study of natural features and processes of the Earth",
    },
    {
      id: "human",
      title: "Human Geography",
      description:
        "Study of human activities and their relationship to the environment",
    },
    {
      id: "gis",
      title: "Geographic Information Systems",
      description: "Computer systems for capturing and analyzing spatial data",
    },
    {
      id: "environmental",
      title: "Environmental Geography",
      description: "Study of human-environment interactions and sustainability",
    },
  ],
};

type Step =
  | "course"
  | "discipline"
  | "date"
  | "time"
  | "details"
  | "confirmation";

type BookingDetails = {
  name: string;
  email: string;
  phone: string;
  notes: string;
};

export function AppointmentScheduler() {
  const [step, setStep] = useState<Step>("course");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(
    undefined
  );
  const [selectedDiscipline, setSelectedDiscipline] = useState<
    Discipline | undefined
  >(undefined);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setStep("discipline");
  };

  const handleDisciplineSelect = (discipline: Discipline) => {
    setSelectedDiscipline(discipline);
    setStep("date");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep("time");
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleDetailsSubmit = (details: BookingDetails) => {
    setBookingDetails(details);
    setStep("confirmation");
  };

  const handleReset = () => {
    setStep("course");
    setSelectedCourse(undefined);
    setSelectedDiscipline(undefined);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setBookingDetails(null);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          {step === "course" && "Selecione um curso"}
          {step === "discipline" && "Selecione uma disciplina"}
          {step === "date" && "Selecione uma data"}
          {step === "time" && "Escolha um horário"}
          {step === "details" && "Seus detalhes"}
          {step === "confirmation" && "Agendamento confirmado"}
        </CardTitle>
        <CardDescription>
          {step === "course" &&
            "Selecione o curso com o qual deseja agendar uma avaliação"}
          {step === "discipline" &&
            selectedCourse &&
            `Selecione uma disciplina específica em ${selectedCourse.title}`}
          {step === "date" &&
            selectedCourse &&
            `Disciplina selecionada: ${selectedCourse.title}`}
          {step === "time" &&
            selectedDate &&
            `Data selecionada: ${format(selectedDate, "PPPP", {
              locale: ptBR,
            })}`}
          {step === "details" &&
            selectedTime &&
            `Data selecionada: ${format(selectedDate!, "PPPP", {
              locale: ptBR,
            })} a ${selectedTime}`}
          {step === "confirmation" && "Seu agendamento foi agendado"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "course" && (
          <CourseSelector
            courses={academicCourses}
            onSelectCourse={handleCourseSelect}
          />
        )}

        {step === "discipline" && selectedCourse && (
          <DisciplineSelector
            disciplines={disciplinesByDepartment[selectedCourse.id]}
            onSelectDiscipline={handleDisciplineSelect}
            onBack={() => setStep("course")}
          />
        )}

        {step === "date" && (
          <div className="flex flex-col space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("discipline")}
              className="self-start mb-2"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar a disciplinas
            </Button>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                disabled={(date) =>
                  date < new Date() ||
                  date.getDay() === 0 ||
                  date.getDay() === 6
                }
                className="rounded-md border"
              />
            </div>
          </div>
        )}

        {step === "time" && selectedDate && (
          <TimeSlotPicker
            date={selectedDate}
            onSelectTime={handleTimeSelect}
            onBack={() => setStep("date")}
          />
        )}

        {step === "details" && selectedDate && selectedTime && (
          <BookingForm
            onSubmit={handleDetailsSubmit}
            onBack={() => setStep("time")}
          />
        )}

        {step === "confirmation" &&
          bookingDetails &&
          selectedDate &&
          selectedTime &&
          selectedCourse &&
          selectedDiscipline && (
            <BookingConfirmation
              course={selectedCourse}
              discipline={selectedDiscipline}
              date={selectedDate}
              time={selectedTime}
              details={bookingDetails}
              onScheduleAnother={handleReset}
            />
          )}
      </CardContent>
    </Card>
  );
}
