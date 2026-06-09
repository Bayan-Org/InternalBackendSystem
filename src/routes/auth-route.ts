import express from "express";
import {
  callbackHandler,
  exchangeHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  verifyToken,
} from "../controllers/auth-controller.js";
import { loginLimiter } from "../middleware/rate-limit-middleware.js";
import { AuthMiddleware } from "../middleware/auth-middleware.js";

const AuthRouter = express.Router();

AuthRouter.get("/login", loginLimiter, loginHandler);
AuthRouter.get("/logout", logoutHandler);
AuthRouter.get("/good-bye", (req, res) => {
  res.send("See you when i see you again");
});
AuthRouter.get("/verify-token", AuthMiddleware, verifyToken);
AuthRouter.get("/callback", callbackHandler);
AuthRouter.get("/exchange", exchangeHandler);
AuthRouter.post("/refresh-token", refreshTokenHandler);

export default AuthRouter;
