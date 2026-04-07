import { Request, Response, NextFunction } from "express";

import { Barber, GetBarberParams, GetBarberQuery } from "../types/barber";

import { AuthenticatedRequest } from "../types/jwt";

import barberService from "../services/BarberService";

import AppError from "../utils/AppError";

class BarberController {
  async listAll(req: Request, res: Response<Barber[]>, next: NextFunction) {
    try {
      const barbers = await barberService.listAll();

      res.status(200).json(barbers);
    } catch (error) {
      next(error);
    }
  }

  async getBarberById(
    req: AuthenticatedRequest<GetBarberParams>,
    res: Response<Barber>,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const barber = await barberService.getBarberById(id);

      res.status(200).json(barber);
    } catch (error) {
      next(error);
    }
  }

  async getBarberAvailability(
    req: AuthenticatedRequest<GetBarberParams, {}, {}, GetBarberQuery>,
    res: Response<string[]>,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const { date } = req.query;

      if (!date || typeof date !== "string") {
        throw new AppError("Date is required", 400);
      }

      const availableHours = await barberService.getBarberAvailability(
        id,
        date,
      );

      res.status(200).json(availableHours);
    } catch (error) {
      next(error);
    }
  }
}

export default new BarberController();
