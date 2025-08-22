"use server";

import { db } from "@/lib/prisma";

export async function getSchedulingById(disciplineId: string) {
  return db.scheduling.findMany({
    where: {
      disciplineId,
    },
  });
}
