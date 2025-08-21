import { Router } from "express";
import { getChat } from "../controllers/chat.controller";
import { middleware } from "../middleware";

const chatRouter:Router= Router()

chatRouter.get('/:roomId',middleware,getChat)


export default chatRouter;