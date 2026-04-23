import { prisma } from "../lib/prisma";
import { startOfDay, endOfDay, parseISO } from "date-fns";

import { GenericMessage } from "../types/types";
import { Appointment, Barber, GetAppointmentQuery } from "../types/admin";

import AppError from "../utils/AppError";

import redis from "../infra/cache/redisClient";
import { cache } from "../infra/cache/cacheProvider";
import { buildCacheKey } from "../infra/helpers/buildCacheKey";

class AdminService {
  async createNewBarber(name: string): Promise<GenericMessage> {
    const barberExists = await prisma.barber.findFirst({ where: { name } });

    if (barberExists) {
      throw new AppError("This barber's name is already in use", 400);
    }

    await prisma.barber.create({
      data: { name },
    });

    await cache.del("barbers:listAll");

    return {
      message: "Barber created successfully",
    };
  }

  async listAllBarbers(): Promise<Barber[]> {
    const CACHE_KEY = "admin:barbers:listAll";

    const cached = await cache.get(CACHE_KEY);

    if (cached) {
      return cached;
    }

    const barbers = await prisma.barber.findMany();

    await cache.set(CACHE_KEY, barbers, 60);

    return barbers;
  }

  async listAllAppointments({
    barberId,
    date,
    status,
  }: GetAppointmentQuery): Promise<Appointment[]> {
    const CACHE_KEY = buildCacheKey("admin:appointments:list", {
      barberId,
      date,
      status,
    });

    const cached = await cache.get(CACHE_KEY);

    if (cached) {
      return cached;
    }

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

    await cache.set(CACHE_KEY, appointments, 60);

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

    await cache.del("barbers:listAll");
    await cache.del(`barbers:${id}`);
    const keys = await redis.keys(`availability:${id}:*`);

    if (keys.length > 0) {
      await redis.del(keys);
    }

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

    await cache.del("barbers:listAll");
    await cache.del(`barbers:${id}`);
    const keys = await redis.keys(`availability:${id}:*`);

    if (keys.length > 0) {
      await redis.del(keys);
    }

    return {
      message: "Barber disabled successfully",
    };
  }
}

export default new AdminService();
