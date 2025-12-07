"use server";

import { db } from "@/lib/prisma";

export async function getDisciplines() {
  return db.discipline.findMany({
    include: {
      courses: true,
      semester: true,
    },
  });
}
