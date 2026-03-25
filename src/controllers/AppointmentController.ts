import { Request, Response, NextFunction } from "express";

import { Appointment, AppointmentBody } from "../types/appointment";

import appointmentService from "../services/AppointmentService";
import { GenericMessage } from "../types/types";

import AppError from "../utils/AppError";

class AppointmentController {
  async listUserAppointments(
    req: Request,
    res: Response<Appointment[]>,
    next: NextFunction,
  ) {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      const { userId } = req;

      const appointments =
        await appointmentService.listUserAppointments(userId);

      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async createNewAppointment(
    req: Request<{}, {}, AppointmentBody>,
    res: Response<GenericMessage>,
    next: NextFunction,
  ) {
    try {
      const { userId, barberId, date } = req.body;

      const newAppointment = { userId, barberId, date };

      const message =
        await appointmentService.createNewAppointment(newAppointment);

      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default new AppointmentController();
