import { Router } from "express";
import { getChat } from "../controllers/chat.controller";
const chatRouter:Router= Router()

chatRouter.get('/:roomId',getChat)


export default chatRouter;