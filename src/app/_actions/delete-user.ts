"use server";

import { db } from "@/lib/prisma";

export async function deleteUser(userId: string) {
  try {
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });

    if (!existingUser) {
      throw new Error(`Usuário com ID ${userId} não encontrado`);
    }

    if (existingUser.roles.some((role) => role.name === "ADMIN")) {
      const adminUsers = await db.user.findMany({
        where: {
          roles: {
            some: {
              name: "ADMIN",
            },
          },
        },
      });

      if (adminUsers.length <= 1) {
        throw new Error(
          "Não é possível excluir o único usuário administrador do sistema"
        );
      }
    }

    await db.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: `Usuário "${existingUser.name}" excluído com sucesso`,
    };
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);

    if (error instanceof Error) {
      throw new Error(`Falha ao excluir o usuário: ${error.message}`);
    }

    throw new Error("Falha ao excluir o usuário");
  }
}
