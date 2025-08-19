import { JWT_secret } from "@repo/backend-common/config";
import { json, NextFunction,Request,Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export function middleware(req:Request,res:Response,next:NextFunction){
  const authHeader = req.headers["authorization"] || "";
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
    const decoded= jwt.verify(token as string,JWT_secret)    
    try {
        const decoded= jwt.verify(token as string ,JWT_secret)   
    } catch (error) {
        
    }
    if(decoded){
        console.log("point2")
        //@ts-ignore
        req.userId=decoded.id;
        next();
    }
    else{   
        res.status(403).json({
            message:"Unauthorized"
        })
    }
}