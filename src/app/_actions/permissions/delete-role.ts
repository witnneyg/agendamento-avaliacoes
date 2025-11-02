"use server";

import { db } from "@/lib/prisma";

export async function deleteRole(roleId: string) {
  try {
    const existingRole = await db.role.findUnique({
      where: { id: roleId },
      include: {
        users: true,
        permissions: true,
      },
    });

    if (!existingRole) {
      throw new Error(`Role com ID ${roleId} não encontrada`);
    }

    if (existingRole.users.length > 0) {
      throw new Error(
        `Não é possível excluir a role "${existingRole.name}" porque existem usuários associados a ela. Remova a role dos usuários primeiro.`
      );
    }

    await db.role.delete({
      where: { id: roleId },
    });

    return {
      success: true,
      message: `Role "${existingRole.name}" excluída com sucesso`,
    };
  } catch (error) {
    console.error("Erro ao excluir role:", error);

    if (error instanceof Error) {
      throw new Error(`Falha ao excluir a role: ${error.message}`);
    }

    throw new Error("Falha ao excluir a role");
  }
}
