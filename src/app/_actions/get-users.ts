"use server";

import { db } from "@/lib/prisma";

export async function getUsers() {
  try {
    const users = await db.user.findMany({
      include: {
        roles: {
          // INCLUIR as roles no retorno
          include: {
            permissions: true,
          },
        },
      },
    });
    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    throw new Error("Falha ao carregar usuários");
  }
}
