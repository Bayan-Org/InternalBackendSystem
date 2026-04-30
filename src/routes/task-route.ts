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

const TaskRouter = express.Router();

TaskRouter.get("/data", getTaskDataHandler);
TaskRouter.get("/collection", getTaskCollectionHandler);
TaskRouter.get("/reference", getTaskReferenceHandler);

TaskRouter.post(
  "/approve",
  [ApprovalMiddleware, TaskDetailMiddleware],
  actionHandler,
);
TaskRouter.post(
  "/reject",
  [ApprovalMiddleware, TaskDetailMiddleware],
  actionHandler,
);
TaskRouter.post(
  "/rework",
  [ApprovalMiddleware, TaskDetailMiddleware],
  actionHandler,
);

export default TaskRouter;
