"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  try {
    return await db.$transaction(async (tx) => {
      // Verifica se o curso existe com todas as relações
      const course = await tx.course.findUnique({
        where: { id: courseId },
        include: {
          semesters: {
            include: {
              disciplines: {
                include: {
                  schedulings: true,
                  teachers: true,
                },
              },
              classes: {
                include: {
                  schedulings: true,
                },
              },
              schedulings: true,
            },
          },
          teachers: true,
          disciplines: true,
          classes: {
            include: {
              schedulings: true,
            },
          },
          schedulings: true,
        },
      });

      if (!course) {
        throw new Error("Curso não encontrado");
      }

      // 1. Primeiro deleta todos os schedulings relacionados
      await tx.scheduling.deleteMany({
        where: {
          OR: [
            { courseId },
            { semesterId: { in: course.semesters.map((s) => s.id) } },
            { disciplineId: { in: course.disciplines.map((d) => d.id) } },
            { classId: { in: course.classes.map((c) => c.id) } },
          ],
        },
      });

      // 2. Remove relações many-to-many
      // Remove professores do curso
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

      // Remove disciplinas do curso (relação many-to-many)
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

      // 3. Para cada semestre, deleta em cascata
      for (const semester of course.semesters) {
        // Remove professores das disciplinas do semestre
        for (const discipline of semester.disciplines) {
          await tx.discipline.update({
            where: { id: discipline.id },
            data: {
              teachers: {
                set: [],
              },
            },
          });
        }

        // Deleta disciplinas do semestre
        await tx.discipline.deleteMany({
          where: { semesterId: semester.id },
        });

        // Deleta classes do semestre
        await tx.class.deleteMany({
          where: { semesterId: semester.id },
        });

        // Deleta schedulings do semestre (já deveriam estar deletados, mas por segurança)
        await tx.scheduling.deleteMany({
          where: { semesterId: semester.id },
        });
      }

      // 4. Deleta classes do curso
      await tx.class.deleteMany({
        where: { courseId },
      });

      // 5. Deleta semestres do curso
      await tx.semester.deleteMany({
        where: { courseId },
      });

      // 6. Deleta schedulings do curso (já deveriam estar deletados, mas por segurança)
      await tx.scheduling.deleteMany({
        where: { courseId },
      });

      // 7. Finalmente deleta o curso
      await tx.course.delete({
        where: { id: courseId },
      });

      return { success: true };
    });
  } catch (error) {
    console.error("Erro ao deletar curso:", error);

    if (error instanceof Error) {
      throw new Error(`Erro ao deletar curso: ${error.message}`);
    }

    throw new Error("Erro desconhecido ao deletar curso");
  }
}
