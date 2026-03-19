import { Router } from "express";

import BarberController from "../controllers/BarberController";

const router = Router();

router.get("/", BarberController.listAll);
router.get("/:id", BarberController.getBarberById);

export default router;
