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
  isSecretary?: boolean;
  isDirector?: boolean;
}

export async function updateScheduling({
  appointmentId,
  updatedAppointments,
  isSecretary = false,
  isDirector = false,
}: UpdateSchedulingInput) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { success: false, error: "Usuário não logado" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
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

    const hasSecretaryRole = user.roles.some(
      (role) => role.name === "SECRETARIA"
    );
    const hasDirectorRole = user.roles.some((role) => role.name === "DIRECAO");

    const isSecretaryUser = isSecretary || hasSecretaryRole;
    const isDirectorUser = isDirector || hasDirectorRole;

    const isOwner = existingAppointment.userId === user.id;

    const isDirectorOfCourse = await db.course.findFirst({
      where: {
        id: existingAppointment.courseId,
        directors: {
          some: {
            userId: user.id,
          },
        },
      },
    });

    const canEdit =
      isSecretaryUser || (isDirectorUser && isDirectorOfCourse) || isOwner;

    if (!canEdit) {
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
