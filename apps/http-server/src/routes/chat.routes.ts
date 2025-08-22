import { Router } from "express";
import { deleteChat, getChat } from "../controllers/chat.controller";
import { middleware } from "../middleware";

const chatRouter:Router= Router()

chatRouter.get('/:roomId',middleware,getChat)
chatRouter.delete('/:roomId',middleware,deleteChat)

export default chatRouter;