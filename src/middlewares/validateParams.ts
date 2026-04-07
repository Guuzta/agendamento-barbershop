import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/jwt";

function validateParams(schema: any) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        errors: "Id must be an int number",
      });
    }

    req.params = result.data;
    next();
  };
}

export default validateParams;
