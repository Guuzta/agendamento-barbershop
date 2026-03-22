import { Request, Response, NextFunction } from "express";

import {
  Appointment,
  AppointmentBody,
  GetAppointmentParams,
} from "../types/appointment";

import appointmentService from "../services/AppointmentService";
import { GenericMessage } from "../types/types";

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
