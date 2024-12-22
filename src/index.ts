import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { config } from "./config";
import logger from "./utils/logger";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS handling
app.use(compression()); // Response compression
app.use(express.json()); // Body parsing
app.use(morgan("dev")); // Request logging

// Rate limiting
app.use(
  rateLimit({
    windowMs: config.rateLimitWindow,
    max: config.rateLimitMax,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Server startup
const server = app.listen(config.port, () => {
  logger.info(
    `Server running on port ${config.port} in ${config.nodeEnv} mode`
  );
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

export default app;
