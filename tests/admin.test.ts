import request from "supertest";

import app from "../src/app";
import { prisma } from "../src/lib/prisma";

import createAdmin from "./helpers/createAdmin";
import createBarber from "./helpers/createBarber";
import getUserToken from "./helpers/getUserToken";
import createAppointment from "./helpers/createAppointment";

describe("Admin Routes", () => {
  describe("POST /barbers", () => {
    it("should allow admin to create barber", async () => {
      const adminToken = await createAdmin();

      const res = await request(app)
        .post("/admin/barbers")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ name: "Barber" });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 if name is missing", async () => {
      const accessToken = await createAdmin();

      const res = await request(app)
        .post("/admin/barbers")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ name: "" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).post("/admin/barbers");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when user is not admin", async () => {
      const accessToken = await getUserToken();

      const res = await request(app)
        .post("/admin/barbers")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ name: "Barber" });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /barbers", () => {
    it("should return a list of barbers", async () => {
      const adminToken = await createAdmin();
      await createBarber();

      const res = await request(app)
        .get("/admin/barbers")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);

      const appointment = res.body[0];

      expect(res.body).toHaveLength(1);
      expect(appointment).toHaveProperty("id");
      expect(appointment).toHaveProperty("name");
      expect(appointment).toHaveProperty("createdAt");
      expect(appointment).toHaveProperty("updatedAt");
      expect(appointment).toHaveProperty("isActive");
    });

    it("should return empty list when no barber exist", async () => {
      const adminToken = await createAdmin();

      await prisma.barber.deleteMany();

      const res = await request(app)
        .get("/admin/barbers")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);

      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/admin/barbers");

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when user is not admin", async () => {
      const accessToken = await getUserToken();

      const res = await request(app)
        .get("/admin/barbers")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("GET /appointments", () => {
    it("should return a list of all appointments", async () => {
      const adminToken = await createAdmin();

      await createAppointment();

      const res = await request(app)
        .get("/admin/appointments")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(1);

      const appointment = res.body[0];

      expect(appointment).toHaveProperty("id");
      expect(appointment).toHaveProperty("userId");
      expect(appointment).toHaveProperty("barberId");
      expect(appointment).toHaveProperty("date");
      expect(appointment).toHaveProperty("status");
      expect(appointment).toHaveProperty("createdAt");
    });

    it("should return empty list when no appointments exist", async () => {
      const adminToken = await createAdmin();

      const res = await request(app)
        .get("/admin/appointments")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should return 401 if no token is provided", async () => {
      const res = await request(app).get("/admin/appointments");
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when user is not admin", async () => {
      const accessToken = await getUserToken();

      const res = await request(app)
        .get("/admin/appointments")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ name: "Barber" });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("PUT /barbers", () => {
    it("should update a barber", async () => {
      const adminToken = await createAdmin();
      const barberId = await createBarber();

      const res = await request(app)
        .put(`/admin/barbers/${barberId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "NewName",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");

      const barber = await prisma.barber.findUnique({
        where: { id: barberId },
      });

      expect(barber?.name).toBe("NewName");
    });

    it("should return 404 if barber does not exist", async () => {
      const adminToken = await createAdmin();

      const res = await request(app)
        .put("/admin/barbers/9999")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "NewName",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 if ID is invalid", async () => {
      const adminToken = await createAdmin();

      const res = await request(app)
        .put("/admin/barbers/abc")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "NewName",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should 400 if name is missing", async () => {
      const adminToken = await createAdmin();
      const barberId = await createBarber();

      const res = await request(app)
        .put(`/admin/barbers/${barberId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 401 if no token is provided", async () => {
      const barberId = await createBarber();

      const res = await request(app).put(`/admin/barbers/${barberId}`);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when user is not admin", async () => {
      const accessToken = await getUserToken();
      const barberId = await createBarber();

      const res = await request(app)
        .put(`/admin/barbers/${barberId}`)
        .set("Authorization", `Bearer ${accessToken}`)
        .send({ name: "Barber" });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("DELETE /barbers", () => {
    it("should disable barber", async () => {
      const adminToken = await createAdmin();
      const barberId = await createBarber();

      const res = await request(app)
        .delete(`/admin/barbers/${barberId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message");

      const barber = await prisma.barber.findUnique({
        where: { id: barberId },
      });

      expect(barber?.isActive).toBe(false);
    });

    it("should return 404 if barber does not exist", async () => {
      const adminToken = await createAdmin();

      const res = await request(app)
        .delete("/admin/barbers/9999")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 if ID is invalid", async () => {
      const adminToken = await createAdmin();

      const res = await request(app)
        .delete("/admin/barbers/abc")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 409 when trying to disable a barber that is already disabled", async () => {
      const adminToken = await createAdmin();
      const barberId = await createBarber();

      await request(app)
        .delete(`/admin/barbers/${barberId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      const res = await request(app)
        .delete(`/admin/barbers/${barberId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 401 if no token is provided", async () => {
      const barberId = await createBarber();

      const res = await request(app).delete(`/admin/barbers/${barberId}`);

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 when user is not admin", async () => {
      const accessToken = await getUserToken();
      const barberId = await createBarber();

      const res = await request(app)
        .delete(`/admin/barbers/${barberId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });
});
