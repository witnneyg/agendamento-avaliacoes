"use server";

import { db } from "@/lib/prisma";

interface CreateClassInput {
  name: string;
  courseId: string;
  // disciplineId: string;
  semesterId: string;
}

export async function createClasses({
  name,
  courseId,
  // disciplineId,
  semesterId,
}: CreateClassInput) {
  return db.class.create({
    data: {
      name,
      course: {
        connect: { id: courseId },
      },
      semester: {
        connect: { id: semesterId },
      },
      // disciplines: {
      //   connect: { id: disciplineId },
      // },
    },
    include: {
      course: true,
      semester: true,
      // disciplines: true,
    },
  });
}
