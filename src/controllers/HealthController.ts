import { Request, Response } from "express";

class HealthController {
  async index(req: Request, res: Response): Promise<void> {
    res.json({
      status: "ok",
    });
  }
}

export default new HealthController();
