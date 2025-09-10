"use server";

import { db } from "@/lib/prisma";
import { Status } from "@prisma/client";

interface CreateTeacherInput {
  name: string;
  courseId: string;
  semesterId: string;
}

export async function createCourse({
  name,
  courseId,
  semesterId,
}: CreateTeacherInput) {
  return db.course.create({
    data: {
      name,
      description: "",
    },
  });
}
