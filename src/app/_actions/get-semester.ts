"use server";

import { db } from "@/lib/prisma";

export async function getSemesters() {
  return db.semester.findMany();
}
