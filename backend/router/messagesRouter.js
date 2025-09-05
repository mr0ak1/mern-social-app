import express from "express"
import {isAuth} from "../midlleware/isAuth.js"
import {
  sendMessage,
  getAllMessages,
  getAllChats,
  markMessagesAsSeen,
  getTotalUnreadCount,
} from "../controller/messageController.js"

const router = express.Router()

router.post("/send/:id", isAuth, sendMessage)
router.get("/get/:id", isAuth, getAllMessages)
router.get("/chats", isAuth, getAllChats)
router.put("/seen/:id", isAuth, markMessagesAsSeen)
router.get("/unread-count", isAuth, getTotalUnreadCount)

export default router
