"use server";

import { db } from "@/lib/prisma";

interface CreateRoleInput {
  name: string;
  permissions: string[];
}

export async function createRole({ name, permissions }: CreateRoleInput) {
  try {
    const role = await db.role.create({
      data: {
        name,
        permissions: {
          connectOrCreate: permissions.map((perm) => ({
            where: { name: perm },
            create: { name: perm },
          })),
        },
      },
      include: {
        permissions: true,
      },
    });

    return role;
  } catch (error) {
    console.error("Erro ao criar role:", error);
    throw new Error("Falha ao criar a role");
  }
}
