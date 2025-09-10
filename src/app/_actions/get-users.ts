"use server";

import { db } from "@/lib/prisma";

export async function getUsers() {
  return db.user.findMany();
}
