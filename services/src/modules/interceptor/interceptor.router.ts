const express = require("express");
const { isAuthRequest, validateToken } = require("../../utils/helper");
const jwt = require("jsonwebtoken");
import { Request, Response, NextFunction } from "express";

const interceptRouter = express.Router();
interceptRouter.use((req: Request, res: Response, next: NextFunction) => {
  if (isAuthRequest(req.url)) {
    next();
  } else {
    verifyToken(req, res, next);
  }
});

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { authId } = req.cookies;

  if (!authId) {
    return res.status(401).json({
      message: "Unauthorized user",
      success: false,
    });
  }
  try {
    validateToken(authId);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
export default interceptRouter;
