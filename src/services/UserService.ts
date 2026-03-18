import { UserResponse } from "../types/user";
import { prisma } from "../lib/prisma";

import AppError from "../utils/AppError";
import passwordHasher from "../utils/Password";

class UserService {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<UserResponse> {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new AppError("Unable to register the user", 400);
    }

    const hashedPassword = await passwordHasher.hash(password);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return {
      name,
      email,
    };
  }
}

const userService = new UserService();

export default userService;
