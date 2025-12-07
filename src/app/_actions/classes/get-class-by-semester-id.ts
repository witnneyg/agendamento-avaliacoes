"use server";

import { db } from "@/lib/prisma";

export async function getClassBySemesterId(semesterId: string) {
  return db.class.findMany({
    where: {
      semesterId,
    },
  });
}
