import {
  addNewEmployeeTask,
  getAllEmployeeTask,
  getTasksForAllEmployees,
  updateEmployeeTask,
} from "../../modals/task.model";
import { EMPLOYEE_TASK_STATUS } from "../../utils/constants";

async function createTask(employeeId: string, taskName: string) {
  return addNewEmployeeTask(employeeId, taskName);
}

async function updateTask(
  employeeId: string,
  taskId: string,
  taskStatus: EMPLOYEE_TASK_STATUS,
) {
  return updateEmployeeTask(employeeId, taskId, taskStatus);
}

async function getAllTasksOfEmployee(employeeId: string) {
  return getAllEmployeeTask(employeeId);
}

async function getAllTasksForAllEmployee() {
  return getTasksForAllEmployees();
}

export {
  createTask,
  updateTask,
  getAllTasksOfEmployee,
  getAllTasksForAllEmployee,
};
