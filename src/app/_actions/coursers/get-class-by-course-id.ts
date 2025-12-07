"use server";

import { db } from "@/lib/prisma";

export async function getClassesByCourse(courseId: string) {
  return db.class.findMany({
    where: { courseId },
    orderBy: { name: "asc" },
  });
}
