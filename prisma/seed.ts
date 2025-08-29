import { PrismaClient, Period, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 🔄 Limpar tabelas em ordem para evitar foreign key conflicts
  await prisma.scheduling.deleteMany();
  await prisma.discipline.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  const aluno = await prisma.user.create({
    data: {
      name: "Maria da Silva",
      email: "maria@example.com",
      roles: [Role.USER],
    },
  });

  const professor = await prisma.teacher.create({
    data: {
      name: "Carlos Souza",
    },
  });

  const cursoTI = await prisma.course.create({
    data: {
      name: "Gestão da Tecnologia da Informação",
      description: "Curso voltado para desenvolvimento de sistemas.",
      periods: [Period.EVENING],
      teachers: {
        connect: { id: professor.id },
      },
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
    include: {
      semester: {
        include: { disciplines: true },
      },
    },
  });

  const semestre1 = cursoTI.semester[0];
  const disciplinaLP = semestre1.disciplines.find(
    (d) => d.name === "Lógica de Programação"
  );

  if (disciplinaLP) {
    await prisma.scheduling.create({
      data: {
        name: "Agendamento Maria",
        phone: "11999999999",
        date: new Date("2025-09-01T10:00:00.000Z"),
        startTime: new Date("2025-09-01T10:00:00.000Z"),
        endTime: new Date("2025-09-01T10:30:00.000Z"),
        notes: "Primeira avaliação",
        userId: aluno.id,
        courseId: cursoTI.id,
        semesterId: semestre1.id,
        disciplineId: disciplinaLP.id,
      },
    });
  }

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
