import jwt from "jsonwebtoken";

export function createAccesToken(
  userId: string,
  role: "user" | "admin",
  tokenVersion: Number,
) {
  const payload = { sub: userId, role, tokenVersion };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "30m",
  });
}

export function createRefreshToken(userId: string, tokenVersion: Number) {
  const paylod = { sub: userId, tokenVersion };
  return jwt.sign(paylod, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: "10d",
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET !) as {
    sub: string;
    tokenVersion: number;
  };
}
