"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function deleteSchedule(scheduleId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) throw new Error("Usuário não logado");

  const schedule = await db.scheduling.findUnique({
    where: {
      id: scheduleId,
    },
  });

  if (!schedule) {
    throw new Error("Agendamento não encontrado");
  }

  if (schedule.userId !== session.user.id) {
    throw new Error("Você não tem permissão para excluir este agendamento");
  }

  await db.scheduling.delete({
    where: {
      id: scheduleId,
    },
  });
}
