"use server";

import { db } from "@/lib/prisma";

export async function deleteTeacher(teacherId: string) {
  const teacher = await db.teacher.findUnique({
    where: {
      id: teacherId,
    },
  });

  if (!teacher) {
    throw new Error("Professor não encontrado");
  }

  await db.teacher.delete({
    where: {
      id: teacherId,
    },
  });
}
