"use server";

import { db } from "@/lib/prisma";
import { Period, Status } from "@prisma/client";

interface CreateTeacherInput {
  name: string;
  courseId: string;
  semesterId: string;
  dayPeriod: Period;
  // classId: string;
}

export async function createDiscipline({
  name,
  courseId,
  semesterId,
  dayPeriod,
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
      dayPeriod: dayPeriod,
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
