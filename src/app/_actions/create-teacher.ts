"use server";

import { db } from "@/lib/prisma";
import { Status } from "@prisma/client";

interface CreateTeacherInput {
  name: string;
  courseId: string;
  disciplineId: string;
}

export async function createTeacher({
  name,
  courseId,
  disciplineId,
}: CreateTeacherInput) {
  await db.teacher.create({
    data: {
      name,
      status: Status.ACTIVE,
      courses: {
        connect: { id: courseId },
      },
      disciplines: {
        connect: { id: disciplineId },
      },
    },
    include: {
      courses: true,
      disciplines: true,
    },
  });
}
