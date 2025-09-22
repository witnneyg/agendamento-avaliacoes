"use server";

import { db } from "@/lib/prisma";
import { Status } from "@prisma/client";

interface CreateTeacherInput {
  name: string;
  courseId: string;
  semesterId: string;
  // classId: string;
}

export async function createDiscipline({
  name,
  courseId,
  semesterId,
  // classId,
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
      // class: {
      //   connect: { id: classId },
      // },
    },
    include: {
      courses: true,
      semester: true,
      // class: true,
    },
  });
}
