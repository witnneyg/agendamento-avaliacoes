"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AppointmentProvider } from "./context/appointment";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AppointmentProvider>{children}</AppointmentProvider>
    </SessionProvider>
  );
}
