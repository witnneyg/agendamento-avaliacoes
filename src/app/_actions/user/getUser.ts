"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function getUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Usuário não logado");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      roles: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    roles: user.roles,
    image: user.image,
  };
}
