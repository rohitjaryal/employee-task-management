import express from "express";
import passport from "passport";

import {
  createTaskEmployeeRequest,
  getAllTasksForAllEmployeeRequest,
  getAllTasksOfEmployeeRequest,
  updateTaskEmployeeRequest,
} from "./tasks.controller";

const tasksRouter = express.Router();

tasksRouter.post(
  "/create-task",
  passport.authenticate("admin-jwt", { session: false }),
  createTaskEmployeeRequest,
);

tasksRouter.post(
  "/update-task",
  passport.authenticate("employee-jwt", { session: false }),
  updateTaskEmployeeRequest,
);

tasksRouter.post(
  "/get-tasks",
  passport.authenticate("employee-jwt", { session: false }),
  getAllTasksOfEmployeeRequest,
);
tasksRouter.post(
  "/get-tasks-all-employees",
  passport.authenticate("admin-jwt", { session: false }),
  getAllTasksForAllEmployeeRequest,
);

export default tasksRouter;
