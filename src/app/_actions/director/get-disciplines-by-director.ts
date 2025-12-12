"use server";

import { db } from "@/lib/prisma";
import { getUser } from "../user/getUser";

export async function getDisciplinesByDirector() {
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
    const directorCourses = await db.course.findMany({
      where: {
        directors: {
          some: {
            id: director.id,
          },
        },
        status: "ACTIVE",
      },
      select: {
        id: true,
      },
    });

    const courseIds = directorCourses.map((course) => course.id);

    if (courseIds.length === 0) {
      console.log("Diretor não tem cursos vinculados:", director.name);
      return [];
    }

    const disciplines = await db.discipline.findMany({
      where: {
        courses: {
          some: {
            id: {
              in: courseIds,
            },
          },
        },
        status: "ACTIVE",
      },
      include: {
        courses: true,
        semester: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return disciplines;
  } catch (error) {
    console.error("Erro ao buscar disciplinas do diretor:", error);
    throw new Error("Erro ao buscar disciplinas do diretor");
  }
}
