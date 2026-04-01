import { prisma } from "../lib/prisma";

import { GenericMessage } from "../types/types";
import { Barber } from "../types/admin";

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
}

export default new AdminService();
