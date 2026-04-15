import request from "supertest";
import { prisma } from "../../src/lib/prisma";

import app from "../../src/app";

async function createUser(
  name: string,
  email: string,
  password: string,
): Promise<{ accessToken: string; userId: number }> {
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
