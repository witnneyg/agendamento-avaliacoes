"use server";

import { db } from "@/lib/prisma";

export async function removeAllDirectorCourses(directorId: string) {
  try {
    const director = await db.director.findUnique({
      where: { id: directorId },
      include: { courses: true },
    });

    if (!director) {
      return { success: false, message: "Diretor não encontrado" };
    }
    if (director.courses.length === 0) {
      return { success: true, message: "Diretor não tem cursos vinculados" };
    }

    await db.director.update({
      where: { id: directorId },
      data: {
        courses: {
          set: [],
        },
      },
    });

    return {
      success: true,
      message: "Todos os cursos foram removidos do diretor",
    };
  } catch (error) {
    console.error("Erro ao remover todos os cursos do diretor:", error);
    return { success: false, message: "Erro ao remover cursos do diretor" };
  }
}
