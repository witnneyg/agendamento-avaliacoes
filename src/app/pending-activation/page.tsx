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
import { UserCheck, Clock, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { checkUserAccess } from "../_actions/permissions/check-user-access";

export default function PendingActivationPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkStatus();

    const interval = setInterval(() => {
      checkStatus();
    }, 30000);

    return () => clearInterval(interval);
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

      if (result.status && result.status !== "PENDING_ACTIVATION") {
        if (result.status === "PENDING_APPROVAL") {
          router.push("/pending-access");
          return;
        }
      }

      setLastChecked(new Date());
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setIsChecking(false);
    }
  }

  async function handleManualRefresh() {
    await checkStatus();
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            {isChecking ? (
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            ) : (
              <UserCheck className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <CardTitle className="text-2xl">Perfil Pendente</CardTitle>
          <CardDescription>
            Seu perfil de professor está aguardando ativação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            <strong>AGUARDANDO A ATIVAÇÃO DO SEU PERFIL</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Seu usuário foi aprovado, mas seu perfil de professor precisa ser
            vinculado e ativado para que você possa acessar todas as
            funcionalidades.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>O administrador irá ativar seu perfil em breve</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
