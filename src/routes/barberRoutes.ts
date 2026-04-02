import { Router } from "express";

import BarberController from "../controllers/BarberController";
import requireAuth from "../middlewares/requireAuth";

const router = Router();

router.get("/", requireAuth, BarberController.listAll);
router.get("/:id", requireAuth, BarberController.getBarberById);
router.get("/:id/availability", requireAuth, BarberController.getBarberAvailability);

export default router;
