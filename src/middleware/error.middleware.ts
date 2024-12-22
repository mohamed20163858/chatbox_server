import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiError) {
    logger.warn({
      message: error.message,
      status: error.statusCode,
      path: req.path,
    });
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  logger.error({
    message: error.message,
    stack: error.stack,
    path: req.path,
  });

  return res.status(500).json({
    message: "Internal server error",
  });
};
