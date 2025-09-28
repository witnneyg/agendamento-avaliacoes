"use server";

import { db } from "@/lib/prisma";

export async function getScheduling() {
  const schedulings = await db.scheduling.findMany({
    include: {
      course: true,
      semester: true,
      discipline: true,
      user: true,
      class: true,
    },
  });

  console.log({ schedulings });
  return schedulings;
}
