import express from "express";
import { getProfileHandler } from "../controllers/user-controller.js";
const UserRouter = express.Router();

UserRouter.get("/profile", getProfileHandler);

export default UserRouter;
