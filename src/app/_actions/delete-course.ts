"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      semesters: {
        include: {
          disciplines: {
            include: {
              schedulings: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    throw new Error("Curso não encontrado");
  }

  for (const semester of course.semesters) {
    for (const discipline of semester.disciplines) {
      await db.scheduling.deleteMany({
        where: { disciplineId: discipline.id },
      });
    }
  }

  for (const semester of course.semesters) {
    await db.discipline.deleteMany({
      where: { semesterId: semester.id },
    });
  }

  await db.semester.deleteMany({
    where: { courseId },
  });

  await db.course.delete({
    where: { id: courseId },
  });
}
