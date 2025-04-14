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

type Step = "course" | "date" | "time" | "details" | "confirmation";

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

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setStep("date");
  };

  const handleReset = () => {
    setStep("course");
    setSelectedCourse(undefined);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setBookingDetails(null);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>
          {step === "course" && "Select a Department"}
          {step === "date" && "Select a Date"}
          {step === "time" && "Choose a Time"}
          {step === "details" && "Your Details"}
          {step === "confirmation" && "Appointment Confirmed"}
        </CardTitle>
        <CardDescription>
          {step === "course" &&
            "Choose the academic department you'd like to schedule an appointment with"}
          {step === "date" &&
            selectedCourse &&
            `Selected department: ${selectedCourse.title}`}
          {step === "time" &&
            selectedDate &&
            `Selected date: ${format(selectedDate, "PPPP")}`}
          {step === "details" &&
            selectedTime &&
            `Selected time: ${format(
              selectedDate!,
              "PPPP"
            )} at ${selectedTime}`}
          {step === "confirmation" && "Your appointment has been scheduled"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === "course" && (
          <CourseSelector
            courses={academicCourses}
            onSelectCourse={handleCourseSelect}
          />
        )}

        {step === "date" && (
          <div className="flex flex-col space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("course")}
              className="self-start mb-2"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to departments
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
          selectedCourse && (
            <BookingConfirmation
              course={selectedCourse}
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
