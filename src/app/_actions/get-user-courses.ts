"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function getUserCourses() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      throw new Error("Usuário não logado");
    }

    // Buscar o usuário com suas roles
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const isProfessor = user.roles.some((role) => role.name === "PROFESSOR");

    if (isProfessor) {
      // Buscar teacher pelo nome do usuário
      const teacher = await db.teacher.findFirst({
        where: {
          name: user.name || user.email?.split("@")[0] || "",
        },
        include: {
          courses: {
            where: {
              status: "ACTIVE",
            },
          },
        },
      });

      console.log("Professor encontrado:", teacher?.name);
      console.log("Cursos do professor:", teacher?.courses?.length);

      return teacher?.courses || [];
    } else {
      // Se não for professor, buscar todos os cursos ativos
      const courses = await db.course.findMany({
        where: {
          status: "ACTIVE",
        },
      });

      return courses;
    }
  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    return [];
  }
}
