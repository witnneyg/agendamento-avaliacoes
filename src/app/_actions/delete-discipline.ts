"use server";

import { db } from "@/lib/prisma";

export async function deleteDiscipline(disciplineId: string) {
  await db.discipline.delete({
    where: {
      id: disciplineId,
    },
  });
}
