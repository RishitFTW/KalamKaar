import { Server } from 'socket.io'
import { JWT_secret } from '@repo/backend-common/config'
import jwt from "jsonwebtoken"
const io= new Server(4000)

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
    socket.disconnect(true);
    return;
  }

  socket.join(room);
  console.log(`user with ${socket.id} has joined room: ${room}`)

  socket.on('msg',(messageData)=>{
    socket.broadcast.to(room).emit("recieve",messageData);
  })
})