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

const sessionCache = new Map();

export async function checkRoutePermission(pathname: string): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);

    console.log({ session });
    if (!session?.user?.email) {
      return false;
    }

    const cacheKey = `user-${session.user.email}`;

    if (sessionCache.has(cacheKey)) {
      const userRoles = sessionCache.get(cacheKey);
      return checkPathPermission(pathname, userRoles);
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { roles: true },
    });

    if (!user) {
      return false;
    }

    const userRoles = user.roles.map((role) => role.name);

    sessionCache.set(cacheKey, userRoles);
    setTimeout(() => sessionCache.delete(cacheKey), 5 * 60 * 1000);

    return checkPathPermission(pathname, userRoles);
  } catch (error) {
    console.error("Erro ao verificar permissão da rota:", error);
    return false;
  }
}

function checkPathPermission(pathname: string, userRoles: string[]): boolean {
  const routeKey = Object.keys(routePermissions).find(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!routeKey) {
    return true;
  }

  const allowedRoles = routePermissions[routeKey];
  return userRoles.some((role) => allowedRoles.includes(role));
}
