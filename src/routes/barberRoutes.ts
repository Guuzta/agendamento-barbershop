import { Router } from "express";

import BarberController from "../controllers/BarberController";

const router = Router();

router.get("/", BarberController.listAll);

export default router;
