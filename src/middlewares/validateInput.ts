import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

function formatZodErrorsFromIssues(issues: ZodError["issues"]) {
  const result: Record<string, string> = {};

  issues.forEach((issue) => {
    const field = issue.path[0] ? String(issue.path[0]) : "_global";

    if (result[field]) {
      result[field] += ", " + issue.message;
    } else {
      result[field] = issue.message;
    }
  });

  return result;
}

export const validateInput = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const formattedErrors = formatZodErrorsFromIssues(err.issues);
        return res.status(400).json({ errors: formattedErrors });
      }
      next(err);
    }
  };
};
