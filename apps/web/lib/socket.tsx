// socket.ts
import { io, Socket } from "socket.io-client";
const SOCKET_URL=process.env.NEXT_PUBLIC_SOCKET_URL
let socket: Socket | null = null;

export function getSocket(roomId: number): Socket {
  if (!socket) {
    const token=localStorage.getItem('authToken')
    socket = io( `${SOCKET_URL}`, {
      query: { roomId },
      extraHeaders: {
        Authorization: `Bearer ${token}`,  
      },      
    });
  }
  return socket;
}
