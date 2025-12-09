"use server";

import { db } from "@/lib/prisma";

interface AssignDirectorToCoursesParams {
  directorId: string;
  courseIds: string[];
}

export async function assignDirectorToCourses({
  directorId,
  courseIds,
}: AssignDirectorToCoursesParams) {
  try {
    await db.director.update({
      where: { id: directorId },
      data: {
        courses: {
          connect: courseIds.map((id) => ({ id })),
        },
      },
    });

    return {
      success: true,
      message: `Diretor vinculado a ${courseIds.length} curso(s)`,
    };
  } catch (error) {
    console.error("Erro ao vincular diretor a cursos:", error);
    return {
      success: false,
      message: "Erro ao vincular diretor aos cursos",
    };
  }
}
