// app/_actions/coursers/get-coursers.ts
"use server";

import { db } from "@/lib/prisma";
import { getUser } from "../user/getUser";

export async function getCoursesByDirector() {
  try {
    const user = await getUser();

    const director = await db.director.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!director) {
      console.warn("Usuário não está vinculado a um diretor:", user.email);
      return [];
    }

    const courses = await db.course.findMany({
      where: {
        directors: {
          some: {
            id: director.id,
          },
        },
        status: "ACTIVE",
      },
      orderBy: {
        name: "asc",
      },
    });

    return courses;
  } catch (error) {
    console.error("Erro ao buscar cursos do diretor:", error);
    throw new Error("Erro ao buscar cursos do diretor");
  }
}
