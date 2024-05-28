import {
  addEmployeeCredentials,
  deleteEmployee,
  fetchUserCredentials,
  getAllEmployees,
  getEmployee,
  saveNewEmployee,
  updateEmployee,
  updateEmployeeById,
  validateCode,
} from "./employee.firebase";
import {
  generateCode,
  genHashedPassword,
  issueJWT,
  validatePassword,
} from "../utils/helper";
import { EMPLOYEE_VERIFICATION_STATUS } from "../utils/constants";

async function addNewEmployee(
  email: string,
  name: string,
  role: string,
  address: string,
  phoneNumber: string,
  accessCode: string,
) {
  try {
    const { employeeId } = await saveNewEmployee(
      email,
      name,
      role,
      address,
      accessCode,
      EMPLOYEE_VERIFICATION_STATUS.PENDING,
      phoneNumber,
    );
    return employeeId;
  } catch (err) {
    console.error(err);
    throw new Error("Invalid operation");
  }
}

async function getEmployeeData(employeeId: string) {
  return getEmployee(employeeId);
}

async function getAllEmployeeData() {
  return getAllEmployees();
}

async function removeEmployee(employeeId: string) {
  return deleteEmployee(employeeId);
}

async function updateEmployeeByEmployeeId(
  employeeId: string,
  address: string,
  name: string,
  role: string,
) {
  return updateEmployeeById(employeeId, { address, name, role });
}

async function saveAccessCode(email: string, accessCode: string) {
  try {
    return await updateEmployee(email, {
      accessCode,
      accessCodeGeneratedAt: new Date(),
    });
  } catch (err) {
    console.error(err);
    throw new Error("Invalid operation");
  }
}

async function validateAccessCode(employeeId: string, accessCode: string) {
  return await validateCode(employeeId, accessCode);
}

async function setupUserNameAndPassword(
  employeeId: string,
  userName: string,
  password: string,
) {
  const hashedPassword = genHashedPassword(password);
  return await addEmployeeCredentials(employeeId, userName, hashedPassword);
}

async function validateUser(userName: string, password: string) {
  const user = await fetchUserCredentials(userName);
  if (!user?.password) {
    throw new Error("Please provide valid credentials");
  }

  const isValid = validatePassword(password, user.password, user.salt);
  if (!isValid) {
    throw new Error("Please provide valid credentials");
  }
  return issueJWT(user);
}

export {
  addNewEmployee,
  getEmployeeData,
  removeEmployee,
  saveAccessCode,
  getAllEmployeeData,
  updateEmployeeByEmployeeId,
  validateAccessCode,
  setupUserNameAndPassword,
  validateUser,
};
