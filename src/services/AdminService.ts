import { prisma } from "../lib/prisma";
import { startOfDay, endOfDay, parseISO } from "date-fns";

import { GenericMessage } from "../types/types";
import { Appointment, Barber, GetAppointmentQuery } from "../types/admin";

import AppError from "../utils/AppError";

class AdminService {
  async createNewBarber(name: string): Promise<GenericMessage> {
    const barberExists = await prisma.barber.findFirst({ where: { name } });

    if (barberExists) {
      throw new AppError("This barber's name is already in use", 400);
    }

    await prisma.barber.create({
      data: { name },
    });

    return {
      message: "Barber created successfully",
    };
  }

  async listAllBarbers(): Promise<Barber[]> {
    const barbers = await prisma.barber.findMany();

    return barbers;
  }

  async listAllAppointments({
    barberId,
    date,
    status,
  }: GetAppointmentQuery): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
      where: {
        ...(barberId && { barberId }),
        ...(status && { status }),
        ...(date && {
          date: {
            gte: startOfDay(parseISO(date)),
            lt: endOfDay(parseISO(date)),
          },
        }),
      },
    });

    return appointments;
  }

  async updateBarber(id: number, name: string): Promise<GenericMessage> {
    const barberExists = await prisma.barber.findUnique({ where: { id } });

    if (!barberExists) {
      throw new AppError("Barber not found", 404);
    }

    await prisma.barber.update({
      where: { id },
      data: { name },
    });

    return {
      message: "Barber updated successfully",
    };
  }

  async disableBarber(id: number): Promise<GenericMessage> {
    const barberExists = await prisma.barber.findUnique({ where: { id } });

    if (!barberExists) {
      throw new AppError("Barber not found", 404);
    }

    if (!barberExists.isActive) {
      throw new AppError("Barber already disabled", 409);
    }

    await prisma.barber.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    return {
      message: "Barber disabled successfully",
    };
  }
}

export default new AdminService();
