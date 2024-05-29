import {
  addNewEmployee,
  getAllEmployeeData,
  getEmployeeData,
  removeEmployee,
  saveAccessCode,
  setupUserNameAndPassword,
  updateEmployeeByEmployeeId,
  validateAccessCode,
  validateUser,
} from "../../modals/employee.model";
import { generateCode } from "../../utils/helper";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const emailTemplateId = process.env.template_id;
const fromEmail = process.env.fromEmail;

async function createEmployee(
  email: string,
  name: string,
  role: string,
  address: string,
  phoneNumber: string,
) {
  const accessCode = generateCode();
  await sendVerificationEmail(email, accessCode);
  return await addNewEmployee(
    email,
    name,
    role,
    address,
    phoneNumber,
    accessCode,
  );
}

async function sendVerificationEmail(email: string, accessCode: string) {
  const emailClient = require("twilio")(accountSid, authToken);

  emailClient.verify.v2
    .services(accountSid)
    .verifications.create({
      channelConfiguration: {
        template_id: emailTemplateId,
        from: fromEmail,
        from_name: "Employee Task manager",
      },
      to: email,
      channel: "email",
      customCode: accessCode,
    })
    .then((verification: any) => console.log(verification.sid))
    .catch(() => {
      throw new Error("Failed to send verification email");
    });
}
async function getEmployee(employeeId: string) {
  return getEmployeeData(employeeId);
}

async function getAllEmployees() {
  return getAllEmployeeData();
}

async function deleteEmployee(employeeId: string) {
  return removeEmployee(employeeId);
}

async function updateEmployee(
  employeeId: string,
  address: string,
  name: string,
  role: string,
) {
  return updateEmployeeByEmployeeId(employeeId, address, name, role);
}

async function onboardEmployee(
  employeeId: string,
  accessCode: string,
  userName: string,
  password: string,
) {
  await validateAccessCode(employeeId, accessCode);
  await setupUserNameAndPassword(employeeId, userName, password);
}

async function loginEmployee(userName: string, password: string) {
  return validateUser(userName, password);
}

export {
  createEmployee,
  getEmployee,
  deleteEmployee,
  getAllEmployees,
  updateEmployee,
  onboardEmployee,
  loginEmployee,
};
