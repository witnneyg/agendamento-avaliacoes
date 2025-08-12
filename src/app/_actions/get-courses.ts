"use server";

import { db } from "@/lib/prisma";

export async function getCourses() {
  return db.course.findMany();
}
