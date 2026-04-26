import express from "express";
import {
  callbackHandler,
  exchangeHandler,
  loginHandler,
} from "../controllers/auth-controller.js";

const AuthRouter = express.Router();

AuthRouter.get("/login", loginHandler);
AuthRouter.get("/callback", callbackHandler);
AuthRouter.get("/exchange", exchangeHandler);

export default AuthRouter;
