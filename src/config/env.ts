import { SignOptions } from "jsonwebtoken";
import "dotenv/config";

if (!process.env.TOKEN_SECRET) {
  throw new Error("TOKEN_SECRET not defined");
}

if (!process.env.TOKEN_EXPIRATION) {
  throw new Error("TOKEN_EXPIRATION not defined");
}

if (!process.env.ADMIN_PASSWORD) {
  throw new Error("ADMIN_PASSWORD not defined");
}

export const env = {
  tokenSecret: process.env.TOKEN_SECRET,
  jwtOptions: { expiresIn: process.env.TOKEN_EXPIRATION } as SignOptions,
  adminPassword: process.env.ADMIN_PASSWORD,
};
