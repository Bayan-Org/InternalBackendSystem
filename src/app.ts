import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
import cors from "cors";
import { AuthMiddleware } from "./middleware/auth-middleware.js";
import TaskRouter from "./routes/task-route.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const allowed =
        origin.endsWith(".bayan.com.sg") || origin === "https://bayan.com.sg";
      callback(null, allowed);
    },
  }),
);
app.set("trust proxy", true);

app.get("/", (req: Request, res: Response) => {
  res.status(201).json({
    message: "Server running",
  });
});

app.use("/auth", AuthRouter);
app.use("/user", AuthMiddleware, UserRouter);
app.use("/task", AuthMiddleware, TaskRouter);
export default app;
