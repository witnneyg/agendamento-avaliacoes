"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        directors: true,
        semesters: {
          include: {
            disciplines: {
              include: {
                teachers: true,
              },
            },
            classes: true,
          },
        },
        teachers: true,
        disciplines: true,
        classes: true,
        schedulings: true,
      },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    const semesterIds = course.semesters.map((s) => s.id);
    const disciplineIds = [
      ...course.disciplines.map((d) => d.id),
      ...course.semesters.flatMap((s) => s.disciplines.map((d) => d.id)),
    ];
    const classIds = [
      ...course.classes.map((c) => c.id),
      ...course.semesters.flatMap((s) => s.classes.map((c) => c.id)),
    ];

    if (course.directors.length > 0) {
      for (const director of course.directors) {
        await db.director.update({
          where: { id: director.id },
          data: {
            courses: {
              disconnect: { id: courseId },
            },
          },
        });
      }
    }

    await db.scheduling.deleteMany({
      where: {
        OR: [
          { courseId },
          { semesterId: { in: semesterIds } },
          { disciplineId: { in: disciplineIds } },
          { classId: { in: classIds } },
        ],
      },
    });

    if (disciplineIds.length > 0) {
      for (const disciplineId of disciplineIds) {
        await db.discipline.update({
          where: { id: disciplineId },
          data: {
            teachers: {
              set: [],
            },
          },
        });
      }

      await db.discipline.deleteMany({
        where: { id: { in: disciplineIds } },
      });
    }

    if (classIds.length > 0) {
      await db.class.deleteMany({
        where: { id: { in: classIds } },
      });
    }

    if (semesterIds.length > 0) {
      await db.semester.deleteMany({
        where: { id: { in: semesterIds } },
      });
    }

    if (course.teachers.length > 0) {
      for (const teacher of course.teachers) {
        await db.teacher.update({
          where: { id: teacher.id },
          data: {
            courses: {
              disconnect: { id: courseId },
            },
          },
        });
      }
    }

    await db.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  } catch (error) {
    try {
      const courseWithDirectors = await db.course.findUnique({
        where: { id: courseId },
        include: { directors: true },
      });

      if (courseWithDirectors && courseWithDirectors.directors.length > 0) {
        for (const director of courseWithDirectors.directors) {
          await db.director.update({
            where: { id: director.id },
            data: {
              courses: {
                disconnect: { id: courseId },
              },
            },
          });
        }
      }
    } catch {}

    throw error;
  }
}
