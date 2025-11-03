"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/prisma";

export async function checkUserAccess() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return {
        access: false,
        redirect: "/login",
      };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return {
        access: false,
        redirect: "/login",
      };
    }

    const userRoles = user.roles.map((role) => role.name.toUpperCase());

    const hasOnlyUserRole = userRoles.length === 1 && userRoles[0] === "USER";

    if (hasOnlyUserRole) {
      return {
        access: false,
        status: "PENDING_APPROVAL",
        message: "AGUARDANDO A AUTORIZAÇÃO PELO ADM",
      };
    }

    const rolesThatNeedActivation = ["PROFESSOR"];
    const isProfessor = userRoles.some((role) =>
      rolesThatNeedActivation.includes(role)
    );

    if (isProfessor) {
      const teacherProfile = await db.teacher.findFirst({
        where: {
          name: user.name || "",
          status: "ACTIVE",
        },
      });

      if (!teacherProfile) {
        return {
          access: false,
          status: "PENDING_ACTIVATION",
          message: "AGUARDANDO A ATIVAÇÃO DO SEU PERFIL",
        };
      }
    }

    return {
      access: true,
      user: {
        name: user.name,
        email: user.email,
        roles: userRoles,
      },
    };
  } catch (error) {
    console.error("Erro ao verificar acesso:", error);
    return {
      access: false,
      redirect: "/auth/signin",
    };
  }
}
