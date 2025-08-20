import { prisma } from "@repo/db/client";
import { Request, Response } from "express";

export async function getChat(req:Request,res:Response){
    console.log("hello")
    const {roomId}= req.params
    const response= await prisma.chat.findMany({
        where:{
            roomId:Number(roomId)
        }
    })
    res.json({data:response})
}