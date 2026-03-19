import { prisma } from "../lib/prisma";

import { BarberId, ListBarbersResponse } from "../types/barber";
import AppError from "../utils/AppError";

class BarberService {
  async listAll(): Promise<ListBarbersResponse> {
    const barbers = await prisma.barber.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return { barbers };
  }

  async getBarberById(id: BarberId) {
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
}

export default new BarberService();
