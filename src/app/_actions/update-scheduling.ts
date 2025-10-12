"use server";

import { db } from "@/lib/prisma";

interface UpdatedAppointment {
  startTime: string | Date;
  endTime: string | Date;
  name: string;
  date: string | Date;
  courseId: string;
  disciplineId: string;
  classId: string;
  semesterId: string;
  userId: string;
  details?: any;
}

interface UpdateSchedulingInput {
  appointmentId: string;
  updatedAppointments: UpdatedAppointment[];
}

export async function updateScheduling({
  appointmentId,
  updatedAppointments,
}: UpdateSchedulingInput) {
  try {
    await db.scheduling.deleteMany({
      where: { id: appointmentId },
    });

    const created = await Promise.all(
      updatedAppointments.map((a) =>
        db.scheduling.create({
          data: {
            startTime: new Date(a.startTime),
            endTime: new Date(a.endTime),
            date: new Date(a.date),
            name: a.name,
            courseId: a.courseId,
            disciplineId: a.disciplineId,
            classId: a.classId,
            semesterId: a.semesterId,
            userId: a.userId,
            details: a.details || {},
          },
        })
      )
    );

    return { success: true, created };
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    return { success: false, error: (err as Error).message };
  }
}
