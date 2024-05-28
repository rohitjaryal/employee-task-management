import { parseResponse } from "@/utils/helper.ts";
import fetchRequest from "@/includes/axios.ts";

async function getAllEmployees() {
  return parseResponse(await fetchRequest.post("/get-all-employees"));
}

async function createEmployee(
  email: string,
  name: string,
  role: string,
  address: string,
  phoneNumber: string,
) {
  return parseResponse(
    await fetchRequest.post("/create-employee", {
      email,
      name,
      role,
      address,
      phoneNumber,
    }),
  );
}

async function updateEmployee(
  employeeId: string,
  name?: string,
  role?: string,
  address?: string,
) {
  return parseResponse(
    await fetchRequest.post("/update-employee", {
      employeeId,
      name,
      role,
      address,
    }),
  );
}

async function deleteEmployee(employeeId: string) {
  return await fetchRequest.delete("/delete-employee", {
    data: {
      employeeId,
    },
  });
}

export { getAllEmployees, createEmployee, deleteEmployee, updateEmployee };
