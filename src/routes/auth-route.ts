import express from "express";
import {
  callbackHandler,
  loginHandler,
} from "../controllers/auth-controller.js";

const AuthRouter = express.Router();

AuthRouter.get("/login", loginHandler);
AuthRouter.get("/callback", callbackHandler);

export default AuthRouter;
