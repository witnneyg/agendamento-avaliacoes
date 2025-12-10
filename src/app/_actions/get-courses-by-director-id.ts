"use server";

import { db } from "@/lib/prisma";

export async function getCoursesByDirectorId(directorId: string) {
  try {
    const director = await db.director.findUnique({
      where: {
        id: directorId,
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
