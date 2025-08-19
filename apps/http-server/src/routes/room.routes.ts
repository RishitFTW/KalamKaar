import { Router } from 'express'
const roomRouter:Router= Router()

roomRouter.get('/')
roomRouter.post('/createRoom')
roomRouter.delete('/:roomId')
roomRouter.put('/:roomId')


export default roomRouter