import { Period, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.scheduling.deleteMany();
  await prisma.discipline.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.course.deleteMany();

  const course = await prisma.course.create({
    data: {
      name: "Engenharia de Software",
      description: "Curso voltado para desenvolvimento de sistemas.",
      periods: [Period.EVENING],
      semester: {
        create: [
          {
            name: "1º Semestre",
            description: "Semestre introdutório",
            disciplines: {
              create: [
                {
                  name: "Lógica de Programação",
                  description: "Introdução à lógica e algoritmos.",
                },
                {
                  name: "Matemática Discreta",
                  description: "Conceitos matemáticos para computação.",
                },
              ],
            },
          },
          {
            name: "2º Semestre",
            description: "Continuação do curso",
            disciplines: {
              create: [
                {
                  name: "Estrutura de Dados",
                  description:
                    "Estudo de estruturas como listas, pilhas e árvores.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  const disciplina = await prisma.discipline.findFirst({
    where: { name: "Lógica de Programação" },
  });

  if (disciplina) {
    await prisma.scheduling.create({
      data: {
        name: "João da Silva",
        email: "joao@example.com",
        phone: "11999999999",
        notes: "Interessado em agendar uma visita.",
        date: new Date("2025-08-10"),
        time: new Date("2025-08-10T14:00:00Z"),
        disciplineId: disciplina.id,
      },
    });
  }

  console.log("Seed executado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
