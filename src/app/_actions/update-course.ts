"use server";

import { db } from "@/lib/prisma";
import type { Course, Period } from "@prisma/client";

type UpdateCourseInput = {
  id: string;
  name: string;
  periods: Period[];
  semesterDuration: number;
};

export async function updateCourse(data: UpdateCourseInput): Promise<Course> {
  const course = await db.course.update({
    where: { id: data.id },
    data: {
      name: data.name,
      periods: data.periods,
      semesterDuration: data.semesterDuration,
    },
  });

  return course;
}
