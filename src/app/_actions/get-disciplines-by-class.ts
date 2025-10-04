"use server";

import { db } from "@/lib/prisma";

export async function getDisciplinesByClass(classId: string) {
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
          },
        },
      },
    },
  });

  const compatibleDisciplines = classData?.semester.disciplines.filter(
    (discipline) =>
      discipline.dayPeriods.some((period) =>
        classData.course.periods.includes(period)
      )
  );

  return compatibleDisciplines || [];
}
