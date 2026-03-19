import { prisma } from "../lib/prisma";

import { ListBarbersResponse } from "../types/barber";

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
}

export default new BarberService();
