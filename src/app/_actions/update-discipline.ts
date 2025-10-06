// app/_actions/update-discipline.ts
"use server";

import { db } from "@/lib/prisma";
import { Period } from "@prisma/client";

interface UpdateDisciplineData {
  id: string;
  name: string;
  courseId: string;
  semesterId: string;
  dayPeriods: Period[];
}

export async function updateDiscipline(data: UpdateDisciplineData) {
  try {
    // Verificar se a disciplina existe
    const existingDiscipline = await db.discipline.findUnique({
      where: { id: data.id },
      include: {
        courses: true,
      },
    });

    if (!existingDiscipline) {
      throw new Error("Disciplina não encontrada");
    }

    // Atualizar a disciplina
    const updatedDiscipline = await db.discipline.update({
      where: { id: data.id },
      data: {
        name: data.name,
        semesterId: data.semesterId,
        dayPeriods: data.dayPeriods,
        // Atualizar a relação com cursos
        courses: {
          set: [], // Remove todos os cursos atuais
          connect: [{ id: data.courseId }], // Conecta o novo curso
        },
      },
      include: {
        courses: true,
        semester: true,
      },
    });

    return updatedDiscipline;
  } catch (error) {
    console.error("Erro ao atualizar disciplina:", error);
    throw new Error("Erro ao atualizar disciplina");
  }
}
