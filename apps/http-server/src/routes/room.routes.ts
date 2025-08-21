import { Router } from 'express'
import { addMember, createRoom, deleteRoom, fetchAllRooms } from '../controllers/room.controllers'
import { middleware } from '../middleware'
const roomRouter:Router= Router()

roomRouter.get('/', middleware, fetchAllRooms)
roomRouter.post('/createRoom', middleware, createRoom)
roomRouter.post('/:roomId', middleware, addMember)
roomRouter.delete('/:roomId', middleware, deleteRoom)




export default roomRouter