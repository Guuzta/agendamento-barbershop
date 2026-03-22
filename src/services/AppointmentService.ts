import { prisma } from "../lib/prisma";

import { UserId, Appointment } from "../types/appointment";

import AppError from "../utils/AppError";

class AppointmentService {
  async listUserAppointments(userId: UserId): Promise<Appointment[]> {
    const user = await prisma.user.findUnique({ where: { id: userId.userId } });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const appointments = await prisma.appointment.findMany({ where: userId });

    return appointments;
  }
}

export default new AppointmentService();
