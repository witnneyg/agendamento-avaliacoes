"use server";

import { db } from "@/lib/prisma";

export async function getUsers() {
  try {
    const [users, teachers] = await Promise.all([
      db.user.findMany({
        include: {
          roles: {
            include: {
              permissions: true,
            },
          },
        },
      }),
      db.teacher.findMany(),
    ]);

    const usersWithTeachers = users.map((user) => {
      const teacher = teachers.find(
        (teacher) =>
          teacher.name === user.name ||
          teacher.name?.toLowerCase() === user.name?.toLowerCase()
      );

      return {
        ...user,
        teacher: teacher || null,
      };
    });

    return usersWithTeachers;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}
