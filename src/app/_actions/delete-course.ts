"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  try {
    // Primeiro, verifica se o curso existe
    const course = await db.course.findUnique({
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

    // Coleta todos os IDs relacionados
    const semesterIds = course.semesters.map((s) => s.id);
    const disciplineIds = course.semesters.flatMap((s) =>
      s.disciplines.map((d) => d.id)
    );
    const classIds = [
      ...course.classes.map((c) => c.id),
      ...course.semesters.flatMap((s) => s.classes.map((c) => c.id)),
    ];

    // Divide as operações em transações menores
    // 1. Remove agendamentos primeiro
    await db.scheduling.deleteMany({
      where: {
        OR: [
          { courseId },
          { semesterId: { in: semesterIds } },
          { disciplineId: { in: disciplineIds } },
          { classId: { in: classIds } },
        ],
      },
    });

    // 2. Para relações many-to-many, desconecta professores das disciplinas
    if (disciplineIds.length > 0) {
      // Para relações many-to-many, precisamos atualizar cada disciplina individualmente
      for (const disciplineId of disciplineIds) {
        await db.discipline.update({
          where: { id: disciplineId },
          data: {
            teachers: {
              set: [], // Isso desconecta todos os professores
            },
          },
        });
      }
    }

    // 3. Remove disciplinas
    if (disciplineIds.length > 0) {
      await db.discipline.deleteMany({
        where: { id: { in: disciplineIds } },
      });
    }

    // 4. Remove turmas
    if (classIds.length > 0) {
      await db.class.deleteMany({
        where: { id: { in: classIds } },
      });
    }

    // 5. Remove semestres
    if (semesterIds.length > 0) {
      await db.semester.deleteMany({
        where: { id: { in: semesterIds } },
      });
    }

    // 6. Remove relações many-to-many do curso
    await db.course.update({
      where: { id: courseId },
      data: {
        teachers: {
          set: [], // Desconecta todos os professores
        },
        disciplines: {
          set: [], // Desconecta todas as disciplinas
        },
      },
    });

    // 7. Finalmente remove o curso
    await db.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro detalhado ao deletar curso:", error);

    // Mensagens de erro mais específicas
    if (error instanceof Error) {
      if (
        error.message.includes("timeout") ||
        error.message.includes("time out")
      ) {
        throw new Error("A operação demorou muito tempo. Tente novamente.");
      }
      if (
        error.message.includes("foreign key") ||
        error.message.includes("constraint")
      ) {
        throw new Error(
          "Não foi possível excluir o curso devido a vínculos existentes. Tente novamente ou contate o suporte."
        );
      }
      throw new Error(`Erro ao deletar curso: ${error.message}`);
    }

    throw new Error("Erro desconhecido ao deletar curso");
  }
}
