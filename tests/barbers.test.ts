import request from "supertest";

import app from "../src/app";

import getUserToken from "./helpers/getUserToken";
import createBarber from "./helpers/createBarber";

describe("Barber Routes", () => {
  describe("GET /barbers", () => {
    it("should list all barbers", async () => {
      const accessToken = await getUserToken();
      await createBarber();

      const res = await request(app)
        .get("/barbers")
        .set("Authorization", `Bearer ${accessToken}`);

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
      const accessToken = await getUserToken();
      const barberId = await createBarber();

      const res = await request(app)
        .get(`/barbers/${barberId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toMatchObject({
        id: expect.any(Number),
        name: expect.any(String),
      });
    });

    it("should return 404 if barber does not exist", async () => {
      const accessToken = await getUserToken();

      const res = await request(app)
        .get("/barbers/9999")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 400 if ID is invalid", async () => {
      const accessToken = await getUserToken();

      const res = await request(app)
        .get("/barbers/abc")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("errors");
    });

    it("should return 401 if no token is provided", async () => {
      const barberId = await createBarber();

      const res = await request(app).get(`/barbers/${barberId}`);
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty("message");
    });

    it("should return 403 if token is invalid or expired", async () => {
      const barberId = await createBarber();

      const res = await request(app)
        .get(`/barbers/${barberId}`)
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty("message");
    });
  });
});
