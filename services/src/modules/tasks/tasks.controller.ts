import { Request, Response } from "express";
import {
  createTask,
  getAllTasksForAllEmployee,
  getAllTasksOfEmployee,
  updateTask,
} from "./tasks.services";

const { getTemplateResponse } = require("../../utils/helper");

async function createTaskEmployeeRequest(req: Request, res: Response) {
  try {
    const { taskName, employeeId } = req.body;
    const response = await createTask(employeeId, taskName);
    return res.status(200).json(
      getTemplateResponse(
        {
          response,
        },
        true,
      ),
    );
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(getTemplateResponse("Unable to find employee", false));
  }
}

async function updateTaskEmployeeRequest(req: Request, res: Response) {
  try {
    const { employeeId } = req.user as { employeeId: string };
    const { taskStatus, taskId } = req.body;
    const response = await updateTask(employeeId, taskId, taskStatus);
    return res.status(200).json(
      getTemplateResponse(
        {
          response,
        },
        true,
      ),
    );
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(getTemplateResponse("Unable to find employee", false));
  }
}

async function getAllTasksOfEmployeeRequest(req: Request, res: Response) {
  try {
    const { employeeId } = req.user as { employeeId: string };
    const response = await getAllTasksOfEmployee(employeeId);
    return res.status(200).json(
      getTemplateResponse(
        {
          response,
        },
        true,
      ),
    );
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(getTemplateResponse("Unable to find employee", false));
  }
}

async function getAllTasksForAllEmployeeRequest(req: Request, res: Response) {
  try {
    const response = await getAllTasksForAllEmployee();
    return res.status(200).json(
      getTemplateResponse(
        {
          response,
        },
        true,
      ),
    );
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(getTemplateResponse("Unable to find employee", false));
  }
}

export {
  createTaskEmployeeRequest,
  updateTaskEmployeeRequest,
  getAllTasksOfEmployeeRequest,
  getAllTasksForAllEmployeeRequest,
};
