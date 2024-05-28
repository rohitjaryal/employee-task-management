import express from "express";
import { createNewAccessCode, validateCode } from "./user.controller";

const userRouter = express.Router();

userRouter.post("/auth/create-new-access-code", createNewAccessCode);
userRouter.post("/auth/validate-access-code", validateCode);

export default userRouter;
