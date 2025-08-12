"use server";

import { db } from "@/lib/prisma";

export async function getDisciplinesBySemester(semesterId: string) {
  return db.discipline.findMany({
    where: {
      semesterId: semesterId,
    },
  });
}
