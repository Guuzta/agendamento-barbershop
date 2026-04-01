import { Router } from "express";

import AdminController from "../controllers/AdminController";

import requireAuth from "../middlewares/requireAuth";
import isAdmin from "../middlewares/isAdmin";

const router = Router();

router.post("/barbers", requireAuth, isAdmin, AdminController.createNewBarber);
router.get("/barbers", AdminController.listAllBarbers)

export default router;
