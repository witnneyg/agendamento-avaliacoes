import { PrismaClient, Period, Role, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 🔄 Limpar tabelas na ordem correta para evitar conflitos de FK
  await prisma.scheduling.deleteMany();
  await prisma.discipline.deleteMany();
  await prisma.semester.deleteMany();
  await prisma.course.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  // ✅ Cria usuário (aluno)
  const aluno = await prisma.user.create({
    data: {
      name: "Maria da Silva",
      email: "maria@example.com",
      roles: [Role.USER],
    },
  });

  // ========================
  // CURSO GTI
  // ========================
  const cursoTI = await prisma.course.create({
    data: {
      name: "Gestão da Tecnologia da Informação",
      description: "Curso voltado para desenvolvimento de sistemas.",
      periods: [Period.EVENING],
    },
  });

  const semestreTI1 = await prisma.semester.create({
    data: {
      name: "1º Semestre",
      description: "Semestre introdutório",
      courseId: cursoTI.id,
    },
  });

  const semestreTI2 = await prisma.semester.create({
    data: {
      name: "2º Semestre",
      description: "Continuação do curso",
      courseId: cursoTI.id,
    },
  });

  const disciplinaLP = await prisma.discipline.create({
    data: {
      name: "Lógica de Programação",
      semesterId: semestreTI1.id,
      courses: { connect: { id: cursoTI.id } },
    },
  });

  const disciplinaMD = await prisma.discipline.create({
    data: {
      name: "Matemática Discreta",
      semesterId: semestreTI1.id,
      courses: { connect: { id: cursoTI.id } },
    },
  });

  const disciplinaED = await prisma.discipline.create({
    data: {
      name: "Estrutura de Dados",
      semesterId: semestreTI2.id,
      courses: { connect: { id: cursoTI.id } },
    },
  });

  const professorTI = await prisma.teacher.create({
    data: {
      name: "Carlos Souza",
      status: Status.ACTIVE,
      courses: { connect: { id: cursoTI.id } },
      disciplines: {
        connect: [{ id: disciplinaLP.id }, { id: disciplinaED.id }],
      },
    },
  });

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
      semesterId: semestreTI1.id,
      disciplineId: disciplinaLP.id,
    },
  });

  // ========================
  // CURSO MEDICINA
  // ========================
  const cursoMed = await prisma.course.create({
    data: {
      name: "Medicina",
      description: "Curso voltado para formação médica.",
      periods: [Period.MORNING],
    },
  });

  const semestreMed1 = await prisma.semester.create({
    data: {
      name: "1º Semestre",
      description: "Semestre introdutório",
      courseId: cursoMed.id,
    },
  });

  const semestreMed2 = await prisma.semester.create({
    data: {
      name: "2º Semestre",
      description: "Continuação do curso",
      courseId: cursoMed.id,
    },
  });

  const disciplinaAnatomia = await prisma.discipline.create({
    data: {
      name: "Anatomia Humana",
      semesterId: semestreMed1.id,
      courses: { connect: { id: cursoMed.id } },
    },
  });

  const disciplinaFisiologia = await prisma.discipline.create({
    data: {
      name: "Fisiologia",
      semesterId: semestreMed1.id,
      courses: { connect: { id: cursoMed.id } },
    },
  });

  const disciplinaBioquimica = await prisma.discipline.create({
    data: {
      name: "Bioquímica",
      semesterId: semestreMed2.id,
      courses: { connect: { id: cursoMed.id } },
    },
  });

  const professorMed = await prisma.teacher.create({
    data: {
      name: "Dr. João Pereira",
      status: Status.ACTIVE,
      courses: { connect: { id: cursoMed.id } },
      disciplines: {
        connect: [
          { id: disciplinaAnatomia.id },
          { id: disciplinaBioquimica.id },
        ],
      },
    },
  });

  await prisma.scheduling.create({
    data: {
      name: "Consulta Pedro",
      phone: "11988888888",
      date: new Date("2025-09-02T08:00:00.000Z"),
      startTime: new Date("2025-09-02T08:00:00.000Z"),
      endTime: new Date("2025-09-02T08:30:00.000Z"),
      notes: "Primeira consulta",
      userId: aluno.id,
      courseId: cursoMed.id,
      semesterId: semestreMed1.id,
      disciplineId: disciplinaAnatomia.id,
    },
  });

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
