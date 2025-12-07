"use server";

import { db } from "@/lib/prisma";

export async function getSemestersByCourseForTeacher(
  courseId: string,
  teacherId?: string
) {
  if (!teacherId) {
    const semesters = await db.semester.findMany({
      where: { courseId },
    });

    const sortedSemesters = semesters.sort((a, b) => {
      const getNumber = (name: string) => {
        const match = name.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      return getNumber(a.name) - getNumber(b.name);
    });

    return sortedSemesters;
  }

  const semesters = await db.semester.findMany({
    where: {
      AND: [
        { courseId },
        {
          disciplines: {
            some: {
              teachers: {
                some: {
                  id: teacherId,
                },
              },
            },
          },
        },
      ],
    },
  });

  const sortedSemesters = semesters.sort((a, b) => {
    const getNumber = (name: string) => {
      const match = name.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    return getNumber(a.name) - getNumber(b.name);
  });

  return sortedSemesters;
}
