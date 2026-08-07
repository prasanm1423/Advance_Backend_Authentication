import { Request, Response, NextFunction } from "express";

function requireRole(role: "user" | "admin") {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as any;
    const authUser = authReq.user;
    if (!authUser) {
      return res.status(401).json({
        Message: "Not a user or not found",
      });
    }
    if (authUser.role !== role) {
      return res.status(403).json({
        messagae: "Unauthorized user Access ",
      });
    }
    next();
  };
}

export default requireRole;
