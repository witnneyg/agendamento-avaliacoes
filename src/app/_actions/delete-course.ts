"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) {
    throw new Error("Curso não encontrado");
  }

  await db.course.delete({
    where: {
      id: courseId,
    },
  });
}
