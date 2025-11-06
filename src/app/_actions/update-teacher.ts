"use server";

import { db } from "@/lib/prisma";
import { Teacher, Course, Discipline, Status } from "@prisma/client";

interface UpdateTeacherInput {
  id: string;
  name: string;
  courseIds: string[];
  disciplineIds: string[];
  status: Status;
}

export type TeacherWithRelations = Teacher & {
  courses: Course[];
  disciplines: Discipline[];
};

export async function updateTeacher(
  data: UpdateTeacherInput
): Promise<TeacherWithRelations> {
  if (data.status === "INACTIVE") {
    return db.teacher.update({
      where: { id: data.id },
      data: {
        name: data.name,
        status: data.status,
        courses: {
          set: [],
        },
        disciplines: {
          set: [],
        },
      },
      include: {
        courses: true,
        disciplines: true,
      },
    });
  }

  return db.teacher.update({
    where: { id: data.id },
    data: {
      name: data.name,
      status: data.status,
      courses: {
        set: data.courseIds.map((courseId) => ({ id: courseId })),
      },
      disciplines: {
        set: data.disciplineIds.map((disciplineId) => ({
          id: disciplineId,
        })),
      },
    },
    include: {
      courses: true,
      disciplines: true,
    },
  });
}
