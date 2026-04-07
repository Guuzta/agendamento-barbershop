import { RegisterResponse, AccessToken } from "../types/user";
import { prisma } from "../lib/prisma";

import AppError from "../utils/AppError";
import passwordHasher from "../utils/Password";
import token from "../utils/Token";

class UserService {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new AppError("Unable to register the user", 409);
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

  async login(email: string, password: string): Promise<AccessToken> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await passwordHasher.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const accessToken = token.generateAccessToken(
      user.id,
      user.name,
      user.email,
      user.role,
    );

    return {
      accessToken,
    };
  }
}

const userService = new UserService();

export default userService;
