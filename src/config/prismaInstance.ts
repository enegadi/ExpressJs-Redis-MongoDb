import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

try {
  prisma = new PrismaClient();
} catch (error) {
  console.error("Error initializing Prisma:", error);
  throw error;
}

export default prisma;
