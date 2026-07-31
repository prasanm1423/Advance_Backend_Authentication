import { Router } from "express";
import {
  loginHandler,
  logOutHandler,
  refreshHandler,
  registerHandler,
  verifyHandle,
} from "../controllers/auth/auth.controller.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/verify-email", verifyHandle);
router.post("/refresh", refreshHandler);
router.post("/logout", logOutHandler);

export default router;
