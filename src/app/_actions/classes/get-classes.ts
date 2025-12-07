"use server";

import { db } from "@/lib/prisma";

export async function getClasses() {
  return db.class.findMany({
    include: {
      course: true,
      semester: true,
    },
    orderBy: { createdAt: "desc" },
  });
}
