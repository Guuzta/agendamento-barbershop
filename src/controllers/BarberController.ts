import { Request, Response, NextFunction } from "express";

import { ListBarbersResponse } from "../types/barber";

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
}

export default new BarberController();
