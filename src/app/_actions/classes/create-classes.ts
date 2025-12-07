"use server";

import { db } from "@/lib/prisma";

interface CreateClassInput {
  name: string;
  courseId: string;
  semesterId: string;
}

export async function createClasses({
  name,
  courseId,
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
    },
    include: {
      course: true,
      semester: true,
    },
  });
}
