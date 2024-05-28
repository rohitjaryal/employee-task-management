import { fetchUserRecord, saveAccessCode, saveWebToken } from "./user.firebase";
import { genHashedPassword, issueJWT } from "../utils/helper";

async function saveCode(phoneNumber: string, code: string) {
  if (!phoneNumber) {
    throw new Error("All input are required");
  }

  try {
    await saveAccessCode(phoneNumber, code);
  } catch (err) {
    console.error(err);
    throw new Error("Invalid operation");
  }
}

async function validateAccessCode(phoneNumber: string, code: number) {
  const result = await fetchUserRecord(phoneNumber);
  if (result.accessCode !== code) {
    throw new Error("Access Code doesnt match");
  }

  // create a web token and saved it in db.
  const hashedPassword = genHashedPassword(code.toString());
  await saveWebToken(phoneNumber, hashedPassword);
  const user = await fetchUserRecord(phoneNumber);
  return issueJWT(user);
}
export { saveCode, validateAccessCode };
