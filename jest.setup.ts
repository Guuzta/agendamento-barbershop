import dotenv from "dotenv";
import { execSync } from "child_process";
import { prisma } from "./src/lib/prisma";

dotenv.config({ path: ".env" });

beforeEach(() => {});

afterAll(async () => {
  await prisma.$disconnect();
});
