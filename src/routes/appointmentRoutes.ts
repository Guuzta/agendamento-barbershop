import { Router } from "express";

import AppointmentController from "../controllers/AppointmentController";
import requireAuth from "../middlewares/requireAuth";

const router = Router();

router.get("/", requireAuth, AppointmentController.listUserAppointments);
router.post("/", AppointmentController.createNewAppointment);

export default router;
