import { Request, Response, NextFunction } from "express";

import {
  Barber,
  GetBarberParams,
  ListBarbersResponse,
  BarberId,
} from "../types/barber";

import barberService from "../services/BarberService";

class BarberController {
  async listAll(
    req: Request,
    res: Response<ListBarbersResponse>,
    next: NextFunction,
  ) {
    try {
      const barbers = await barberService.listAll();

      res.status(200).json(barbers);
    } catch (error) {
      next(error);
    }
  }

  async getBarberById(
    req: Request<GetBarberParams>,
    res: Response<Barber>,
    next: NextFunction,
  ) {
    try {
      const id: BarberId = {
        id: Number(req.params.id),
      };

      const barber = await barberService.getBarberById(id);

      res.status(200).json(barber);
    } catch (error) {
      next(error);
    }
  }
}

export default new BarberController();
