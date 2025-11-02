"use server";

import { db } from "@/lib/prisma";

export async function getPermissions() {
  try {
    const permissions = await db.permission.findMany();
    return permissions;
  } catch (error) {
    console.error("Erro ao buscar permissões:", error);
    throw new Error("Falha ao carregar permissões");
  }
}
