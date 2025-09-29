"use server";

import { db } from "@/lib/prisma";
import { Appointment } from "../context/appointment";

export async function createScheduling(data: Appointment) {
  const hasConflict = await db.scheduling.findFirst({
    where: {
      semesterId: data.semesterId,
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

  //   where: {
  //   semesterId: data.semesterId,
  //   classId: data.classId,
  //   disciplineId: data.disciplineId,
  //   AND: [
  //     { startTime: { lt: data.endTime } },
  //     { endTime: { gt: data.startTime } },
  //   ],
  // }

  if (hasConflict) {
    throw new Error("Este horário já está agendado.");
  }

  const a = await db.scheduling.create({
    data: {
      name: data.details.name,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      userId: data.userId,
      courseId: data.courseId,
      semesterId: data.semesterId,
      disciplineId: data.disciplineId,
      classId: data.classId,
    },
  });
}
