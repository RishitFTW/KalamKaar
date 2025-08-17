import { JWT_secret } from "@repo/backend-common/config";
import { json, NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export function middleware(req:Request,res:Response,next:NextFunction){
    const token= req.headers["authorization"] ?? " "
    const decoded= jwt.verify(token,JWT_secret)
    if(decoded){
        //@ts-ignore
        req.userId=decoded.userid;
        next();
    }
    else{
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}