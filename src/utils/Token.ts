import jwt from "jsonwebtoken";
import { env } from "../config/env";

class Token {
  generateAccessToken(id: number, name: string, email: string) {
    const payload = { id, name, email };

    const accessToken = jwt.sign(payload, env.tokenSecret, env.jwtOptions);

    return accessToken;
  }
}

export default new Token();
