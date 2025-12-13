// _actions/scheduling/get-scheduling.ts
"use server";

import { db } from "@/lib/prisma";

export async function getSchedulingByRole(options?: {
  userId?: string;
  directorId?: string;
  isSecretary?: boolean;
  courseIds?: string[]; // ← ADICIONADO
  isProfessor?: boolean; // ← ADICIONADO
}) {
  try {
    let whereClause: any = {};

    if (options?.isSecretary) {
      whereClause = {};
    } else if (options?.isProfessor && options?.courseIds) {
      // Professor: busca todos os agendamentos dos cursos onde está vinculado
      whereClause = {
        courseId: {
          in: options.courseIds,
        },
      };
    } else if (options?.directorId) {
      const director = await db.director.findUnique({
        where: { id: options.directorId },
        include: { courses: true },
      });

      if (director && director.courses.length > 0) {
        const courseIds = director.courses.map((course) => course.id);
        whereClause = {
          courseId: {
            in: courseIds,
          },
        };
      } else {
        whereClause = { id: null };
      }
    } else if (options?.userId) {
      whereClause = { userId: options.userId };
    }

    const schedulings = await db.scheduling.findMany({
      where: whereClause,
      include: {
        course: true,
        semester: true,
        discipline: true,
        class: true,
        user: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    return schedulings;
  } catch (error) {
    console.error("Erro ao buscar agendamentos:", error);
    return [];
  }
}
