import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validateInput = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json(z.treeifyError(err));
      }

      next(err);
    }
  };
};
