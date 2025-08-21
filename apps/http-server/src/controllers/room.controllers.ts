import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import { prisma } from "@repo/db/client";

export async function createRoom(req:Request,res:Response){
  console.log("hogya confirm")
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

export async function fetchAllRooms(req:Request,res:Response){
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    // Find rooms where user is admin or member
    const rooms = await prisma.room.findMany({
      where: {
        OR: [
          { adminId: userId }, // User is the admin
          { members: { some: { userId: userId } } }, // User is a member
        ],
      },
      include: {
        admin: { select: { id: true, name: true, email: true } },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        chats: {
          select: { id: true, type: true, createdAt: true },
        },
      },
    });

    res.json({ 
      userId, 
      rooms 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};


export async function deleteRoom(req: Request, res: Response) {
  const { roomId } = req.params;
  console.log("yha aya")
  try {
    const room = await prisma.room.delete({
      where: { id: Number(roomId) }
    });

    return res.status(200).json({
      message: "Room deleted successfully",
      room,
    });
  } catch (error: any) {
    console.error("Error deleting room:", error);

    return res.status(400).json({
      message: "Failed to delete room",
      error: error.message,
    });
  }
}