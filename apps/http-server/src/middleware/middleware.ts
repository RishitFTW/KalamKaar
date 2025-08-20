import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_secret } from "@repo/backend-common/config";


export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"] ?? "";

    const decoded = jwt.verify(token, JWT_secret);

    if (decoded) {
        // @ts-ignore: TODO: Fix this
        req.userId = decoded.userId;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        })
    }
}