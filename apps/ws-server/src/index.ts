import { Server, Socket } from 'socket.io'
import { JWT_secret } from '@repo/backend-common/config'
import { prisma } from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken"
interface MyJwtPayload {
  id: number;
}
interface AuthenticatedSocket extends Socket {
  userId?: number;
}

const io= new Server(4000,{
  cors:{
    origin:"http://localhost:3000"
  }
})


io.use((socket: AuthenticatedSocket, next) => {
  try {
    const authHeader = socket.handshake.headers.authorization;
    if (!authHeader) {
      return next(new Error("No token found"));
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new Error("No token found"));
    }

    const decoded = jwt.verify(token, JWT_secret) as MyJwtPayload;

    if (!decoded?.id) {
      return next(new Error("Invalid token payload"));
    }

    socket.userId = decoded.id; 
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});
io.on("connection",(socket: AuthenticatedSocket)=>{
  const room= socket.handshake.query.roomId;
  if(!room){
    console.log("disconnect")
    socket.disconnect(true);
    return;
  }

  socket.join(room);
  console.log(`user with ${socket.id} has joined room: ${room}`)

  socket.on('msg',async(messageData)=>{
     if (!socket.userId) {
       console.error("Authentication error: User ID not found on socket.");
      return; 
    }
    let shapeData
    if(messageData.type=='rectangle'){
       shapeData= await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.x1,
          y1:messageData.y1,
          width:messageData.width,
          height:messageData.height,
          roomId:Number(room),
          userId:socket.userId
        }
       })

    }
    else if(messageData.type=='pen'){
      shapeData= await prisma.chat.create({
        data:{
          type:messageData.type,
          points:messageData.points,
          width:messageData.width,
          roomId:Number(room),
          userId:socket.userId
        }
       })      
    }
    else if(messageData.type=='icon'){
      shapeData= await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.x1,
          y1:messageData.y1,
          width:messageData.width,
          height:messageData.height,
          radius:messageData.radius,
          roomId:Number(room),
          userId:socket.userId
        }
       })       
    }
    else if(messageData.type=='ellipse'){
       shapeData=await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.x1,
          y1:messageData.y1,
          x2:messageData.x2,
          y2:messageData.y2,
          roomId:Number(room),
          userId:socket.userId
        }
       })      
    }
    else if(messageData.type=='line'){
      shapeData= await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.x1,
          y1:messageData.y1,
          x2:messageData.x2,
          y2:messageData.y2,
          roomId:Number(room),
          userId:socket.userId
        }
       })       
    }
    socket.broadcast.to(room).emit("recieve",messageData);
  })
  socket.on('remove',async(Shape)=>{
    console.log("agya")
    console.log(Shape)
  const userId = Number(Shape.id);

  const latestChat = await prisma.chat.findFirst({
    where: { userId: userId },
    orderBy: { createdAt: "desc" },
  });

    if (!latestChat) {
      return;
    }    
    await prisma.chat.delete({
      where: { id: latestChat.id },
    });    
    socket.broadcast.to(room).emit("removeShape",Shape);
  })
})