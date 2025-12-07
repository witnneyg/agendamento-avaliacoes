"use server";

import { db } from "@/lib/prisma";
import { Period } from "@prisma/client";

interface CreateCourseInput {
  name: string;
  description?: string;
  periods: Period[];
  semesterDuration: number;
}

export async function createCourse(data: CreateCourseInput) {
  const course = await db.course.create({
    data: {
      name: data.name,
      description: data.description ?? "",
      periods: data.periods,
      semesterDuration: data.semesterDuration,
      status: "ACTIVE",
    },
  });

  if (data.semesterDuration > 0) {
    await db.semester.createMany({
      data: Array.from({ length: data.semesterDuration }, (_, i) => ({
        name: `Período ${i + 1}`,
        description: `Disciplinas e atividades do semestre ${i + 1}`,
        courseId: course.id,
      })),
    });
  }

  return course;
}
