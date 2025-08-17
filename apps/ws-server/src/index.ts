import { Server } from 'socket.io'
import { JWT_secret } from '@repo/backend-common/config'
const io= new Server(4000)