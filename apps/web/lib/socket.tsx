// socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket(roomId: number): Socket {
  if (!socket) {
    const token=localStorage.getItem('authToken')
    socket = io("http://localhost:4000", {
      query: { roomId },
      extraHeaders: {
        Authorization: `Bearer ${token}`,  
      },      
    });
  }
  return socket;
}
