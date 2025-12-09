"use server";

import { db } from "@/lib/prisma";

export async function getOrCreateDirector(userId: string) {
  try {
    // Busca usuário
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // Busca diretor APENAS pelo userId
    let director = await db.director.findFirst({
      where: {
        userId: userId, // Corrigido: busca direta pelo userId
      },
      include: {
        courses: true,
      },
    });

    // Se não existe, cria
    if (!director) {
      director = await db.director.create({
        data: {
          name: user.name || "Diretor",
          email: user.email || "",
          userId: user.id,
        },
        include: {
          courses: true,
        },
      });
    }

    return director;
  } catch (error) {
    console.error("Erro ao buscar/criar diretor:", error);
    return null;
  }
}
