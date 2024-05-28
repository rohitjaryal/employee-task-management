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
      to: "recipient@foo.com",
      channel: email,
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

async function sendAccessCodeEmployee(email: string) {
  const accessCode = generateCode();
  await saveAccessCode(email, accessCode);
  // send access code by email
  //
}

async function onboardEmployee(
  employeeId: string,
  accessCode: string,
  userName: string,
  password: string,
) {
  await validateAccessCode(employeeId, accessCode);

  await setupUserNameAndPassword(employeeId, userName, password);

  // 3. mark status of employee as Active
  // return updateEmployeeByEmployeeId(employeeId, address, name, role);
}

async function loginEmployee(userName: string, password: string) {
  // 1. validate username n password
  return validateUser(userName, password);
  // 2. create json web token and send it to client as cookie
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
