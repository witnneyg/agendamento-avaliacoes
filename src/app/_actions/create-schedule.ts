"use server";

import { db } from "@/lib/prisma";
import { Appointment } from "../context/appointment";

export async function createScheduling(data: Appointment) {
  const hasConflict = await db.scheduling.findFirst({
    where: {
      disciplineId: data.disciplineId,
      AND: [
        {
          startTime: { lt: data.endTime },
        },
        {
          endTime: { gt: data.startTime },
        },
      ],
    },
  });

  if (hasConflict) {
    throw new Error("Este horário já está agendado.");
  }

  await db.scheduling.create({
    data: {
      name: data.details.name,
      phone: data.details.phone,
      notes: data.details.notes,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      userId: data.userId,
      courseId: data.courseId,
      semesterId: data.semesterId,
      disciplineId: data.disciplineId,
    },
  });
}
