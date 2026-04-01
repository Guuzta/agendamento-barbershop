import { prisma } from "../lib/prisma";
import { startOfDay, endOfDay, isAfter, parseISO, addHours } from "date-fns";

import { Barber, BarberId } from "../types/barber";

import AppError from "../utils/AppError";

class BarberService {
  async listAll(): Promise<Barber[]> {
    const barbers = await prisma.barber.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return barbers;
  }

  async getBarberById(id: BarberId): Promise<Barber> {
    const barber = await prisma.barber.findUnique({
      where: id,
      select: {
        id: true,
        name: true,
      },
    });

    if (!barber) {
      throw new AppError("Barber not found", 404);
    }

    return barber;
  }

  async getBarberAvailability(
    barberId: BarberId,
    dateString: string,
  ): Promise<string[]> {
    const date = parseISO(dateString);
    const startDay = startOfDay(date);
    const endDay = endOfDay(date);

    const { id } = barberId;

    const appointments = await prisma.appointment.findMany({
      where: {
        barberId: id,
        date: {
          gte: startDay,
          lte: endDay,
        },
        status: "scheduled",
      },
      select: {
        date: true,
      },
    });

    const bookedHours = new Set(
      appointments.map((appointment) => appointment.date.getUTCHours()),
    );

    const hours = [];

    for (let hour = 9; hour <= 17; hour++) {
      const slot = addHours(startDay, hour);

      if (!bookedHours.has(hour) && isAfter(slot, new Date())) {
        hours.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    }

    return hours;
  }
}

export default new BarberService();
