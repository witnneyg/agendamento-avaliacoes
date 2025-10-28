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
  return db.teacher.update({
    where: { id: data.id },
    data: {
      name: data.name,
      status: data.status,
      courses: {
        set: [], // LIMPA os cursos existentes
        connect: data.courseIds.map((courseId) => ({ id: courseId })), // CONECTA os novos cursos
      },
      disciplines: {
        set: [], // LIMPA as disciplinas existentes
        connect: data.disciplineIds.map((disciplineId) => ({
          id: disciplineId,
        })), // CONECTA as novas disciplinas
      },
    },
    include: {
      courses: true,
      disciplines: true,
    },
  });
}
