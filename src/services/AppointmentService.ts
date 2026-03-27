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

  async getUserAppointment(
    userId: number,
    appointmentId: number,
  ): Promise<Appointment> {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    if (userId !== appointment.userId) {
      throw new AppError(
        "You are not authorized to access the appointment",
        403,
      );
    }

    return appointment;
  }

  async cancelAppointment(
    userId: number,
    appointmentId: number,
  ): Promise<GenericMessage> {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    if (userId !== appointment.userId) {
      throw new AppError(
        "You are not authorized to access the appointment",
        403,
      );
    }

    const now = new Date();

    if (appointment.date < now) {
      throw new AppError("You cannot cancel a past appointment", 400);
    }

    const diffMs = appointment.date.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 2) {
      throw new AppError("You can only cancel at least 2 hours in advance");
    }

    if (appointment.status !== "scheduled") {
      throw new AppError("Only scheduled appointments can be canceled", 400);
    }

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "canceled" },
    });

    return {
      message: "Appointment canceled successfully",
    };
  }
}

export default new AppointmentService();
