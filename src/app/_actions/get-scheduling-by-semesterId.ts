"use server";

import { db } from "@/lib/prisma";

export async function getSchedulingBySemester(semesterId: string) {
  return db.scheduling.findMany({
    where: {
      semesterId,
    },
  });
}
