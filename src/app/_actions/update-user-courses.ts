"use server";

import { db } from "@/lib/prisma";

interface UpdateUserCoursesParams {
  userId: string;
  courseIds: string[];
}

export async function updateUserCourses({
  userId,
  courseIds,
}: UpdateUserCoursesParams) {
  try {
    // Verifica se o diretor existe, se não, cria
    let director = await db.director.findUnique({
      where: { id: userId },
    });

    if (!director) {
      const user = await db.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
      });

      director = await db.director.create({
        data: {
          id: userId,
          name: user?.name || "Diretor",
          email: user?.email || "",
          status: "ACTIVE",
        },
      });
    }

    // Atualiza os cursos do diretor
    const updatedDirector = await db.director.update({
      where: { id: userId },
      data: {
        courses: {
          set: courseIds.map((id) => ({ id })),
        },
      },
      include: {
        courses: true,
      },
    });

    return {
      success: true,
      message: "Cursos atualizados com sucesso",
      userCourses: updatedDirector.courses,
    };
  } catch (error) {
    console.error("Erro ao atualizar cursos do diretor:", error);
    return {
      success: false,
      message: "Erro ao atualizar cursos",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
