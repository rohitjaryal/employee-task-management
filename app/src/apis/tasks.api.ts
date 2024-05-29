import { parseResponse } from "@/utils/helper.ts";
import fetchRequest from "@/includes/axios.ts";

async function getAllTasksForAllEmployees() {
  return parseResponse(await fetchRequest.post("/get-tasks-all-employees"));
}

async function getAllTasksForEmployee() {
  return parseResponse(await fetchRequest.post("/get-tasks"));
}

async function createTask(taskName: string, employeeId: string) {
  return parseResponse(
    await fetchRequest.post("/create-task", {
      taskName,
      employeeId,
    }),
  );
}

export { getAllTasksForEmployee, getAllTasksForAllEmployees, createTask };
