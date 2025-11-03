"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { checkUserAccess } from "./_actions/permissions/check-user-access";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      checkUserStatus();
    }
  }, [status, session, router]);

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

      // Se chegou aqui, tem acesso completo
      setIsCheckingAccess(false);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      setIsCheckingAccess(false);
    }
  }

  if (status === "loading" || isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (status === "authenticated" && !isCheckingAccess) {
    return <>{children}</>;
  }

  return null;
}
