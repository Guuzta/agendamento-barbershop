import request from "supertest";
import { addDays, setHours, setMinutes } from "date-fns";

import app from "../src/app";
import { prisma } from "../src/lib/prisma";

function generateAppointmentDateUTC(): string {
  let date = addDays(new Date(), 1);

  const startHour = 9;
  const endHour = 17;

  const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;

  date = setHours(date, hour);
  date = setMinutes(date, 0);

  return date.toISOString();
}

describe("Appointment Routes", () => {
  const testName = "Teste";
  const testEmail = "teste3@teste.com";
  const testPassword = "Minhasenha12#";

  let token: string;
  let barberId: number;
  let userId: number;

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
        name: "Marcos",
      },
    });

    const user = await prisma.user.findUnique({
      where: { email: testEmail },
    });

    userId = user!.id;
    barberId = barber.id;
    token = response.body.accessToken;
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await prisma.appointment.deleteMany();
  });

  afterAll(async () => {
    await prisma.barber.deleteMany({ where: { id: barberId } });
    await prisma.user.deleteMany({ where: { email: testEmail } });
  });

  describe("GET /appointments", () => {
    it("should return a list of user appointments", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const res = await request(app)
        .get("/appointments")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);

      const appointment = res.body[0];

      expect(appointment).toHaveProperty("id");
      expect(appointment).toHaveProperty("userId");
      expect(appointment).toHaveProperty("barberId");
      expect(appointment).toHaveProperty("date");
      expect(appointment).toHaveProperty("createdAt");
    });

    it("should return empty list when no user appointments exist", async () => {
      const res = await request(app)
        .get("/appointments")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/appointments");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const res = await request(app)
        .get("/appointments")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("POST /appointments", () => {
    it("should create an appointment", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when the appointment date is in the past", async () => {
      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: "2026-04-08T10:00:00.000Z",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 409 when the barber already has an appointment at the same time", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 404 if userId does not exist", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: 9999,
          barberId,
          date: appointmentDate,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 404 if barberId does not exist", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId: 9999,
          date: appointmentDate,
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when userId is invalid", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId: "invalidUserId",
          barberId: 9999,
          date: appointmentDate,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when barberId is invalid", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId: "invalidBarberId",
          date: appointmentDate,
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when date is invalid", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: "invalidDate",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 400 when outside the barber's working hours", async () => {
      const res = await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: "2026-04-13T22:00:00Z",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).post("/appointments");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const res = await request(app)
        .post("/appointments")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /appointments/:id", () => {
    it("should return a user's appointment", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const appointmentRequest = await prisma.appointment.findFirst({
        where: { userId },
      });

      const appointmentId = appointmentRequest!.id;

      const res = await request(app)
        .get(`/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);

      const appointment = res.body;

      expect(appointment).toHaveProperty("id");
      expect(appointment).toHaveProperty("userId");
      expect(appointment).toHaveProperty("barberId");
      expect(appointment).toHaveProperty("date");
      expect(appointment).toHaveProperty("createdAt");
    });

    it("should return 404 if appointment does not exist", async () => {
      const res = await request(app)
        .get("/appointments/9999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 if ID is invalid", async () => {
      const res = await request(app)
        .get("/appointments/abc")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 403 when user tries to access another user's appointment", async () => {
      const otherUserName = "otherUser";
      const otherUserEmail = "otherUser@test.com";
      const otherUserPassword = "otherPassword12#";

      await request(app).post("/users/register").send({
        name: otherUserName,
        email: otherUserEmail,
        password: otherUserPassword,
      });

      const response = await request(app).post("/users/login").send({
        email: otherUserEmail,
        password: otherUserPassword,
      });

      const userRequest = await prisma.user.findUnique({
        where: { email: otherUserEmail },
      });

      const otherUserToken = response.body.accessToken;
      const otherUserId = userRequest!.id;
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send({
          userId: otherUserId,
          barberId,
          date: appointmentDate,
        });

      const appointmentRequest = await prisma.appointment.findFirst({
        where: { userId: otherUserId },
      });

      const appointmentId = appointmentRequest!.id;

      const res = await request(app)
        .get(`/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if no token is provided", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const appointment = await prisma.appointment.findFirst({
        where: { userId },
      });

      const appointmentId = appointment!.id;

      const res = await request(app).get(`/appointments/${appointmentId}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const appointment = await prisma.appointment.findFirst({
        where: { userId },
      });

      const appointmentId = appointment!.id;

      const res = await request(app)
        .get(`/appointments/${appointmentId}`)
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("DELETE /appointments/:id", () => {
    it("should cancel an appointment", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const appointmentRequest = await prisma.appointment.findFirst({
        where: { userId },
      });

      const appointmentId = appointmentRequest!.id;

      const res = await request(app)
        .delete(`/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 404 if appointment does not exist", async () => {
      const res = await request(app)
        .delete("/appointments/9999")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when user tries to cancel another user's appointment", async () => {
      const otherUserName = "otherUser";
      const otherUserEmail = "otherUser@test.com";
      const otherUserPassword = "otherPassword12#";

      await request(app).post("/users/register").send({
        name: otherUserName,
        email: otherUserEmail,
        password: otherUserPassword,
      });

      const response = await request(app).post("/users/login").send({
        email: otherUserEmail,
        password: otherUserPassword,
      });

      const userRequest = await prisma.user.findUnique({
        where: { email: otherUserEmail },
      });

      const otherUserToken = response.body.accessToken;
      const otherUserId = userRequest!.id;
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${otherUserToken}`)
        .send({
          userId: otherUserId,
          barberId,
          date: appointmentDate,
        });

      const appointmentRequest = await prisma.appointment.findFirst({
        where: { userId: otherUserId },
      });

      const appointmentId = appointmentRequest!.id;

      const res = await request(app)
        .delete(`/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when trying to cancel a past appointment", async () => {
      const pastDate = new Date("2026-01-01T13:00:00Z");

      const appointmentRequest = await prisma.appointment.create({
        data: {
          userId,
          barberId,
          date: pastDate,
        },
      });

      const appointmentId = appointmentRequest.id;

      const res = await request(app)
        .delete(`/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 when trying to cancel an appointment that is not scheduled", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      const appointmentRequest = await prisma.appointment.create({
        data: {
          userId,
          barberId,
          status: "completed",
          date: appointmentDate,
        },
      });

      const appointmentId = appointmentRequest.id;

      const res = await request(app)
        .delete(`/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if no token is provided", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const appointment = await prisma.appointment.findFirst({
        where: { userId },
      });

      const appointmentId = appointment!.id;

      const res = await request(app).delete(`/appointments/${appointmentId}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const appointmentDate = generateAppointmentDateUTC();

      await request(app)
        .post("/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          userId,
          barberId,
          date: appointmentDate,
        });

      const appointment = await prisma.appointment.findFirst({
        where: { userId },
      });

      const appointmentId = appointment!.id;

      const res = await request(app)
        .delete(`/appointments/${appointmentId}`)
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });
});
