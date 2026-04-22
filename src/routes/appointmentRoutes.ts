import { Router } from "express";

import AppointmentController from "../controllers/AppointmentController";

import requireAuth from "../middlewares/requireAuth";
import validateParams from "../middlewares/validateParams";
import { validateInput } from "../middlewares/validateInput";

import { appointmentSchema } from "../schemas/appointmentSchema";
import paramsSchema from "../schemas/paramsSchema";

const router = Router();

router.get(
  "/", 
  requireAuth, 
  AppointmentController.listUserAppointments
);

router.post(
  "/",
  requireAuth,
  validateInput(appointmentSchema),
  AppointmentController.createNewAppointment,
);

router.get(
  "/:id",
  requireAuth,
  validateParams(paramsSchema),
  AppointmentController.getUserAppointment,
);

router.delete(
  "/:id",
  requireAuth,
  validateParams(paramsSchema),
  AppointmentController.cancelAppointment,
);

export default router;
