"use server";

import { db } from "@/lib/prisma";

interface RemoveDirectorFromCoursesParams {
  directorId: string;
  courseIds: string[];
}

export async function removeDirectorFromCourses({
  directorId,
  courseIds,
}: RemoveDirectorFromCoursesParams) {
  try {
    await db.director.update({
      where: { id: directorId },
      data: {
        courses: {
          disconnect: courseIds.map((id) => ({ id })),
        },
      },
    });

    return {
      success: true,
      message: "Vinculação removida com sucesso",
    };
  } catch (error) {
    console.error("Erro ao remover vinculação:", error);
    return {
      success: false,
      message: "Erro ao remover vinculação",
    };
  }
}
