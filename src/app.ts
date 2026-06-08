import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
import TaskRouter from "./routes/task-route.js";

import { AuthMiddleware } from "./middleware/auth-middleware.js";

dotenv.config();

const app = express();

/**
 * Behind NGINX Reverse Proxy
 */
app.set("trust proxy", true);

/**
 * Global API Limiter
 */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests",
  },
});

/**
 * Login Limiter
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});

/**
 * CORS
 */
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed =
      origin === "https://bayan.com.sg" || origin.endsWith(".bayan.com.sg");

    callback(null, isAllowed);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

/**
 * Health Check
 */
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server running",
  });
});

/**
 * Global Limiter
 */
app.use("/auth", apiLimiter);
app.use("/user", apiLimiter);
app.use("/task", apiLimiter);

/**
 * Routes
 */
app.use("/auth", AuthRouter);
app.use("/user", AuthMiddleware, UserRouter);
app.use("/task", AuthMiddleware, TaskRouter);

export default app;
