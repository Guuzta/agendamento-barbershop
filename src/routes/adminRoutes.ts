import { Router } from "express";

import AdminController from "../controllers/AdminController";

import requireAuth from "../middlewares/requireAuth";
import isAdmin from "../middlewares/isAdmin";
import { validateInput } from "../middlewares/validateInput";
import validateParams from "../middlewares/validateParams";

import { registerBarberSchema } from "../schemas/registerBarberSchema";
import { updateBarberSchema } from "../schemas/updateBarberSchema";
import paramsSchema from "../schemas/paramsSchema";

const router = Router();

router.post(
  "/barbers",
  requireAuth,
  isAdmin,
  validateInput(registerBarberSchema),
  AdminController.createNewBarber,
);

router.get(
  "/barbers", 
  requireAuth, 
  isAdmin, 
  AdminController.listAllBarbers
);

router.get(
  "/appointments",
  requireAuth,
  isAdmin,
  AdminController.listAllAppointments,
);

router.put(
  "/barbers/:id",
  requireAuth,
  isAdmin,
  validateParams(paramsSchema),
  validateInput(updateBarberSchema),
  AdminController.updateBarber,
);

router.delete(
  "/barbers/:id",
  requireAuth,
  isAdmin,
  validateParams(paramsSchema),
  AdminController.disableBarber,
);

export default router;
