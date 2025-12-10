"use server";

import { db } from "@/lib/prisma";

export async function getDirectorByUserId(userId: string) {
  try {
    const director = await db.director.findFirst({
      where: {
        userId: userId,
      },
    });

    return director;
  } catch (error) {
    console.error("Erro ao buscar diretor pelo user ID:", error);
    return null;
  }
}
