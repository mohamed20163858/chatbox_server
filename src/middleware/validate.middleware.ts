import { Request, Response, NextFunction } from "express";
import { Schema } from "zod";
import { ApiError } from "./error.middleware";

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(new ApiError(400, "Validation error"));
    }
  };
};
