import { Router } from 'express'
import { createRoom, fetchAllRooms } from '../controllers/room.controllers'
import { middleware } from '../middleware'
const roomRouter:Router= Router()

roomRouter.get('/',middleware,fetchAllRooms)
roomRouter.post('/createRoom',middleware,createRoom)
// roomRouter.delete('/:roomId')
// roomRouter.put('/:roomId')


export default roomRouter