import { cache } from "../infra/cache/cacheProvider";
import { prisma } from "../lib/prisma";
import {
  startOfDay,
  endOfDay,
  isAfter,
  parseISO,
  addHours,
  format,
} from "date-fns";

import { Barber } from "../types/barber";

import AppError from "../utils/AppError";

class BarberService {
  async listAll(): Promise<Barber[]> {
    const CACHE_KEY = "barbers:listAll";

    const cached = await cache.get(CACHE_KEY);

    if (cached) {
      return cached;
    }

    const barbers = await prisma.barber.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
    });

    await cache.set(CACHE_KEY, barbers, 60);

    return barbers;
  }

  async getBarberById(id: number): Promise<Barber> {
    const CACHE_KEY = `barbers:${id}`;

    const cached = await cache.get(CACHE_KEY);

    if (cached) {
      return cached;
    }

    const barber = await prisma.barber.findUnique({
      where: {
        id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!barber) {
      throw new AppError("Barber not found", 404);
    }

    await cache.set(CACHE_KEY, barber, 60);

    return barber;
  }

  async getBarberAvailability(
    id: number,
    dateString: string,
  ): Promise<string[]> {
    const date = parseISO(dateString);
    const startDay = startOfDay(date);
    const endDay = endOfDay(date);

    const formattedDate = format(date, "dd-MM-yyyy");
    const CACHE_KEY = `availability:${id}:${formattedDate}`;

    const cached = await cache.get(CACHE_KEY);

    if (cached) {
      return cached;
    }

    const barberExist = await prisma.barber.findUnique({
      where: { id, isActive: true },
    });

    if (!barberExist) {
      throw new AppError("Barber not found", 404);
    }

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

    await cache.set(CACHE_KEY, hours, 60);

    return hours;
  }
}

export default new BarberService();
