import { Request, Response } from "express";
import { RegisterUserBody, UserResponse } from "../types/user";

import userService from "../services/UserService";

class UserController {
  async register(
    req: Request<{}, UserResponse, RegisterUserBody>,
    res: Response<UserResponse>,
  ) {
    const { name, email, password } = req.body;

    const user = await userService.register(name, email, password);

    res.status(200).json(user);
  }
}

export default new UserController();
