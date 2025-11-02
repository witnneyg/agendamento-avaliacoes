"use server";

import { db } from "@/lib/prisma";

export async function deletePermission(permissionId: string) {
  try {
    const existingPermission = await db.permission.findUnique({
      where: { id: permissionId },
    });

    if (!existingPermission) {
      return {
        success: false,
        error: "Permissão não encontrada",
      };
    }

    const rolesWithPermission = await db.role.findMany({
      where: {
        permissions: {
          some: {
            id: permissionId,
          },
        },
      },
      select: {
        id: true,
      },
    });

    for (const role of rolesWithPermission) {
      await db.role.update({
        where: { id: role.id },
        data: {
          permissions: {
            disconnect: {
              id: permissionId,
            },
          },
        },
      });
    }

    await db.permission.delete({
      where: { id: permissionId },
    });

    return {
      success: true,
      message: "Permissão excluída com sucesso",
    };
  } catch (error) {
    console.error("Erro ao excluir permissão:", error);
    return {
      success: false,
      error: "Erro interno do servidor ao excluir permissão",
    };
  }
}
