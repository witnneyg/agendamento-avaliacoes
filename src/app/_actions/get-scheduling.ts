"use server";

import { db } from "@/lib/prisma";

export async function getScheduling() {
  return db.scheduling.findMany();
}
