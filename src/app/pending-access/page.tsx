"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Clock, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkUserAccess } from "../_actions/permissions/check-user-access";

export default function PendingAccessPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);
  useEffect(() => {
    const handleFocus = () => {
      checkStatus();
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  async function checkStatus() {
    try {
      setIsChecking(true);
      const result = await checkUserAccess();
      if (result.access) {
        router.push("/");
        return;
      }

      if (result.status && result.status !== "PENDING_APPROVAL") {
        if (result.status === "PENDING_ACTIVATION") {
          router.push("/pending-activation");
          return;
        }
      }
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleManualRefresh() {
    await checkStatus();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            {isChecking ? (
              <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
            ) : (
              <Clock className="h-8 w-8 text-yellow-600" />
            )}
          </div>
          <CardTitle className="text-2xl">Acesso Pendente</CardTitle>
          <CardDescription>
            Seu cadastro está aguardando aprovação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            <strong>AGUARDANDO A AUTORIZAÇÃO PELO ADM</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Seu usuário foi criado com sucesso, mas precisa ser aprovado por um
            administrador antes que você possa acessar o sistema.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Entre em contato com o administrador do sistema</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
