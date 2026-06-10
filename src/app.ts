import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
import TaskRouter from "./routes/task-route.js";

import { AuthMiddleware } from "./middleware/auth-middleware.js";
import { apiLimiter } from "./middleware/rate-limit-middleware.js";
dotenv.config();

const app = express();

/**
 * Behind NGINX Reverse Proxy
 */
const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";
app.set("trust proxy", isProd);

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
    message: "Server OK banged!",
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
