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
    // 1. Verificar se o agendamento existe
    const existingAppointment = await db.scheduling.findUnique({
      where: { id: appointmentId },
    });

    if (!existingAppointment) {
      return { success: false, error: "Agendamento não encontrado" };
    }

    // 2. Atualizar o agendamento existente
    const updatedAppointment = await db.scheduling.update({
      where: { id: appointmentId },
      data: {
        startTime: new Date(updatedAppointments[0].startTime),
        endTime: new Date(updatedAppointments[0].endTime),
        date: new Date(updatedAppointments[0].date),
        name: updatedAppointments[0].name,
        courseId: updatedAppointments[0].courseId,
        disciplineId: updatedAppointments[0].disciplineId,
        classId: updatedAppointments[0].classId,
        semesterId: updatedAppointments[0].semesterId,
        userId: updatedAppointments[0].userId,
        details: updatedAppointments[0].details || {},
      },
      include: {
        course: true,
        discipline: true,
        class: true,
        semester: true,
      },
    });

    return {
      success: true,
      updated: [updatedAppointment],
    };
  } catch (err) {
    console.error("Erro ao atualizar agendamento:", err);
    return { success: false, error: (err as Error).message };
  }
}
