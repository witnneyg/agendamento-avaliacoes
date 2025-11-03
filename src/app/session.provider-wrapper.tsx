"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { checkUserAccess } from "./_actions/permissions/check-user-access";

export function SessionProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AccessController>{children}</AccessController>
    </SessionProvider>
  );
}

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
  ];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  useEffect(() => {
    if (isPublicRoute || accessChecked) {
      return;
    }

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      verifyAccess();
    }
  }, [status, session, router, pathname, isPublicRoute, accessChecked]);

  async function verifyAccess() {
    try {
      const result = await checkUserAccess();

      if (result.redirect) {
        router.push(result.redirect);
        return;
      }

      if (!result.access && result.status) {
        if (result.status === "PENDING_APPROVAL") {
          router.push("/pending-access");
          return;
        }

        if (result.status === "PENDING_ACTIVATION") {
          router.push("/pending-activation");
          return;
        }
      }

      setAccessChecked(true);
    } catch (error) {
      console.error("Erro ao verificar acesso:", error);
      setAccessChecked(true);
    }
  }

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (status === "authenticated" && accessChecked) {
    return <>{children}</>;
  }

  return <GlobalLoading message="Redirecionando..." />;
}

function GlobalLoading({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
      </div>
    </div>
  );
}
