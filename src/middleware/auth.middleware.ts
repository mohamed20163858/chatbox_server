import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "./error.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid token"));
  }
};
