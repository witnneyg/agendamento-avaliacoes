"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { checkUserAccess } from "./_actions/permissions/check-user-access";
import { getUser } from "./_actions/user/getUser";

export function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AccessController>{children}</AccessController>
    </SessionProvider>
  );
}

const accessCache = new Map();

const routePermissions: Record<string, string[]> = {
  "/secretaria": ["SECRETARIA", "ADMIN"],
  "/direcao": ["DIRETOR", "DIRECAO", "ADMIN"],
  "/admin": ["ADMIN"],
};

function AccessController({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [accessChecked, setAccessChecked] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);

  const publicRoutes = [
    "/pending-access",
    "/pending-activation",
    "/login",
    "/auth",
    "/unauthorized",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  const hasPermissionForRoute = (path: string, roles: string[]): boolean => {
    const routeKey = Object.keys(routePermissions).find((route) =>
      path.startsWith(route)
    );

    if (!routeKey) {
      return true;
    }

    const requiredRoles = routePermissions[routeKey];
    return roles.some((role) => requiredRoles.includes(role));
  };

  const verifyAccess = useCallback(async () => {
    const cacheKey = `${session?.user?.email}-${pathname}`;

    if (accessCache.has(cacheKey)) {
      const cached = accessCache.get(cacheKey);
      if (cached.redirect) {
        router.push(cached.redirect);
      } else {
        setAccessChecked(true);
      }
      return;
    }

    try {
      const accessResult = await checkUserAccess();

      const userData = await getUser();
      const userRolesList =
        (userData as any)?.roles?.map((role: any) => role.name) || [];
      setUserRoles(userRolesList);

      accessCache.set(cacheKey, { ...accessResult, userRoles: userRolesList });
      setTimeout(() => accessCache.delete(cacheKey), 2 * 60 * 1000);

      if (accessResult.redirect) {
        router.push(accessResult.redirect);
        return;
      }

      if (!accessResult.access) {
        if (accessResult.status === "PENDING_APPROVAL") {
          router.push("/pending-access");
          return;
        }

        if (accessResult.status === "PENDING_ACTIVATION") {
          router.push("/pending-activation");
          return;
        }

        router.push("/unauthorized");
        return;
      }

      if (!hasPermissionForRoute(pathname, userRolesList)) {
        router.push("/unauthorized");
        return;
      }

      setAccessChecked(true);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      router.push("/error");
    }
  }, [session, pathname, router]);

  useEffect(() => {
    if (session?.user?.email) {
      const userEmail = session.user.email;
      for (const key of accessCache.keys()) {
        if (!key.startsWith(userEmail)) {
          accessCache.delete(key);
        }
      }
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (isPublicRoute) {
      setAccessChecked(true);
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.email && !accessChecked) {
      verifyAccess();
    }
  }, [status, session, isPublicRoute, accessChecked, verifyAccess]);

  useEffect(() => {
    if (status === "authenticated" && pathname && userRoles.length > 0) {
      if (!hasPermissionForRoute(pathname, userRoles) && !isPublicRoute) {
        router.push("/unauthorized");
      }
    }
  }, [pathname, userRoles, status, isPublicRoute, router]);

  if (isPublicRoute || (status === "authenticated" && accessChecked)) {
    return <>{children}</>;
  }

  if (status === "loading" || !accessChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  return null;
}
