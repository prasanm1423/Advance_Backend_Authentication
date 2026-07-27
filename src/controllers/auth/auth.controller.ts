import { hashPass } from "../../lib/hash.js";
import { User } from "../../models/user.model.js";
import { registerSchema } from "./auth.Schema.js";
import { Request, Response } from "express";

export async function registerHandler(req: Request, res: Response) {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Inavlid input from user",
      });
    }
    const { email, name, password } = result.data;
    const normEmail = email.toLowerCase().trim();
    const existUser = await User.findOne({ normEmail });
    if (existUser) {
      return res.status(409).json({
        message: "User already exist With the Email",
      });
    }
    const passHash = await hashPass(password);
    const newUser = await User.create({
      email: normEmail,
      password: passHash,
      role: "user",
      isEmailVerified: false,
      twoFactorEnabled: false,
      name,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Error while Registering",
      error: err,
    });
  }
}
