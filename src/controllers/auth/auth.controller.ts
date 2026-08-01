import { access } from "fs";
import { sendEmail } from "../../lib/email.js";
import { checkPass, hashPass } from "../../lib/hash.js";
import {
  createAccesToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../../lib/token.js";
import { User } from "../../models/user.model.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
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
export async function verifyHandle(req: Request, res: Response) {
  const token = req.query.token as string | undefined;
  if (!token) {
    return res.status(400).json({
      message: "Needed Token.Token missing At email Verification.",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
      sub: string;
    };
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(400).json({
        message: "User not found While Verification",
      });
    }
    if (user.isEmailVerified) {
      return res.json({
        message: "User Already Verified",
      });
    }
    user.isEmailVerified = true;
    await user.save();
    return res.json({
      message: "Email is Verified.You can login",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Error While verifying User",
      Error: err,
    });
  }
}
export async function loginHandler(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Data entered is InCorrect or Invalid",
        error: result.error.flatten(),
      });
    }
    const { email, password } = result.data;
    const normEmail = email.toLocaleLowerCase().trim();
    const user = await User.findOne({ email: normEmail });
    if (!user) {
      return res.status(400).json({
        message: "User not found with Paticular details",
      });
    }
    const ok = await checkPass(password, user.password);
    if (!ok) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Email not verified Please Verify Email first",
      });
    }
    const accessToken = createAccesToken(user.id, user.role, user.tokenVersion);
    const refreshToken = createRefreshToken(user.id, user.tokenVersion);
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Login is Successfull",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      messgae: "Error while Logging in user",
      Error: error,
    });
  }
}
export async function refreshHandler(req: Request, res: Response) {
  try {
    const token = req.cookies?.refreshToken as string | undefined;
    if (!token) {
      return res.status(400).json({
        message: "Token Missing",
      });
    }
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(400).json({
        message: "User Not Found ",
      });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(400).json({
        message: "Invalid token",
      });
    }
    const newAccessToken = createAccesToken(
      user.id,
      user.role,
      user.tokenVersion,
    );
    const newRefreshToken = createRefreshToken(user.id, user.tokenVersion);
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Token Refreshed",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error While refreshing Token",
      Error: error,
    });
  }
}
export async function logOutHandler(_req: Request, res: Response) {
  try {
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(200).json({
      message: "User Logged Out Successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      message: "Error While user log out",
      Error: err,
    });
  }
}
