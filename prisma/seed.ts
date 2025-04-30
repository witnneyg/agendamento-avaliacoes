import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function seed() {}

seed()
  .then(async () => {
    console.log("seed gerado com sucesso!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
