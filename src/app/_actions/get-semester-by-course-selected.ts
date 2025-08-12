"use server";

import { db } from "@/lib/prisma";

export async function getSemesterByCourse(courseId: string) {
  return db.semester.findMany({
    where: {
      courseId: courseId,
    },
  });
}
