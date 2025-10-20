"use server";

import { db } from "@/lib/prisma";
import { Status } from "@prisma/client";

interface CreateTeacherInput {
  name: string;
  courseIds: string[];
  disciplineIds: string[];
  status: Status;
}

export async function createTeacher({
  name,
  courseIds,
  disciplineIds,
  status,
}: CreateTeacherInput) {
  return await db.teacher.create({
    data: {
      name,
      status: status,
      courses: {
        connect: courseIds.map((id) => ({ id })),
      },
      disciplines: {
        connect: disciplineIds.map((id) => ({ id })),
      },
    },
    include: {
      courses: true,
      disciplines: true,
    },
  });
}
