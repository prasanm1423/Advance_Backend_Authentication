import { Schema, model } from "mongoose";
import { boolean, lowercase } from "zod";
import { required } from "zod/mini";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isEmailVerified: {
      type: boolean,
      default: false,
    },
    name: {
      type: String,
    },
    twoFactorEnabled: {
      type: boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: undefined,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    resetPassToke: {
      type: String,
      default: undefined,
    },
    resetPassExpiry: {
      type: Date,
      default: undefined,
    },
  },
  { timestamps: true },
);

export const User = model("User", UserSchema);
