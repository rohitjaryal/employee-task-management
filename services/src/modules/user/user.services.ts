import { generateCode } from "../../utils/helper";
import { saveCode, validateAccessCode } from "../../modals/user.model";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

async function sendAccessCode(phoneNumber: string) {
  const code = generateCode();
  await saveCode(phoneNumber, code);
  await sendSMStoUser(phoneNumber, code);
}

async function validateUserCode(phoneNumber: string, code: number) {
  return await validateAccessCode(phoneNumber, code);
}

async function sendSMStoUser(phoneNumber: string, accessCode: string) {
  const client = require("twilio")(accountSid, authToken);

  client.messages
    .create({
      body: `Here's your verification code ${accessCode}`,
      to: phoneNumber,
      from: process.env.BASE_FROM_NUMBER,
    })
    .then((message: any) => console.log("message", message.sid))
    .catch(() => {
      throw new Error("Not able to send SMS");
    });
}

export { sendAccessCode, validateUserCode };
