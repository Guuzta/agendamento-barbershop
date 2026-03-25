import { prisma } from "../lib/prisma";

import { Appointment, AppointmentBody } from "../types/appointment";
import { GenericMessage } from "../types/types";

import AppError from "../utils/AppError";

class AppointmentService {
  async listUserAppointments(userId: number): Promise<Appointment[]> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const appointments = await prisma.appointment.findMany({
      where: { userId },
    });

    return appointments;
  }

  async createNewAppointment(
    newAppointment: AppointmentBody,
  ): Promise<GenericMessage> {
    const now = new Date();
    const requestedDate = new Date(newAppointment.date);

    if (requestedDate < now) {
      throw new AppError("Cannot schedule in the past", 400);
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId: newAppointment.barberId,
        date: newAppointment.date,
      },
    });

    if (existingAppointment) {
      throw new AppError("This time is already booked", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: newAppointment.userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const barber = await prisma.barber.findUnique({
      where: { id: newAppointment.barberId },
    });

    if (!barber) {
      throw new AppError("Barber not found", 404);
    }

    await prisma.appointment.create({
      data: newAppointment,
    });

    return {
      message: "Appointment created successfully",
    };
  }
}

export default new AppointmentService();
