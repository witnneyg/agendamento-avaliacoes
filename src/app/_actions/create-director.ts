"use server";

import { db } from "@/lib/prisma";

interface CreateDirectorParams {
  name: string;
  email: string;
  courseIds?: string[];
  status?: "ACTIVE" | "INACTIVE";
}

export async function createDirector({
  name,
  email,
  courseIds = [],
  status = "ACTIVE",
}: CreateDirectorParams) {
  try {
    const director = await db.director.create({
      data: {
        name,
        email,
        status,
        ...(courseIds.length > 0 && {
          courses: {
            connect: courseIds.map((id) => ({ id })),
          },
        }),
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
    console.error("Erro ao criar diretor:", error);
    return {
      success: false,
      error: "Erro ao criar diretor",
    };
  }
}
