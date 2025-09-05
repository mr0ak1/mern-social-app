import express from "express"
import {isAuth} from "../midlleware/isAuth.js"
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} from "../controller/notificationController.js"

const router = express.Router()

router.get("/", isAuth, getUserNotifications)

router.get("/unread-count", isAuth, getUnreadCount)

router.put("/:id/read", isAuth, markAsRead)

router.put("/mark-all-read", isAuth, markAllAsRead)

router.delete("/:id", isAuth, deleteNotification)

export default router
