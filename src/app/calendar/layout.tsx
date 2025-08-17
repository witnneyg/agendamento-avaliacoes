"use client";

import { ReactNode } from "react";
import ProtectedLayout from "../protectedLayout";

export default function CalendarLayout({ children }: { children: ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
