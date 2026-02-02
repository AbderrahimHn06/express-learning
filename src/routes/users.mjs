import { Router } from "express";
import passport from "passport";
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

// Local Auth Routes
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

// Discord Auth Routes

router.get("/discord", passport.authenticate("discord"));
router.get(
  "/discord/callback",
  passport.authenticate("discord", {
    failureRedirect: "/api/auth/discord/failed",
    successRedirect: "/api/auth/discord/success",
  }),
);

router.get("/discord/success", (req, res) => {
  res.send("Discord authentication successful\n" + JSON.stringify(req.user));
});
router.get("/discord/failed", (req, res) => {
  res.send("Discord authentication Failed");
});

// GitHub Auth Routes
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api/auth/github/failed",
    successRedirect: "/api/auth/github/success",
  }),
);

router.get("/github/success", (req, res) => {
  res.send("GitHub authentication successful\n" + JSON.stringify(req.user));
});
router.get("/github/failed", (req, res) => {
  res.send("GitHub authentication Failed");
});
export default router;
