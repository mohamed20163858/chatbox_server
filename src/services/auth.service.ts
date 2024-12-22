import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../middleware/error.middleware";
import { RegisterUserDto, LoginUserDto } from "../types/auth.types";

const prisma = new PrismaClient();

class AuthService {
  async register(data: RegisterUserDto) {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser) {
      throw new ApiError(400, "Email or username already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id);

    return { user, token };
  }

  async login(data: LoginUserDto) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(
      data.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      throw new ApiError(401, "Invalid credentials");
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastSeen: new Date() },
    });

    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        fullName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return user;
  }

  private generateToken(userId: string): string {
    return jwt.sign({ id: userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }
}

export const authService = new AuthService();
