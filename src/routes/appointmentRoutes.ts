import { Router } from "express";

import AppointmentController from "../controllers/AppointmentController";
import requireAuth from "../middlewares/requireAuth";

const router = Router();

router.get("/", requireAuth, AppointmentController.listUserAppointments);
router.post("/", requireAuth, AppointmentController.createNewAppointment);
router.get("/:id", requireAuth, AppointmentController.getUserAppointment);
router.delete("/:id", requireAuth, AppointmentController.cancelAppointment);

export default router;
