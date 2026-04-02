import { Response, NextFunction } from "express";

import {
  Appointment,
  GetAppointmentQuery,
  GetBarberParams,
  UpdateBarberBody,
  RegisterBarberBody,
} from "../types/admin";

import { Barber } from "../types/admin";
import { GenericMessage } from "../types/types";

import adminService from "../services/AdminService";
import { AuthenticatedRequest } from "../types/jwt";

class AdminController {
  async createNewBarber(
    req: AuthenticatedRequest<{}, {}, RegisterBarberBody>,
    res: Response<GenericMessage>,
    next: NextFunction,
  ) {
    try {
      const { name } = req.body;

      const message = await adminService.createNewBarber(name);

      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  }

  async listAllBarbers(
    req: AuthenticatedRequest,
    res: Response<Barber[]>,
    next: NextFunction,
  ) {
    try {
      const barbers = await adminService.listAllBarbers();

      res.status(200).json(barbers);
    } catch (error) {
      next(error);
    }
  }

  async listAllAppointments(
    req: AuthenticatedRequest<{}, {}, {}, GetAppointmentQuery>,
    res: Response<Appointment[]>,
    next: NextFunction,
  ) {
    try {
      const barberId = req.query.barberId
        ? Number(req.query.barberId)
        : req.query.barberId;

      const { date, status } = req.query;

      const appointments = await adminService.listAllAppointments({
        barberId,
        date,
        status,
      });

      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async updateBarber(
    req: AuthenticatedRequest<GetBarberParams, {}, UpdateBarberBody>,
    res: Response<GenericMessage>,
    next: NextFunction,
  ) {
    try {
      const id = Number(req.params.id);
      const { name } = req.body;

      const message = await adminService.updateBarber(id, name);

      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }

  async disableBarber(
    req: AuthenticatedRequest<GetBarberParams>,
    res: Response<GenericMessage>,
    next: NextFunction,
  ) {
    try {
      const id = Number(req.params.id);

      const message = await adminService.disableBarber(id);

      res.status(200).json(message);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
