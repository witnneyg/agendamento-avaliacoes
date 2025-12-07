"use server";

import { db } from "@/lib/prisma";

export async function deleteCourse(courseId: string) {
  try {
    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
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
      },
    });

    if (!course) {
      throw new Error("Curso não encontrado");
    }

    const semesterIds = course.semesters.map((s) => s.id);
    const disciplineIds = course.semesters.flatMap((s) =>
      s.disciplines.map((d) => d.id)
    );
    const classIds = [
      ...course.classes.map((c) => c.id),
      ...course.semesters.flatMap((s) => s.classes.map((c) => c.id)),
    ];

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
    }

    if (disciplineIds.length > 0) {
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

    await db.course.update({
      where: { id: courseId },
      data: {
        teachers: {
          set: [],
        },
        disciplines: {
          set: [],
        },
      },
    });

    await db.course.delete({
      where: { id: courseId },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro detalhado ao deletar curso:", error);
  }
}
