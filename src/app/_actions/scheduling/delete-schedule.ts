"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function deleteSchedule(scheduleId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) throw new Error("Usuário não logado");

  const userWithRoles = await db.user.findUnique({
    where: {
      email: session.user.email,
    },
    include: {
      roles: true,
    },
  });

  if (!userWithRoles) {
    throw new Error("Usuário não encontrado");
  }

  const isSecretary = userWithRoles.roles.some(
    (role) => role.name === "SECRETARIA"
  );

  if (isSecretary) {
    await db.scheduling.delete({
      where: {
        id: scheduleId,
      },
    });
    return;
  }

  const schedule = await db.scheduling.findUnique({
    where: {
      id: scheduleId,
    },
    include: {
      course: true,
    },
  });

  if (!schedule) {
    throw new Error("Agendamento não encontrado");
  }

  const isOwner = schedule.userId === session.user.id;

  const isDirectorOfCourse = await db.course.findFirst({
    where: {
      id: schedule.courseId,
      directors: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!isOwner && !isDirectorOfCourse) {
    throw new Error("Você não tem permissão para excluir este agendamento");
  }

  await db.scheduling.delete({
    where: {
      id: scheduleId,
    },
  });
}
