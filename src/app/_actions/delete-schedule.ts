"use server";

import { db } from "@/lib/prisma";

export async function deleteSchedule(scheduleId: string) {
  await db.scheduling.delete({
    where: {
      id: scheduleId,
    },
  });
}
