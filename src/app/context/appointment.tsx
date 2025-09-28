"use client";

import { createContext, useContext, useState, ReactNode } from "react";
export interface Appointment {
  id?: string;
  courseId: string;
  userId: string;
  semesterId: string;
  disciplineId: string;
  classId: string;
  date: Date;
  endTime: Date;
  startTime: Date;
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
