"use server";

import { db } from "@/lib/prisma";

export async function getTeachers() {
  return db.teacher.findMany({
    include: {
      courses: true,
      disciplines: true,
    },
  });
}
