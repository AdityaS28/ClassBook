import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ ...req.params, ...req.body, ...req.query });
      next();
    } catch (err: any) {
      return res.status(400).json({
        error: {
          code: "BAD_REQUEST",
          message: err.errors?.[0]?.message || err.message,
        },
      });
    }
  };
}
