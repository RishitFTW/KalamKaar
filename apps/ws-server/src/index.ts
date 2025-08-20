import { Server } from 'socket.io'
import { JWT_secret } from '@repo/backend-common/config'
import { prisma } from "@repo/db/client";
import jwt from "jsonwebtoken"

const io= new Server(4000,{
  cors:{
    origin:"http://localhost:3000"
  }
})

function checkUser(token:string){
  try {
    const decoded = jwt.verify(token, JWT_secret);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded.userId;
  } catch(e) {
    return null;
  }
  return null;
}

io.on("connection",(socket)=>{
  const room= socket.handshake.query.roomId;
  if(!room){
    console.log("disconnect")
    socket.disconnect(true);
    return;
  }

  socket.join(room);
  console.log(`user with ${socket.id} has joined room: ${room}`)

  socket.on('msg',async(messageData)=>{
    if(messageData.type=='rectangle'){
       await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.startingX,
          x2:messageData.startingY,
          width:messageData.width,
          height:messageData.height,
          roomId:1,
          userId:1
        }
       })
    }
    else if(messageData.type=='pen'){
       await prisma.chat.create({
        data:{
          type:messageData.type,
          points:messageData.points,
          width:messageData.lineWidth,
          roomId:1,
          userId:1
        }
       })      
    }
    else if(messageData.type=='icon'){
       await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.centerX,
          y1:messageData.centerY,
          width:messageData.width,
          height:messageData.height,
          radius:messageData.radius,
          roomId:1,
          userId:1
        }
       })       
    }
    else if(messageData.type=='ellipse'){
       await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.centerX,
          y1:messageData.centerY,
          x2:messageData.radiusX,
          y2:messageData.radiusY,
          roomId:1,
          userId:1
        }
       })      
    }
    else if(messageData.type=='line'){
       await prisma.chat.create({
        data:{
          type:messageData.type,
          x1:messageData.startingX,
          y1:messageData.startingY,
          x2:messageData.endingX,
          y2:messageData.endingY,
          roomId:1,
          userId:1
        }
       })       
    }
    socket.broadcast.to(room).emit("recieve",messageData);
  })
})