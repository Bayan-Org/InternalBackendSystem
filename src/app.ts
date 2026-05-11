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

// app.use((req, res, next) => {
//   console.log("Incoming Before Cors:", req.method, req.url, req.baseUrl);
//   next();
// });

app.use(cors());

// app.use((req, res, next) => {
//   next();
// });

app.get("/api", (req: Request, res: Response) => {
  res.status(201).json({
    message: "Server running",
  });
});

app.use("/api/auth", AuthRouter);
app.use("/api/user", AuthMiddleware, UserRouter);
app.use("/api/task", AuthMiddleware, TaskRouter);
export default app;
