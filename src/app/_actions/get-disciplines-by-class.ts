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
              // Filtro por professor se teacherId for fornecido
              ...(teacherId && {
                teachers: {
                  some: {
                    id: teacherId,
                    status: "ACTIVE",
                  },
                },
              }),
            },
            include: {
              // Incluir informações dos professores para mostrar no componente
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

  const compatibleDisciplines = classData?.semester.disciplines.filter(
    (discipline) =>
      discipline.dayPeriods.some((period) =>
        classData.course.periods.includes(period)
      )
  );

  return compatibleDisciplines || [];
}
