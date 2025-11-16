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
  return await db.$transaction(async (tx) => {
    const currentCourse = await tx.course.findUnique({
      where: { id: data.id },
      include: {
        semesters: {
          include: {
            disciplines: {
              include: {
                schedulings: true,
                teachers: true,
              },
            },
            classes: {
              include: {
                schedulings: true,
              },
            },
            schedulings: true,
          },
        },
      },
    });

    if (!currentCourse) {
      throw new Error("Curso não encontrado");
    }

    const currentDuration = currentCourse.semesterDuration;
    const newDuration = data.semesterDuration;

    if (newDuration < currentDuration) {
      await deleteSemestersBeyondNewDuration(
        tx,
        data.id,
        currentCourse.semesters,
        newDuration
      );
    }

    const course = await tx.course.update({
      where: { id: data.id },
      data: {
        name: data.name,
        periods: data.periods,
        semesterDuration: data.semesterDuration,
      },
    });

    if (currentDuration !== newDuration) {
      await syncCourseSemesters(tx, data.id, newDuration, data.name);
    }

    return course;
  });
}

async function deleteSemestersBeyondNewDuration(
  tx: any,
  courseId: string,
  currentSemesters: any[],
  newDuration: number
) {
  const sortedSemesters = [...currentSemesters].sort((a, b) => {
    const getNumber = (name: string) => {
      const match = name.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };
    return getNumber(a.name) - getNumber(b.name);
  });

  const semestersToDelete = sortedSemesters.filter(
    (_, index) => index >= newDuration
  );

  if (semestersToDelete.length === 0) return;

  const semesterIdsToDelete = semestersToDelete.map((s) => s.id);
  const disciplineIdsToDelete = semestersToDelete.flatMap((s) =>
    s.disciplines.map((d: any) => d.id)
  );
  const classIdsToDelete = semestersToDelete.flatMap((s) =>
    s.classes.map((c: any) => c.id)
  );

  await tx.scheduling.deleteMany({
    where: {
      OR: [
        { semesterId: { in: semesterIdsToDelete } },
        { disciplineId: { in: disciplineIdsToDelete } },
        { classId: { in: classIdsToDelete } },
      ],
    },
  });

  for (const disciplineId of disciplineIdsToDelete) {
    await tx.discipline.update({
      where: { id: disciplineId },
      data: {
        teachers: {
          set: [],
        },
      },
    });
  }
  if (disciplineIdsToDelete.length > 0) {
    for (const disciplineId of disciplineIdsToDelete) {
      await tx.discipline.update({
        where: { id: disciplineId },
        data: {
          courses: {
            disconnect: { id: courseId },
          },
        },
      });
    }
  }

  if (disciplineIdsToDelete.length > 0) {
    await tx.discipline.deleteMany({
      where: {
        id: { in: disciplineIdsToDelete },
      },
    });
  }

  if (classIdsToDelete.length > 0) {
    await tx.class.deleteMany({
      where: {
        id: { in: classIdsToDelete },
      },
    });
  }

  await tx.semester.deleteMany({
    where: {
      id: { in: semesterIdsToDelete },
    },
  });
}

async function syncCourseSemesters(
  tx: any,
  courseId: string,
  newDuration: number,
  courseName: string
) {
  const currentSemesters = await tx.semester.findMany({
    where: { courseId },
  });

  const sortedCurrentSemesters = [...currentSemesters].sort((a, b) => {
    const getNumber = (name: string) => {
      const match = name.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };
    return getNumber(a.name) - getNumber(b.name);
  });

  if (sortedCurrentSemesters.length < newDuration) {
    const semestersToCreate = Array.from(
      { length: newDuration - sortedCurrentSemesters.length },
      (_, i) => ({
        name: `Período ${sortedCurrentSemesters.length + i + 1}`,
        description: `Disciplinas e atividades do semestre ${sortedCurrentSemesters.length + i + 1} - ${courseName}`,
        courseId: courseId,
      })
    );

    await tx.semester.createMany({
      data: semestersToCreate,
    });
  }
}
