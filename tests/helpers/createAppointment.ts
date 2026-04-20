import request from "supertest";

import app from "../../src/app";

import createUser from "./createUser";
import createBarber from "./createBarber";
import createAppointmentDate from "./createAppointmentDate";

async function createAppointment(): Promise<void> {
  const { accessToken, userId } = await createUser();
  const barberId = await createBarber();
  const appointmentDate = createAppointmentDate();

  await request(app)
    .post("/appointments")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      userId,
      barberId,
      date: appointmentDate,
    });
}

export default createAppointment;
