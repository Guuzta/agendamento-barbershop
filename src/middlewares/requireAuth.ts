import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JwtPayloadCustom } from "../types/jwt";
import { AuthenticatedRequest } from "../types/jwt";
import AppError from "../utils/AppError";
import { env } from "../config/env";

const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("Token not provided", 401);
  }

  const [, token] = authorization.split(" ");

  try {
    const payload = jwt.verify(token, env.tokenSecret) as JwtPayloadCustom;

    const { id, name, email } = payload;

    req.userId = id;
    req.userName = name;
    req.userEmail = email;

    next();
  } catch {
    throw new AppError("Invalid token or expired", 403);
  }
};

export default requireAuth;
