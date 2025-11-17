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

      // Remove agendamentos
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

      // Remove relações many-to-many entre disciplinas e professores
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

      // Remove disciplinas
      await tx.discipline.deleteMany({
        where: { id: { in: disciplineIds } },
      });

      // Remove turmas
      await tx.class.deleteMany({
        where: { id: { in: classIds } },
      });

      // Remove semestres
      await tx.semester.deleteMany({
        where: { id: { in: semesterIds } },
      });

      // Remove relações many-to-many do curso
      await tx.course.update({
        where: { id: courseId },
        data: {
          teachers: {
            set: [],
          },
          disciplines: {
            set: [],
          },
        },
      });

      // Remove o curso
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
