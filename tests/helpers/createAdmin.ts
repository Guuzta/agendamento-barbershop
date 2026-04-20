import request from "supertest";
import bcrypt from "bcrypt";

import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";

async function createAdmin(): Promise<string> {
  const name = "adminTest";
  const email = "adminTest@email.com";
  const password = "adminBarber2#";

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const res = await request(app).post("/users/login").send({
    email,
    password,
  });

  return res.body.accessToken;
}

export default createAdmin;
