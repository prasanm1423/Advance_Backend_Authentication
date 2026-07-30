import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  verifyHandle,
} from "../controllers/auth/auth.controller.js";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.get("/emailVerify", verifyHandle);

export default router;
