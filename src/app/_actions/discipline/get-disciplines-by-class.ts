"use server";

import { db } from "@/lib/prisma";

export async function getDisciplinesByClass(
  classId: string,
  teacherId?: string
) {
  const classData = await db.class.findUnique({
    where: { id: classId },
    include: {
      course: true,
      semester: {
        include: {
          disciplines: {
            where: {
              status: "ACTIVE",
            },
            include: {
              teachers: {
                where: {
                  status: "ACTIVE",
                },
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!classData) {
    return [];
  }

  const compatibleDisciplines = classData.semester.disciplines.filter(
    (discipline) =>
      discipline.dayPeriods.some((period) =>
        classData.course.periods.includes(period)
      )
  );

  if (teacherId) {
    const teacherDisciplines = compatibleDisciplines.filter((discipline) =>
      discipline.teachers.some((teacher) => teacher.id === teacherId)
    );
    return teacherDisciplines;
  }

  return compatibleDisciplines;
}
