"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

const routePermissions: Record<string, string[]> = {
  "/": ["ADMIN", "DIREÇÃO", "SECRETARIA", "PROFESSOR"],
  "/calendar": ["ADMIN", "DIREÇÃO", "SECRETARIA", "PROFESSOR"],
  "/secretaria": ["ADMIN", "SECRETARIA"],
  "/direcao": ["ADMIN", "DIREÇÃO"],
  "/admin": ["ADMIN"],
};

export async function checkRoutePermission(pathname: string): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return false;
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return false;
    }

    const userRoles = user.roles.map((role) => role.name);

    const routeKey = Object.keys(routePermissions).find(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!routeKey) {
      return true;
    }

    const allowedRoles = routePermissions[routeKey];
    const hasPermission = userRoles.some((role) => allowedRoles.includes(role));

    return hasPermission;
  } catch (error) {
    console.error("Erro ao verificar permissão da rota:", error);
    return false;
  }
}
