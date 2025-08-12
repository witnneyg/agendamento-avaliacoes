"use server";

import { db } from "@/lib/prisma";
import { Appointment } from "../context/appointment";

export async function createScheduling(data: Appointment) {
  const hasConflict = await db.scheduling.findFirst({
    where: {
      // Condição de conflito:
      // 1. O início do novo está antes do final do existente
      // 2. O final do novo está depois do início do existente
      disciplineId: data.disciplineId,
      AND: [
        {
          startTime: { lt: data.endTime }, // começa antes do fim de outro
        },
        {
          endTime: { gt: data.startTime }, // termina depois do início de outro
        },
      ],
    },
  });

  console.log(hasConflict, "conlfict");
  console.log(data.startTime, "startime ");
  console.log(data.endTime, "endtimee ");

  if (hasConflict) {
    throw new Error("Este horário já está agendado.");
  }

  await db.scheduling.create({
    data: {
      courseName: data.courseName,
      disciplineName: data.disciplineName,
      disciplineId: data.disciplineId,
      semesterName: data.semesterName,
      date: data.date.toISOString(),
      startTime: data.startTime,
      endTime: data.endTime,
      name: data.details.name,
      email: data.details.email,
      phone: data.details.phone,
      notes: data.details.notes,
    },
  });
}
