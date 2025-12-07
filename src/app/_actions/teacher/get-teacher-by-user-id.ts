"use server";

import { db } from "@/lib/prisma";

export async function getTeacherByUserId(userId: string) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user || !user.name) {
      return null;
    }

    const teacher = await db.teacher.findFirst({
      where: {
        name: user.name,
      },
      select: {
        id: true,
        name: true,
      },
    });

    return teacher;
  } catch (error) {
    return null;
  }
}
