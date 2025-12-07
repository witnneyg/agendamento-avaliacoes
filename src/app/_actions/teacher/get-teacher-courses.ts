"use server";

import { db } from "@/lib/prisma";

export async function getTeacherCourses(teacherId: string) {
  try {
    const teacher = await db.teacher.findUnique({
      where: {
        id: teacherId,
      },
      include: {
        courses: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            name: true,
            periods: true,
            description: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
    });

    if (!teacher) {
      throw new Error("Professor não encontrado");
    }

    return teacher.courses;
  } catch (error) {
    throw new Error("Erro ao carregar cursos do professor");
  }
}
