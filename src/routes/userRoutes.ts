import { Router } from "express";
import userController from "../controllers/UserController";

const router = Router();

router.post("/register", userController.register);

export default router;
