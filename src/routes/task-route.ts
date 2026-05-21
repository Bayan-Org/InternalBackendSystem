import express from "express";
import {
  actionHandler,
  getTaskCollectionHandler,
  getTaskDataHandler,
  getTaskReferenceHandler,
} from "../controllers/task-controller.js";
import {
  ApprovalMiddleware,
  TaskDetailMiddleware,
} from "../middleware/action-middleware.js";
import { FilterMiddleware } from "../middleware/params-middleware.js";

const TaskRouter = express.Router();

TaskRouter.get("/data", FilterMiddleware, getTaskDataHandler);
TaskRouter.get("/collection", getTaskCollectionHandler);
TaskRouter.get("/reference", TaskDetailMiddleware, getTaskReferenceHandler);

TaskRouter.post("/approve", [ApprovalMiddleware], actionHandler);
TaskRouter.post("/reject", [ApprovalMiddleware], actionHandler);
TaskRouter.post("/rework", [ApprovalMiddleware], actionHandler);

export default TaskRouter;
