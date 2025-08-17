"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const magicLinkSchema = z.object({
  email: z
    .string()
    .email("Email inválido")
    .nonempty("O email deve ser obrigatório")
    .refine(
      (email) =>
        email.endsWith("@unicerrado.edu.br") ||
        email.endsWith("@alunos.unicerrado.edu.br"),
      {
        message: "O email deve ser do domínio unicerrado",
      }
    ),
});

type MagicLinkType = z.infer<typeof magicLinkSchema>;

export function MagicLinkForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicLinkType>({
    resolver: zodResolver(magicLinkSchema),
  });

  const handleSubmitMagicLink = async (data: MagicLinkType) => {
    setIsLoading(true);

    await signIn("email", {
      email: data.email,
      redirect: false,
      callbackUrl: "/",
    });
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">
                Link enviado com sucesso!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Verifique seu e-mail em{" "}
                <span className="font-medium">{email}</span> para obter seu link
                de acesso seguro.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsSuccess(false);
                setEmail("");
              }}
              className="w-full cursor-pointer"
            >
              Mandar outro link
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-card-foreground">
          Acessar a página de agendamento
        </CardTitle>
        <CardDescription>
          Não é necessária senha - enviaremos um link seguro
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(handleSubmitMagicLink)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <div className="relative">
              <div className="flex flex-col items-center justify-center">
                <Mail className="absolute left-3  w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Insira o seu email institucional"
                  {...register("email")}
                  className={
                    errors.email
                      ? "border-red-500 pl-10 bg-input text-foreground placeholder:text-muted-foreground "
                      : "pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground"
                  }
                />
              </div>
              {errors.email ? (
                <p className="text-red-500 text-sm h-5">
                  {errors.email.message}
                </p>
              ) : (
                <p className="h-5"></p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Enviando para o email
              </div>
            ) : (
              <div className="flex items-center gap-2 ">
                Logar
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            O link mágico irá expirar em 15 minutos por motivos de segurança
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
