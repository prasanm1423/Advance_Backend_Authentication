import { Request, Response, Router } from "express";
import requireAuth from "../middleware/requireAuth.js";
import requireRole from "../middleware/requireRole.js";
import { ca } from "zod/locales";
import { User } from "../models/user.model.js";

const router = Router();

router.get(
  "/users",
  requireAuth,
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    try {
      const user = await User.find(
        {},
        {
          email: 1,
          role: 1,
          isEmailVerified: 1,
          createdAt: 1,
        },
      ).sort({ createdAt: -1 });
      const Res = user.map((u) => ({
        id: u.id,
        email: u.email,
        role: u.email,
        isEmailVerified: u.isEmailVerified,
        createdAt: u.createdAt,
      }));
      return res.json({
        users: Res,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error while getting Users",
        error: error,
      });
    }
  },
);

export default router;
