import { Router } from "express";
// Controllers
import {
  signUpController,
  logIncontroller,
} from "../controllers/authControllers.mjs";
// Validations
import {
  signUpValidation,
  loginValidation,
  authValidationResultHandler,
} from "../validations/authValidation.mjs";

const router = Router();

router.post(
  "/signup",
  signUpValidation,
  authValidationResultHandler,
  signUpController,
);

router.post(
  "/login",
  loginValidation,
  authValidationResultHandler,
  logIncontroller,
);
export default router;
