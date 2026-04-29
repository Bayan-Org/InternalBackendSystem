import express from "express";
import { getTaskHandler } from "../controllers/task-controller.js";

const TaskRouter = express.Router();

TaskRouter.get("/collection", getTaskHandler);

export default TaskRouter;
