"use server";

import { db } from "@/lib/prisma";

export async function getRoles() {
  try {
    const roles = await db.role.findMany({
      include: {
        permissions: true,
      },
    });
    return roles;
  } catch (error) {
    console.error("Erro ao buscar roles:", error);
    throw new Error("Falha ao carregar roles");
  }
}
