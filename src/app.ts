import express, { type Request, type Response } from "express";
import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(201).json({
    message: "Server running",
  });
});

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
export default app;
