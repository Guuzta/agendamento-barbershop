import { Request, Response, NextFunction } from "express";

import {
  LoginUserBody,
  RegisterUserBody,
  RegisterResponse,
  AccessToken,
} from "../types/user";

import userService from "../services/UserService";

class UserController {
  async register(
    req: Request<{}, {}, RegisterUserBody>,
    res: Response<RegisterResponse>,
    next: NextFunction,
  ) {
    try {
      const { name, email, password } = req.body;

      const user = await userService.register(name, email, password);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request<{}, {}, LoginUserBody>,
    res: Response<AccessToken>,
    next: NextFunction,
  ) {
    try {
      const { email, password } = req.body;

      const token = await userService.login(email, password);

      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
