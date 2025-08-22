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



export async function deleteChat(req: Request, res: Response) {
  try {
    const { roomId } = req.params;

    if (!roomId) {
      return res.status(400).json({ error: "Invalid roomId" });
    }

    const deleted = await prisma.chat.deleteMany({
      where: {
        roomId: Number(roomId),
      },
    });

    return res.status(200).json({
      message: "Chats deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chats:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
