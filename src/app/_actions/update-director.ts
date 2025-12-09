"use server";

import { db } from "@/lib/prisma";

interface UpdateDirectorParams {
  id: string;
  name: string;
  email: string;
  courseIds: string[];
  status: "ACTIVE" | "INACTIVE";
}

export async function updateDirector({
  id,
  name,
  email,
  courseIds,
  status,
}: UpdateDirectorParams) {
  try {
    const director = await db.director.update({
      where: { id },
      data: {
        name,
        email,
        status,
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
      director,
    };
  } catch (error) {
    console.error("Erro ao atualizar diretor:", error);
    return {
      success: false,
      error: "Erro ao atualizar diretor",
    };
  }
}
