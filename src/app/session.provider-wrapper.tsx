"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { checkUserAccess } from "./_actions/permissions/check-user-access";

export function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AccessController>{children}</AccessController>
    </SessionProvider>
  );
}

const accessCache = new Map();

function AccessController({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [accessChecked, setAccessChecked] = useState(false);

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
      const result = await checkUserAccess();

      accessCache.set(cacheKey, result);
      setTimeout(() => accessCache.delete(cacheKey), 2 * 60 * 1000);

      if (result.redirect) {
        router.push(result.redirect);
        return;
      }

      if (!result.access) {
        if (result.status === "PENDING_APPROVAL") {
          router.push("/pending-access");
          return;
        }

        if (result.status === "PENDING_ACTIVATION") {
          router.push("/pending-activation");
          return;
        }

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
