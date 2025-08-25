import { CreateUserSchema,SignInSchema } from "@repo/common/types";
import { Request, Response } from "express";
import { JWT_secret } from "@repo/backend-common/config";
import jwt from 'jsonwebtoken'

import { prisma } from "@repo/db/client";
export async function createUser(req:Request,res:Response) {
    const userData=req.body;
    const result=CreateUserSchema.safeParse(userData)
    if(!result.success){
        console.log(result)
        res.json({
            message:"Incorrect inputs"
        })
        return;
    }
    const user=await prisma.user.create({
        data:{  email:result.data.email,
                name:result.data.name,
                password:result.data.password
        }
    })
  const token = jwt.sign(
    {id: user.id },
    JWT_secret,
    { expiresIn: "5h" }
  );

  return res.json({
    message: "signed in successful",
    token,
  }); 
}


export async function userSignin(req:Request,res:Response){
    console.log("agya")
  const user = req.body;
  console.log(user)
  const parsed = SignInSchema.safeParse(user);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Incorrect inputs",
      errors: parsed.error,
    });
  }

  const userData = await prisma.user.findFirst({
    where: { email: user.email },
  });

  if (!userData) {
    return res.status(404).json({ message: "User doesn’t exist" });
  }

  if (user.password !== userData.password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { id: userData.id },
    JWT_secret,
    { expiresIn: "5h" }
  );

  return res.json({
    message: "Login successful",
    token,
  });    
}