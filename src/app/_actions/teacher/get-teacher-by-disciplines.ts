"use server";

import { db } from "@/lib/prisma";

export async function getTeacherByCourse(courseId: string) {
  return db.teacher.findMany({
    where: {
      courses: {
        some: {
          id: courseId,
        },
      },
    },
  });
}
