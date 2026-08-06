import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/token.js";
import { User } from "../models/user.model.js";

async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "You are not Authorized User",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(400).json({
        message: "User not found ,you cant go further",
      });
    }
    if (payload.tokenVersion !== user.tokenVersion) {
      return res.status(400).json({
        message: "Token is invalid",
      });
    }
    const authReq = req as any;
    authReq.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    };
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Error from Require Auth",
      error: err,
    });
  }
}

export default requireAuth;
