import express from "express";
import {
  callbackHandler,
  exchangeHandler,
  loginHandler,
  refreshTokenHandler,
} from "../controllers/auth-controller.js";

const AuthRouter = express.Router();

AuthRouter.get("/login", loginHandler);
AuthRouter.get("/callback", callbackHandler);
AuthRouter.get("/exchange", exchangeHandler);
AuthRouter.post("/refresh-token", refreshTokenHandler);

export default AuthRouter;
