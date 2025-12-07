"use server";

import { db } from "@/lib/prisma";

export async function deleteClass(classId: string) {
  await db.class.delete({
    where: {
      id: classId,
    },
  });
}
