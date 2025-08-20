import { Router } from 'express'
import { createRoom } from '../controllers/room.controllers'
import { middleware } from '../middleware'
const roomRouter:Router= Router()


roomRouter.post('/createRoom',middleware,createRoom)
// roomRouter.delete('/:roomId')
// roomRouter.put('/:roomId')


export default roomRouter