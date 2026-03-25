import { Request, Response, NextFunction } from "express";

import {
  Appointment,
  AppointmentBody,
  GetAppointmentParams,
} from "../types/appointment";
import { GenericMessage } from "../types/types";

import appointmentService from "../services/AppointmentService";

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

  async getUserAppointment(
    req: Request<GetAppointmentParams>,
    res: Response<Appointment>,
    next: NextFunction,
  ) {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      const { userId } = req;

      const appointmentId = Number(req.params.id);

      const appointment = await appointmentService.getUserAppointment(
        userId,
        appointmentId,
      );

      res.status(200).json(appointment);
    } catch (error) {
      next(error);
    }
  }
}

export default new AppointmentController();
