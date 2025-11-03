"use server";

import { db } from "@/lib/prisma";

export async function createScheduling(data: any) {
  // Verificar conflitos para todo o período do agendamento

  const hasConflict = await db.scheduling.findFirst({
    where: {
      date: data.date,
      classId: data.classId,
      disciplineId: data.disciplineId,
      AND: [
        {
          startTime: { lt: data.endTime },
        },
        {
          endTime: { gt: data.startTime },
        },
      ],
      // Não verificar o próprio agendamento se estiver editando
      ...(data.id && { id: { not: data.id } }),
    },
  });

  if (hasConflict) {
    throw new Error(
      "Este horário já está agendado para esta turma e disciplina."
    );
  }

  const scheduling = await db.scheduling.create({
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
      details: data.details,
    },
  });

  console.log({ scheduling });

  return scheduling;
}
