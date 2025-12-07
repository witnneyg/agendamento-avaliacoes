"use server";

import { db } from "@/lib/prisma";
import { Period, Status } from "@prisma/client";

interface CreateTeacherInput {
  name: string;
  courseId: string;
  semesterId: string;
  dayPeriods: Period[];
}

export async function createDiscipline({
  name,
  courseId,
  semesterId,
  dayPeriods,
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
      dayPeriods: dayPeriods,
    },
    include: {
      courses: true,
      semester: true,
    },
  });
}
