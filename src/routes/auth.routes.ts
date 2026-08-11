import { Router } from "express";
import {
  forgotPassword,
  googleAuthCallbackHandler,
  googleAuthStartHandler,
  loginHandler,
  logOutHandler,
  refreshHandler,
  registerHandler,
  resetPassword,
  verifyHandle,
} from "../controllers/auth/auth.controller.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/verify-email", verifyHandle);
router.post("/refresh", refreshHandler);
router.post("/logout", logOutHandler);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/google", googleAuthStartHandler);
router.get("/google/callback", googleAuthCallbackHandler);

export default router;
