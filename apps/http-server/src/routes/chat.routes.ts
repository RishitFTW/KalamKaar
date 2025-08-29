import { Router } from "express";
import { deleteChat, deleteChatbyId, getChat } from "../controllers/chat.controller";
import { middleware } from "../middleware";

const chatRouter:Router= Router()

chatRouter.delete('/:chatId',middleware,deleteChatbyId)
chatRouter.get('/:roomId',middleware,getChat)
chatRouter.delete('/delete/:roomId',middleware,deleteChat)

export default chatRouter;