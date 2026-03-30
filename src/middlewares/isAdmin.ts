import { Response, NextFunction } from "express";

import { AuthenticatedRequest } from "../types/jwt";
import { GenericMessage } from "../types/types";

const isAdmin = async (
  req: AuthenticatedRequest,
  res: Response<GenericMessage>,
  next: NextFunction,
) => {
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({
      message: "Forbidden: Admins only",
    });
  }

  next();
};

export default isAdmin;
