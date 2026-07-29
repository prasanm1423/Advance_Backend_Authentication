import { sendEmail } from "../../lib/email.js";
import { hashPass } from "../../lib/hash.js";
import { User } from "../../models/user.model.js";
import { registerSchema } from "./auth.schema.js";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

function getAppUrl() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}

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
    //email Verification Part
    const verifyToken = jwt.sign(
      {
        sub: newUser.id,
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: "1d" },
    );
    const verifyUrl = `${getAppUrl()}/auth/verify-email?token=${verifyToken}`;
    await sendEmail(
      newUser.email,
      "Verify Your Email before Login",
      `<p>Please Verify your Email by Clicking the below link</p>
      <p><a href="${verifyUrl}"><b>Click Here</b></a></p>`,
    );
    return res.status(201).json({
      message: "User Registered",
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        isEmailVerified: newUser.isEmailVerified,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      message: "Error while Registering",
      error: err,
    });
  }
}
