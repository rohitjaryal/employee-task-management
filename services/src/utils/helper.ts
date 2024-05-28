import * as fs from "fs";
import path from "path";

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const jsonwebtoken = require("jsonwebtoken");
const pathToKey = path.join(__dirname, "../..", "id_rsa_priv.pem");
const PRIVATE_KEY = fs.readFileSync(pathToKey, "utf8");

const isAuthRequest = (url: string) => {
  return url?.indexOf("/auth", 0) !== -1;
};

const validateToken = (token: string) => {
  return jwt.verify(token, process.env.TOKEN_KEY);
};
// function generateCode() {
//   return Math.floor(Math.random() * 89999 + 10000);
// }

function getTemplateResponse(content: string, isSuccess: boolean) {
  let response;
  if (isSuccess) {
    response = { success: isSuccess, data: content, error: null };
  } else {
    response = {
      success: isSuccess,
      data: null,
      error: content,
    };
  }
  return response;
}

function generateCode() {
  const codeLength = 6;
  return Math.random().toString().substr(2, codeLength);
}

function genHashedPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

function validatePassword(password: string, hash: string, salt: string) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

function issueJWT(user: { _id: string }) {
  const _id = user._id;

  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIVATE_KEY, {
    expiresIn: expiresIn,
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

export {
  getTemplateResponse,
  generateCode,
  isAuthRequest,
  validateToken,
  genHashedPassword,
  validatePassword,
  issueJWT,
};
