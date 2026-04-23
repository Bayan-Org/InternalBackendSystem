import express from "express";
import { getMatchingProfile, getProfileHandler } from "../controllers/user-controller.js";
const UserRouter = express.Router();

UserRouter.get("/pair", getMatchingProfile);
UserRouter.get("/profile", getProfileHandler)

export default UserRouter;
