// test-setup.ts
import { PrismaClient } from "@prisma/client";
import { beforeEach } from "node:test";

const prisma = new PrismaClient();

beforeEach(async () => {
  // Ordem específica para seu schema
  await prisma.$transaction([
    prisma.scheduling.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.verificationToken.deleteMany(),
    prisma.user.deleteMany(),
    prisma.class.deleteMany(),
    prisma.discipline.deleteMany(),
    prisma.teacher.deleteMany(),
    prisma.semester.deleteMany(),
    prisma.course.deleteMany(),
    prisma.director.deleteMany(),
    // Tabelas de permissão (se necessário)
    prisma.role.deleteMany(),
    prisma.permission.deleteMany(),
  ]);
});
