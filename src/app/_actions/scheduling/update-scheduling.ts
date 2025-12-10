"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";

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
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Usuário não logado" };
    }

    const existingAppointment = await db.scheduling.findUnique({
      where: { id: appointmentId },
      include: {
        course: true,
      },
    });

    if (!existingAppointment) {
      return { success: false, error: "Agendamento não encontrado" };
    }

    const isOwner = existingAppointment.userId === session.user.id;

    const isDirectorOfCourse = await db.course.findFirst({
      where: {
        id: existingAppointment.courseId,
        directors: {
          some: {
            userId: session.user.id,
          },
        },
      },
    });

    if (!isOwner && !isDirectorOfCourse) {
      return {
        success: false,
        error: "Você não tem permissão para editar este agendamento",
      };
    }

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
