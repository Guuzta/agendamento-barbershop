import request from "supertest";
import { prisma } from "../../src/lib/prisma";

import app from "../../src/app";

async function createUser(): Promise<{ accessToken: string; userId: number }> {
  const name = "Test";
  const email = "testJest@email.com";
  const password = "testJest1234#";

  await request(app).post("/users/register").send({
    name,
    email,
    password,
  });

  const res = await request(app).post("/users/login").send({
    email,
    password,
  });

  const user = await prisma.user.findUnique({ where: { email } });

  return {
    accessToken: res.body.accessToken,
    userId: user!.id,
  };
}

export default createUser;
