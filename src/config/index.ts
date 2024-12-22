import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100, // requests per window
  jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
} as const;
