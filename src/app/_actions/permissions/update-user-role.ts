"use server";

import { db } from "@/lib/prisma";

export async function updateUserRole(userId: string, rolesId: string[]) {
  try {
    console.log(userId, "userId");
    console.log(rolesId, "rolesId");
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error(`Role com ID ${userId} não encontrada`);
    }

    // Atualizar as permissões da role
    const updatedRole = await db.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: rolesId.map((id) => ({ id })),
        },
      },
      include: {
        roles: {
          include: {
            permissions: true,
          },
        },
      },
    });

    return updatedRole;
  } catch (error) {
    console.error("Erro ao editar as permissões da role:", error);

    if (error instanceof Error) {
      throw new Error(`Falha ao editar as permissões: ${error.message}`);
    }

    throw new Error("Falha ao editar as permissões");
  }
}
