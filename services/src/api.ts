import express, { Application } from "express";
import userRouter from "./modules/user/user.routes";
import employeeRouter from "./modules/employee/employee.routes";
import tasksRouter from "./modules/tasks/tasks.routes";

const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const api: Application = express();

api.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  }),
);

api.use(express.json());
api.use(cookieParser());
// api.use(interceptRouter);
api.use(userRouter);
api.use(employeeRouter);
api.use(tasksRouter);

api.use(express.static(path.join(__dirname, "..", "public")));

api.use("/", express.static("index.html"));

module.exports = api;
