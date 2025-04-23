"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Course } from "../_components/course-selector";
import { Semester } from "../_components/semester-selector";
import { Discipline } from "../_components/discipline-selector";

export interface Appointment {
  id: string;
  course: Course;
  semester: Semester;
  discipline: Discipline;
  date: Date;
  time: string;
  details: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
  removeAppointment: (id: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const AppointmentProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  function addAppointment(appointment: Omit<Appointment, "id">) {
    const newAppointment = {
      ...appointment,
      id: crypto.randomUUID(),
    };

    setAppointments((prev) => [...prev, newAppointment]);
  }

  function removeAppointment(id: string) {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
  }
  console.log(appointments);

  return (
    <AppointmentContext.Provider
      value={{ appointments, addAppointment, removeAppointment }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
