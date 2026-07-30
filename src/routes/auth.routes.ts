import { Router } from "express";
import {
  loginHandler,
  refreshHandler,
  registerHandler,
  verifyHandle,
} from "../controllers/auth/auth.controller.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/emailVerify", verifyHandle);
router.post("/refresh", refreshHandler);

export default router;
