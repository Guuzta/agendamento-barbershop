import { Request, Response, NextFunction } from "express";

import { RegisterBarberBody } from "../types/admin";
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
}

export default new AdminController();
