import express, { type Request, type Response } from "express";
import AuthRouter from "./routes/auth-route.js";
import UserRouter from "./routes/user-route.js";
import cors from "cors";
const app = express();

app.use(express.json());

// 🔥 HARUS PALING ATAS
app.use(cors({
  origin: "https://dev-ecology.bayan.com.sg",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔥 handle preflight secara manual (Express v5 safe)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", "https://dev-ecology.bayan.com.sg");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res.sendStatus(200);
  }
  next();
});


app.get("/", (req: Request, res: Response) => {
  res.status(201).json({
    message: "Server running",
  });
});

app.use("/auth", AuthRouter);
app.use("/user", UserRouter);
export default app;
