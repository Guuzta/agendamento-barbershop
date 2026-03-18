import { UserResponse } from "../types/user";
import { prisma } from "../lib/prisma";

class UserService {
  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<UserResponse> {
    await prisma.user.create({
      data: { name, email, password },
    });

    return {
      name,
      email,
    };
  }
}

const userService = new UserService();

export default userService;
