"use server";

import { db } from "@/lib/prisma";

export async function updateRolePermissions(
  roleId: string,
  permissionIds: string[]
) {
  try {
    const existingRole = await db.role.findUnique({
      where: { id: roleId },
    });

    if (!existingRole) {
      throw new Error(`Role com ID ${roleId} não encontrada`);
    }

    const updatedRole = await db.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          set: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
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
