import { Request, Response } from "express";
import { sendAccessCode, validateUserCode } from "./user.services";

const { getTemplateResponse } = require("../../utils/helper");

async function createNewAccessCode(req: Request, res: Response) {
  try {
    const { phoneNumber } = req.body;
    await sendAccessCode(phoneNumber);
    return res.status(200).json(getTemplateResponse({}, true));
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(getTemplateResponse("Unable to create new access code", false));
  }
}

async function validateCode(req: Request, res: Response) {
  try {
    const { phoneNumber, code } = req.body;
    const response = await validateUserCode(phoneNumber, code);
    return res.status(200).json(
      getTemplateResponse(
        {
          ...response,
          userName: phoneNumber,
        },
        true,
      ),
    );
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json(getTemplateResponse("Unable to validate access code", false));
  }
}

export { createNewAccessCode, validateCode };
