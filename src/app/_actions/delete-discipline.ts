"use server";

import { db } from "@/lib/prisma";

export async function deleteDiscipline(disciplineId: string) {
  return await db.$transaction(async (tx) => {
    await tx.scheduling.deleteMany({
      where: {
        disciplineId: disciplineId,
      },
    });

    await tx.discipline.update({
      where: { id: disciplineId },
      data: {
        courses: {
          set: [],
        },
        teachers: {
          set: [],
        },
      },
    });

    await tx.discipline.delete({
      where: {
        id: disciplineId,
      },
    });
  });
}
