"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function deleteSchedule(scheduleId: string) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Usuário não logado");
    }

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

    const isAdmin = userWithRoles.roles.some((role) => role.name === "ADMIN");

    if (isSecretary || isAdmin) {
      const deletedSchedule = await db.scheduling.delete({
        where: {
          id: scheduleId,
        },
      });

      if (!deletedSchedule) {
        throw new Error("Agendamento não encontrado");
      }

      return { success: true, message: "Agendamento excluído com sucesso" };
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

    return { success: true, message: "Agendamento excluído com sucesso" };
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("não tem permissão") ||
        error.message.includes("não logado") ||
        error.message.includes("não encontrado")
      ) {
        return {
          success: false,
          error: error.message,
        };
      }

      if (error.message.includes("Record to delete does not exist")) {
        return {
          success: false,
          error: "Agendamento não encontrado",
        };
      }

      if (error.message.includes("Foreign key constraint")) {
        return {
          success: false,
          error:
            "Não é possível excluir este agendamento devido a dependências",
        };
      }
    }

    return {
      success: false,
      error: "Erro interno ao excluir agendamento. Tente novamente mais tarde.",
    };
  }
}
