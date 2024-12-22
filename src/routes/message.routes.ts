import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { messageController } from "../controllers/message.controller";

const router = Router();

router.use(auth);

router.get("/chats", messageController.getChats);
router.get("/chats/:chatId/messages", messageController.getChatMessages);
router.post("/chats/:chatId/messages", messageController.sendMessage);
router.delete("/messages/:id", messageController.deleteMessage);

export default router;
