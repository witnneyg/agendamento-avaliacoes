import { Period, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.scheduling.deleteMany();
  await prisma.discipline.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.course.deleteMany();

  await prisma.course.create({
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

  await prisma.course.create({
    data: {
      name: "Medicina",
      description:
        "Curso focado na formação de profissionais da área da saúde.",
      periods: [Period.MORNING, Period.AFTERNOON],
      semester: {
        create: [
          {
            name: "1º Semestre",
            description: "Base para as ciências médicas.",
            disciplines: {
              create: [
                {
                  name: "Anatomia Humana",
                  description: "Estudo da estrutura do corpo humano.",
                },
                {
                  name: "Bioquímica",
                  description: "Processos químicos dos seres vivos.",
                },
              ],
            },
          },
          {
            name: "2º Semestre",
            description: "Introdução à prática médica.",
            disciplines: {
              create: [
                {
                  name: "Fisiologia",
                  description: "Funcionamento dos órgãos e sistemas.",
                },
                {
                  name: "Histologia",
                  description: "Estudo dos tecidos biológicos.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  const disciplinaTI = await prisma.discipline.findFirst({
    where: { name: "Lógica de Programação" },
  });
  const disciplinaMedicina = await prisma.discipline.findFirst({
    where: { name: "Anatomia Humana" },
  });

  if (disciplinaTI) {
    await prisma.scheduling.create({
      data: {
        name: "João da Silva",
        email: "joao@example.com",
        phone: "11999999999",
        notes: "Interessado em agendar uma avaliação",
        date: new Date("2025-08-10"),
        time: new Date("2025-08-10T14:00:00Z"),
        disciplineId: disciplinaTI.id,
      },
    });
  }

  if (disciplinaMedicina) {
    await prisma.scheduling.create({
      data: {
        name: "Pedro da Silva",
        email: "pedro@example.com",
        phone: "11999999999",
        notes: "Interessado em agendar uma avaliação",
        date: new Date("2025-08-10"),
        time: new Date("2025-08-10T14:00:00Z"),
        disciplineId: disciplinaMedicina.id,
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
