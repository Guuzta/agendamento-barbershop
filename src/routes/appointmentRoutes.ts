import { Router } from "express";

import AppointmentController from "../controllers/AppointmentController";

const router = Router();

router.get("/:id", AppointmentController.listUserAppointments);

export default router;
