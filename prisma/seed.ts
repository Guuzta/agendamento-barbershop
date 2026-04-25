import dotenv from "dotenv";
dotenv.config();

import { prisma } from "../src/lib/prisma";
import passwordHasher from "../src/utils/Password";

import { env } from "../src/config/env";

async function createAdmin() {
  const adminExists = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (adminExists) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await passwordHasher.hash(env.adminPassword);

  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin@barbearia.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin created successfully");
}

createAdmin()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
