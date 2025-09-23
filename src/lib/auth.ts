import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { db } from "./prisma";
import { resend } from "@/app/api/email/config";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = profile?.email;
        if (
          email &&
          (email.endsWith("@unicerrado.edu.br") ||
            email.endsWith("@alunos.unicerrado.edu.br"))
        ) {
          return true;
        }
        return false;
      }
      return true;
    },
  },
};
