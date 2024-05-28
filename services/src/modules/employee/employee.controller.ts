import { Request, Response } from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployee,
  loginEmployee,
  onboardEmployee,
  updateEmployee,
} from "./employee.services";
import { saveAccessCode } from "../../modals/employee.model";

const { getTemplateResponse } = require("../../utils/helper");

async function getEmployeeRequest(req: Request, res: Response) {
  try {
    const { employeeId } = req.user as { employeeId: string };
    const response = await getEmployee(employeeId);
    return res.status(200).json(
      getTemplateResponse(
        {
          ...response,
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

async function getAllEmployeeRequest(req: Request, res: Response) {
  try {
    const employees = await getAllEmployees();
    return res.status(200).json(
      getTemplateResponse(
        {
          employees,
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

async function createEmployeeRequest(req: Request, res: Response) {
  try {
    const { email, name, role, address, phoneNumber } = req.body;
    const employeeId = await createEmployee(
      email,
      name,
      role,
      address,
      phoneNumber,
    );
    return res.status(200).json(
      getTemplateResponse(
        {
          employeeId,
        },
        true,
      ),
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(getTemplateResponse("Unable to create employee", false));
  }
}

async function deleteEmployeeRequest(req: Request, res: Response) {
  try {
    const { employeeId } = req.body;
    const response = await deleteEmployee(employeeId);
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
      .status(500)
      .json(getTemplateResponse("Unable to delete employee", false));
  }
}

async function sendAccessCodeEmployeeRequest(req: Request, res: Response) {
  try {
    const { email } = req.body;
    // const accessCode=generateCode();
    const response = await saveAccessCode(email, "employeeId");
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
      .status(500)
      .json(getTemplateResponse("Unable to delete employee", false));
  }
}

async function validateAccessCodeEmployeeRequest(req: Request, res: Response) {
  const { email, accessCode } = req.body;
}

async function updateEmployeeRequest(req: Request, res: Response) {
  try {
    const { employeeId, address, name, role } = req.body;
    const response = await updateEmployee(employeeId, address, name, role);
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
      .status(500)
      .json(getTemplateResponse("Unable to delete employee", false));
  }
}

async function validateEmployeeAndMarkAsActiveRequest(
  req: Request,
  res: Response,
) {
  try {
    const { employeeId, accessCode, userName, password } = req.body;
    const response = await onboardEmployee(
      employeeId,
      accessCode,
      userName,
      password,
    );
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
      .status(500)
      .json(getTemplateResponse("Unable to delete employee", false));
  }
}

async function loginEmployeeRequest(req: Request, res: Response) {
  try {
    const { userName, password } = req.body;
    const response = await loginEmployee(userName, password);
    return res.status(200).json(
      getTemplateResponse(
        {
          ...response,
          userName,
        },
        true,
      ),
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json(getTemplateResponse("Unable to login", false));
  }
}

export {
  getEmployeeRequest,
  createEmployeeRequest,
  deleteEmployeeRequest,
  sendAccessCodeEmployeeRequest,
  validateAccessCodeEmployeeRequest,
  getAllEmployeeRequest,
  updateEmployeeRequest,
  validateEmployeeAndMarkAsActiveRequest,
  loginEmployeeRequest,
};
