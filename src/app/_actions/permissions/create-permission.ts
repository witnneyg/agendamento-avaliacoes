"use server";

import { db } from "@/lib/prisma";

export async function createPermission(name: string) {
  try {
    const permission = await db.permission.create({ data: { name } });

    return permission;
  } catch (error) {
    console.error("Erro ao criar a permissão:", error);
    throw new Error("Falha ao criar a permissão");
  }
}
