import dotenv from "dotenv";
import { execSync } from "child_process";
import { prisma } from "./src/lib/prisma";

dotenv.config({ path: ".env" });

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.$transaction([
    prisma.appointment.deleteMany(),
    prisma.barber.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
