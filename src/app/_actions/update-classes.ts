"use server";

import { db } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type UpdateClassInput = {
  id: string;
  name: string;
  courseId: string;
  semesterId: string;
};

export async function updateClass(
  data: UpdateClassInput
): Promise<
  Prisma.ClassGetPayload<{ include: { course: true; semester: true } }>
> {
  return db.class.update({
    where: { id: data.id },
    data: {
      name: data.name,
      courseId: data.courseId,
      semesterId: data.semesterId,
    },
    include: {
      course: true,
      semester: true,
    },
  });
}
