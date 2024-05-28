import fetchRequest from "@/includes/axios.ts";
import { parseResponse } from "@/utils/helper.ts";

async function loginEmployee(userName: string, password: string) {
  return parseResponse(
    await fetchRequest.post("/employee-login", {
      userName,
      password,
    }),
  );
}

async function loginAdmin(phoneNumber: string, code: string) {
  return parseResponse(
    await fetchRequest.post("/auth/validate-access-code", {
      phoneNumber,
      code,
    }),
  );
}

async function createNewAccessCode(phoneNumber: string) {
  return parseResponse(
    await fetchRequest.post("/auth/create-new-access-code", {
      phoneNumber,
    }),
  );
}

async function validateAndOnboardEmployee(
  employeeId: string,
  accessCode: string,
  userName: string,
  password: string,
) {
  return parseResponse(
    await fetchRequest.post("/validate-access-code-employee", {
      employeeId,
      accessCode,
      userName,
      password,
    }),
  );
}

export {
  loginEmployee,
  loginAdmin,
  createNewAccessCode,
  validateAndOnboardEmployee,
};
