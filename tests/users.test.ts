import request from "supertest";
import bcrypt from "bcrypt";

import app from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Users Routes", () => {
  const testName = "teste";
  const testEmail = "teste1@teste.com";
  const testPassword = "Minhasenha12#";

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  describe("POST /users/register", () => {
    it("should register a user", async () => {
      const res = await request(app).post("/users/register").send({
        name: testName,
        email: testEmail,
        password: testPassword,
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        name: testName,
        email: testEmail,
      });
    });

    it("should fail if email is missing", async () => {
      const res = await request(app).post("/users/register").send({
        name: testName,
        password: testPassword,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should fail if password is missing", async () => {
      const res = await request(app).post("/users/register").send({
        name: testName,
        email: testEmail,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should fail if password is weak", async () => {
      const res = await request(app).post("/users/register").send({
        name: testName,
        email: testEmail,
        password: "weak",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should fail if email is invalid", async () => {
      const res = await request(app).post("/users/register").send({
        name: testName,
        email: "Invalidemail.com",
        password: testPassword,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should not allow registering with an email that already exists", async () => {
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      await prisma.user.create({
        data: {
          name: testName,
          email: testEmail,
          password: hashedPassword,
        },
      });

      const res = await request(app).post("/users/register").send({
        name: testName,
        email: testEmail,
        password: testPassword,
      });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /users/login", () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      await prisma.user.create({
        data: {
          name: testName,
          email: testEmail,
          password: hashedPassword,
        },
      });
    });

    it("should login a user", async () => {
      const res = await request(app).post("/users/login").send({
        email: testEmail,
        password: testPassword,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    });

    it("should not allow login when the email does not exist", async () => {
      const res = await request(app).post("/users/login").send({
        email: "InvalidEmail@test.com",
        password: testPassword,
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should not allow login when the password is incorrect", async () => {
      const res = await request(app).post("/users/login").send({
        email: testEmail,
        password: "IncorrectPassword1234#",
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should not allow login when the required fields are missing", async () => {
      const res = await request(app).post("/users/login").send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });
  });
});
