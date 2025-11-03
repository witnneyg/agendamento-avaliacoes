"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { checkUserAccess } from "./_actions/permissions/check-user-access";
import { checkRoutePermission } from "./_actions/permissions/check-route-permission";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      checkUserStatus();
    }
  }, [status, session, router, pathname]);

  async function checkUserStatus() {
    try {
      setIsCheckingAccess(true);

      const result = await checkUserAccess();

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
      }

      const hasPermission = await checkRoutePermission(pathname);
      if (!hasPermission) {
        router.push("/unauthorized");
        return;
      }

      setIsCheckingAccess(false);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      router.push("/error");
    }
  }

  if (status === "loading" || isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        </div>
      </div>
    );
  }

  if (status === "authenticated" && !isCheckingAccess) {
    return <>{children}</>;
  }

  return null;
}
