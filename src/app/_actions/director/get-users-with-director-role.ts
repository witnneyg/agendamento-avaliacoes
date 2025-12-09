"use server";

import { db } from "@/lib/prisma";

export async function getUsersWithDirectorRole() {
  try {
    const users = await db.user.findMany({
      where: {
        roles: {
          some: {
            name: "DIRECAO",
          },
        },
      },
      include: {
        roles: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return users;
  } catch (error) {
    console.error("Erro ao buscar usuários com role DIRECTOR:", error);
    return [];
  }
}
