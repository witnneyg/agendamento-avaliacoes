// _actions/update-course.ts
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
  const currentCourse = await db.course.findUnique({
    where: { id: data.id },
    select: { semesterDuration: true },
  });

  if (!currentCourse) {
    throw new Error("Curso não encontrado");
  }

  const course = await db.course.update({
    where: { id: data.id },
    data: {
      name: data.name,
      periods: data.periods,
      semesterDuration: data.semesterDuration,
    },
  });

  if (currentCourse.semesterDuration !== data.semesterDuration) {
    await syncCourseSemesters(data.id, data.semesterDuration, data.name);
  }

  return course;
}

async function syncCourseSemesters(
  courseId: string,
  newDuration: number,
  courseName: string
) {
  const currentSemesters = await db.semester.findMany({
    where: { courseId },
    orderBy: { name: "asc" },
  });

  if (currentSemesters.length > newDuration) {
    const semestersToDelete = currentSemesters.slice(newDuration);

    for (const semester of semestersToDelete) {
      await db.semester.delete({
        where: { id: semester.id },
      });
    }
  }

  if (currentSemesters.length < newDuration) {
    const semestersToCreate = Array.from(
      { length: newDuration - currentSemesters.length },
      (_, i) => ({
        name: `Período ${currentSemesters.length + i + 1}`,
        description: `Disciplinas e atividades do semestre ${currentSemesters.length + i + 1} - ${courseName}`,
        courseId: courseId,
      })
    );

    await db.semester.createMany({
      data: semestersToCreate,
    });
  }

  const remainingSemesters = currentSemesters.slice(0, newDuration);
  for (let i = 0; i < remainingSemesters.length; i++) {
    await db.semester.update({
      where: { id: remainingSemesters[i].id },
      data: {
        name: `Período ${i + 1}`,
        description: `Disciplinas e atividades do semestre ${i + 1} - ${courseName}`,
      },
    });
  }
}
