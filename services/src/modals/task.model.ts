import {
  createTask,
  getAllEmployeeTasks,
  getAllTasks,
  updateTask,
} from "./tasks.firebase";
import { EMPLOYEE_TASK_STATUS } from "../utils/constants";
import { v4 as uuidv4 } from "uuid";

async function addNewEmployeeTask(employeeId: string, taskName: string) {
  try {
    const taskId = uuidv4();
    await createTask(employeeId, taskId, taskName);
  } catch (err) {
    console.error(err);
    throw new Error("Invalid operation");
  }
}

async function updateEmployeeTask(
  employeeId: string,
  taskId: string,
  taskStatus: EMPLOYEE_TASK_STATUS,
) {
  await updateTask(employeeId, taskId, taskStatus);
}

async function getAllEmployeeTask(employeeId: string) {
  return await getAllTasks(employeeId);
}

async function getTasksForAllEmployees() {
  return await getAllEmployeeTasks();
}
export {
  addNewEmployeeTask,
  updateEmployeeTask,
  getAllEmployeeTask,
  getTasksForAllEmployees,
};
