"use server";

import { db } from "@/lib/prisma";

export async function getDisciplinesByCourseId(courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      disciplines: true,
    },
  });

  return course?.disciplines ?? [];
}
