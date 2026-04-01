import { Request, Response, NextFunction } from "express";

import { RegisterBarberBody } from "../types/admin";
import { Barber } from "../types/admin";
import { GenericMessage } from "../types/types";

import adminService from "../services/AdminService";

class AdminController {
  async createNewBarber(
    req: Request<{}, {}, RegisterBarberBody>,
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
    req: Request,
    res: Response<Barber[]>,
    next: NextFunction,
  ) {
    try {
      const barbers = await adminService.listAllBarbers();

      res.status(201).json(barbers);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
