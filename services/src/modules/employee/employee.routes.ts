import express from "express";
import passport from "passport";

import {
  createEmployeeRequest,
  deleteEmployeeRequest,
  getAllEmployeeRequest,
  getEmployeeRequest,
  loginEmployeeRequest,
  sendAccessCodeEmployeeRequest,
  updateEmployeeRequest,
  validateEmployeeAndMarkAsActiveRequest,
} from "./employee.controller";

const employeeRouter = express.Router();

employeeRouter.post(
  "/get-all-employees",
  passport.authenticate("admin-jwt", { session: false }),
  getAllEmployeeRequest,
);
employeeRouter.post(
  "/create-employee",
  passport.authenticate("admin-jwt", { session: false }),
  createEmployeeRequest,
);
employeeRouter.post(
  "/update-employee",
  passport.authenticate("admin-jwt", { session: false }),
  updateEmployeeRequest,
);
employeeRouter.delete(
  "/delete-employee",
  passport.authenticate("admin-jwt", { session: false }),
  deleteEmployeeRequest,
);

employeeRouter.post(
  "/send-access-code-employee",
  passport.authenticate("admin-jwt", { session: false }),
  sendAccessCodeEmployeeRequest,
);
employeeRouter.post(
  "/validate-access-code-employee",
  validateEmployeeAndMarkAsActiveRequest,
);

employeeRouter.post("/employee-login", loginEmployeeRequest);

employeeRouter.post(
  "/get-employee",
  passport.authenticate("employee-jwt", { session: false }),
  getEmployeeRequest,
);

export default employeeRouter;
