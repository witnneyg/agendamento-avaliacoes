"use server";

import { db } from "@/lib/prisma";
import { Status } from "@prisma/client";

interface CreateTeacherInput {
  name: string;
  courseId: string;
  semesterId: string;
}

export async function createDiscipline({
  name,
  courseId,
  semesterId,
}: CreateTeacherInput) {
  return db.discipline.create({
    data: {
      name,
      status: Status.ACTIVE,
      courses: {
        connect: { id: courseId },
      },
      semester: {
        connect: { id: semesterId },
      },
    },
    include: {
      courses: true,
      semester: true,
    },
  });
}
