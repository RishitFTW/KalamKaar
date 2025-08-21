import { JWT_secret } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


interface MyJwtPayload extends JwtPayload {
  id: number;
}
declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

export function middleware(req: Request, res: Response, next: NextFunction) {
  console.log("aliye re aliye")
  const authHeader = req.headers["authorization"] || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1] || "";

  try {
    const decoded = jwt.verify(token, JWT_secret) as MyJwtPayload;

    if (!decoded?.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    req.userId = decoded.id; 
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

