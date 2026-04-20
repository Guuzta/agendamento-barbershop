import request from "supertest";
import app from "../../src/app";

async function getUserToken(): Promise<string> {
  const testName = "Teste";
  const testEmail = "teste4@teste.com";
  const testPassword = "Minhasenha12#";

  await request(app).post("/users/register").send({
    name: testName,
    email: testEmail,
    password: testPassword,
  });

  const res = await request(app).post("/users/login").send({
    email: testEmail,
    password: testPassword,
  });

  return res.body.accessToken;
}

export default getUserToken;
