import { Request, Response, NextFunction } from "express";

import { Appointment, GetAppointmentParams } from "../types/appointment";

import appointmentService from "../services/AppointmentService";

class AppointmentController {
  async listUserAppointments(
    req: Request<GetAppointmentParams>,
    res: Response<Appointment[]>,
    next: NextFunction,
  ) {
    try {
      const userId = {
        userId: Number(req.params.id),
      };

      const appointments =
        await appointmentService.listUserAppointments(userId);

      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }
}

export default new AppointmentController();
