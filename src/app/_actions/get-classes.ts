// app/_actions/get-classes.ts
"use server";

import { db } from "@/lib/prisma";

export async function getClasses() {
  return db.class.findMany({
    include: {
      course: true,
      semester: true,
      disciplines: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
