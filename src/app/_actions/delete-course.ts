"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  try {
    return await db.$transaction(async (tx) => {
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: {
          semesters: {
            include: {
              disciplines: {
                include: {
                  teachers: true,
                },
              },
              classes: true,
            },
          },
          teachers: true,
          disciplines: true,
          classes: true,
        },
      });

      if (!course) {
        throw new Error("Curso não encontrado");
      }

      const semesterIds = course.semesters.map((s) => s.id);
      const disciplineIds = course.semesters.flatMap((s) =>
        s.disciplines.map((d) => d.id)
      );
      const classIds = [
        ...course.classes.map((c) => c.id),
        ...course.semesters.flatMap((s) => s.classes.map((c) => c.id)),
      ];

      await tx.scheduling.deleteMany({
        where: {
          OR: [
            { courseId },
            { semesterId: { in: semesterIds } },
            { disciplineId: { in: disciplineIds } },
            { classId: { in: classIds } },
          ],
        },
      });

      for (const teacher of course.teachers) {
        await tx.teacher.update({
          where: { id: teacher.id },
          data: {
            courses: {
              disconnect: { id: courseId },
            },
          },
        });
      }

      for (const discipline of course.disciplines) {
        await tx.discipline.update({
          where: { id: discipline.id },
          data: {
            courses: {
              disconnect: { id: courseId },
            },
          },
        });
      }

      for (const disciplineId of disciplineIds) {
        await tx.discipline.update({
          where: { id: disciplineId },
          data: {
            teachers: {
              set: [],
            },
          },
        });
      }

      await tx.discipline.deleteMany({
        where: { id: { in: disciplineIds } },
      });

      await tx.class.deleteMany({
        where: { id: { in: classIds } },
      });

      await tx.semester.deleteMany({
        where: { id: { in: semesterIds } },
      });

      await tx.course.delete({
        where: { id: courseId },
      });

      return { success: true };
    });
  } catch (error) {
    console.error("Erro ao deletar curso:", error);
    throw new Error(
      error instanceof Error
        ? `Erro ao deletar curso: ${error.message}`
        : "Erro desconhecido ao deletar curso"
    );
  }
}
