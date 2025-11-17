"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  try {
    // Verifica se o curso existe
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    // Usando transação para garantir atomicidade
    return await db.$transaction(
      async (tx) => {
        // 1. Primeiro, remove todos os agendamentos relacionados ao curso
        // Isso inclui agendamentos diretos do curso e de seus relacionamentos
        await tx.scheduling.deleteMany({
          where: {
            OR: [
              { courseId },
              // Agendamentos de semestres do curso
              {
                semester: {
                  courseId,
                },
              },
              // Agendamentos de disciplinas do curso
              {
                discipline: {
                  semester: {
                    courseId,
                  },
                },
              },
              // Agendamentos de turmas do curso
              {
                class: {
                  courseId,
                },
              },
            ],
          },
        });

        // 2. Remove relações many-to-many entre disciplinas e professores
        // Para cada disciplina do curso, desconecta os professores
        const courseDisciplines = await tx.discipline.findMany({
          where: {
            semester: {
              courseId,
            },
          },
          select: {
            id: true,
          },
        });

        for (const discipline of courseDisciplines) {
          await tx.discipline.update({
            where: { id: discipline.id },
            data: {
              teachers: {
                set: [],
              },
            },
          });
        }

        // 3. Remove disciplinas do curso
        await tx.discipline.deleteMany({
          where: {
            semester: {
              courseId,
            },
          },
        });

        // 4. Remove turmas do curso
        await tx.class.deleteMany({
          where: {
            OR: [
              { courseId },
              {
                semester: {
                  courseId,
                },
              },
            ],
          },
        });

        // 5. Remove semestres do curso
        await tx.semester.deleteMany({
          where: {
            courseId,
          },
        });

        // 6. Remove relações many-to-many do curso com professores
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

        // 7. Finalmente remove o curso
        await tx.course.delete({
          where: { id: courseId },
        });

        return { success: true };
      },
      {
        maxWait: 10000, // 10 segundos
        timeout: 30000, // 30 segundos
      }
    );
  } catch (error) {
    console.error("Erro detalhado ao deletar curso:", error);

    // Em produção, não exponha detalhes internos
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Não foi possível excluir o curso. Tente novamente mais tarde."
      );
    }

    // Em desenvolvimento, mostre o erro real
    if (error instanceof Error) {
      throw new Error(`Erro ao deletar curso: ${error.message}`);
    }

    throw new Error("Erro desconhecido ao deletar curso");
  }
}
