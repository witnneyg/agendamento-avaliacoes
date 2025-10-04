// _actions/get-discipline-by-id.ts
"use server";

import { db } from "@/lib/prisma";

export async function getDisciplineById(disciplineId: string) {
  try {
    const discipline = await db.discipline.findUnique({
      where: { id: disciplineId },
      select: {
        id: true,
        name: true,
        dayPeriods: true,
        semesterId: true,
        status: true,
      },
    });

    return discipline;
  } catch (error) {
    console.error("Error fetching discipline:", error);
    return null;
  }
}
