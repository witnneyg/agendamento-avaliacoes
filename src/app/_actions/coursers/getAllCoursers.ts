// app/_actions/course/get-all-courses.ts
"use server";

import { db } from "@/lib/prisma";

export async function getAllCourses() {
  try {
    const courses = await db.course.findMany({
      where: {
        status: "ACTIVE",
      },
    });
    return courses;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
