import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { RegisterUserDto, LoginUserDto } from "../types/auth.types";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const userData: RegisterUserDto = req.body;
      const result = await authService.register(userData);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData: LoginUserDto = req.body;
      const result = await authService.login(loginData);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: "Not authenticated" });
        return;
      }
      const user = await authService.getCurrentUser(userId);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // In a JWT-based auth system, we don't need to do anything server-side
      // The client should remove the token
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
