import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { db } from "./prisma";
import { resend } from "@/app/api/email/config";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    EmailProvider({
      maxAge: 15 * 60,
      async sendVerificationRequest({ identifier: email, url }) {
        try {
          await resend.emails.send({
            from: `${process.env.EMAIL_FROM_EMAIL}`,
            to: `${process.env.EMAIL_TO_EMAIL}`,
            subject: "Seu link de login",
            html: `<p>Clique <a href="${url}">aqui</a> para entrar.<br/>Este link expira em 15 minutos.</p>`,
          });
        } catch (error) {
          console.error("Erro ao enviar e-mail de verificação:", error);

          throw new Error("Falha ao enviar e-mail de verificação");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
