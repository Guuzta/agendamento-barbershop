import { Router } from "express";

import AppointmentController from "../controllers/AppointmentController";

const router = Router();

router.get("/:id", AppointmentController.listUserAppointments);
router.post("/", AppointmentController.createNewAppointment);

export default router;
