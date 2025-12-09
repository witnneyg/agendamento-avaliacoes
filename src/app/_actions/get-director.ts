// "use server";

// import { db } from "@/lib/prisma";

// export async function getDirectors() {
//   try {
//     const directors = await db.director.findMany({
//       include: {
//         courses: true,
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });

//     console.log({ directors });

//     return directors;
//   } catch (error) {
//     console.error("Erro ao buscar diretores:", error);
//     return [];
//   }
// }
