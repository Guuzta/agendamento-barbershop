import request from "supertest";

import app from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Barber Routes", () => {
  const testName = "Teste";
  const testEmail = "teste2@teste.com";
  const testPassword = "Minhasenha12#";

  let token: string;
  let barberId: number;

  beforeAll(async () => {
    await request(app).post("/users/register").send({
      name: testName,
      email: testEmail,
      password: testPassword,
    });

    const response = await request(app).post("/users/login").send({
      email: testEmail,
      password: testPassword,
    });

    const barber = await prisma.barber.create({
      data: {
        name: "João",
      },
    });

    barberId = barber.id;
    token = response.body.accessToken;
  });

  afterAll(async () => {
    await prisma.barber.deleteMany({ where: { id: barberId } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  describe("GET /barbers", () => {
    it("should list all barbers", async () => {
      const res = await request(app)
        .get("/barbers")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);

      if (res.body.length > 0) {
        expect(res.body[0]).toHaveProperty("id");
        expect(res.body[0]).toHaveProperty("name");
      }
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/barbers");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const res = await request(app)
        .get("/barbers")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /barbers/:id", () => {
    it("should return a barber by id", async () => {
      const res = await request(app)
        .get(`/barbers/${barberId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
      });
    });

    it("should return 404 if barber does not exist", async () => {
      const res = await request(app)
        .get("/barbers/9999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 if ID is invalid", async () => {
      const res = await request(app)
        .get("/barbers/abc")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get(`/barbers/${barberId}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const res = await request(app)
        .get(`/barbers/${barberId}`)
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });
});
