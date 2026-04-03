import { Router } from "express";
import userController from "../controllers/UserController";

import { validateInput } from "../middlewares/validateInput";
import { registerUserSchema } from "../schemas/registerUserSchema";
import { loginUserSchema } from "../schemas/loginUserSchema";

const router = Router();

router.post(
  "/register",
  validateInput(registerUserSchema),
  userController.register,
);

router.get(
  "/login", 
  validateInput(loginUserSchema), 
  userController.login
);

export default router;
