import { Router } from "express";
import healthController from "../controllers/HealthController";

const router = Router();

router.get("/health", healthController.index);

export default router;
