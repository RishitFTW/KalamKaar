import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";

export async function createRoom(req:Request,res:Response){
    const parsedData = CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    
    const userId = req.userId;

    try {
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: Number(userId)
            }
        })

        res.json({
            roomId: room.id
        })
    } catch(e) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }   
}