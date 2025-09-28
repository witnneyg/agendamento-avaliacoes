"use server";

import { db } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type UpdateDisciplineInput = {
  id: string;
  name: string;
  courseId: string;
  semesterId: string;
};

export async function updateDiscipline(data: UpdateDisciplineInput): Promise<
  Prisma.DisciplineGetPayload<{
    include: { courses: true; semester: true };
  }>
> {
  const discipline = await db.discipline.update({
    where: { id: data.id },
    data: {
      name: data.name,
      courses: {
        set: [{ id: data.courseId }],
      },
      semester: {
        connect: { id: data.semesterId },
      },
    },
    include: {
      courses: true,
      semester: true,
    },
  });

  return discipline;
}
