import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "supersecretaccess";

export interface AuthRequest extends Request {
  user?: { userId: number; role: string };
}

export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "No token provided" } });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as {
      userId: number;
      role: string;
    };
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: { code: "UNAUTHORIZED", message: "Invalid token" } });
  }
}

// Role-based authorization middleware
export function authorizeRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          error: { code: "FORBIDDEN", message: "Insufficient permissions" },
        });
    }
    next();
  };
}
