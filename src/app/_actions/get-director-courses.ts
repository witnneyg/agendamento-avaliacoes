"use server";

import { db } from "@/lib/prisma";

export async function getDirectorCourses(userId: string) {
  try {
    const director = await db.director.findFirst({
      where: {
        userId: userId, // APENAS busca pelo userId, não pela relação user
      },
      include: {
        courses: true,
      },
    });

    return director?.courses || [];
  } catch (error) {
    console.error("Erro ao buscar cursos do diretor:", error);
    return [];
  }
}
