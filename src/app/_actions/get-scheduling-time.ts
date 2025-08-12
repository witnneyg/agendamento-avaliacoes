"use server";

import { db } from "@/lib/prisma";

export async function getSchedulingTime(disciplineId: string) {
  return db.scheduling.findMany({
    where: {
      disciplineId,
    },
  });
}
