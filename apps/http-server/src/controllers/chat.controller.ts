import { prisma } from "@repo/db/client";
import { Request, Response } from "express";

export async function getChat(req:Request,res:Response){
    const {roomId}= req.params
    const response= await prisma.chat.findMany({
        where:{
            roomId:Number(roomId)
        }
    })
    res.json({data:response,user:req.userId})
}

export async function deleteChatbyId(req: Request, res: Response){
  try {
    const chatId= req.params
    if(!chatId){
      res.status(400).json({error:"Invalid chatId"})
    }
    const chat= await prisma.chat.delete({
      where:{
        id:Number(chatId)
      }
    })

    return res.status(200).json({
      message: "Chats deleted successfully",
    });    

  } catch (error) {
    console.error("Error deleting chat:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
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
