import { Router } from "express";

import BarberController from "../controllers/BarberController";
import requireAuth from "../middlewares/requireAuth";
import validateParams from "../middlewares/validateParams";

import paramsSchema from "../schemas/paramsSchema";

const router = Router();

router.get(
    "/", 
    requireAuth, 
    BarberController.listAll
);

router.get(
  "/:id",
  requireAuth,
  validateParams(paramsSchema),
  BarberController.getBarberById,
);

router.get(
  "/:id/availability",
  requireAuth,
  validateParams(paramsSchema),
  BarberController.getBarberAvailability,
);

export default router;
