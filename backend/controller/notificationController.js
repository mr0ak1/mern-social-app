import {Notification} from "../model/notificationModel.js"
import TryCatch from "../utils/tryCatch.js"

export const getUserNotifications = TryCatch(async (req, res) => {
  const userId = req.user._id
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20

  const notifications = await Notification.find({recipient: userId})
    .populate("sender", "name profilePic")
    .populate("postId", "content")
    .populate("chatId")
    .populate("messageId", "text")
    .sort({createdAt: -1})
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const totalNotifications = await Notification.countDocuments({
    recipient: userId,
  })
  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    read: false,
  })

  res.status(200).json({
    notifications,
    unreadCount,
    totalPages: Math.ceil(totalNotifications / limit),
    currentPage: page,
  })
})

export const markAsRead = TryCatch(async (req, res) => {
  const {id} = req.params
  const userId = req.user._id

  const notification = await Notification.findOneAndUpdate(
    {_id: id, recipient: userId},
    {read: true},
    {new: true}
  )

  if (!notification) {
    return res.status(404).json({
      message: "Notification not found",
    })
  }

  res.status(200).json({
    message: "Notification marked as read",
    notification,
  })
})

export const markAllAsRead = TryCatch(async (req, res) => {
  const userId = req.user._id

  await Notification.updateMany({recipient: userId, read: false}, {read: true})

  res.status(200).json({
    message: "All notifications marked as read",
  })
})

export const deleteNotification = TryCatch(async (req, res) => {
  const {id} = req.params
  const userId = req.user._id

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: userId,
  })

  if (!notification) {
    return res.status(404).json({
      message: "Notification not found",
    })
  }

  res.status(200).json({
    message: "Notification deleted successfully",
  })
})

export const createNotification = async (data) => {
  try {
    const {recipient, sender, type, message, postId, chatId, messageId} = data

    if (sender.toString() === recipient.toString()) {
      return null
    }

    if (type === "message") {
      const existingMessageNotification = await Notification.findOne({
        recipient,
        sender,
        type: "message",
        read: false,
        createdAt: {
          $gte: new Date(Date.now() - 5 * 60 * 1000),
        },
      })

      if (existingMessageNotification) {
        existingMessageNotification.message = message
        existingMessageNotification.chatId = chatId
        existingMessageNotification.messageId = messageId
        existingMessageNotification.createdAt = new Date()
        await existingMessageNotification.save()
        return existingMessageNotification
      }
    } else {
      const existingNotification = await Notification.findOne({
        recipient,
        sender,
        type,
        postId: postId || null,
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      })

      if (existingNotification) {
        existingNotification.message = message
        existingNotification.read = false
        existingNotification.createdAt = new Date()
        await existingNotification.save()
        return existingNotification
      }
    }

    const notification = new Notification({
      recipient,
      sender,
      type,
      message,
      postId,
      chatId,
      messageId,
    })

    await notification.save()
    return notification
  } catch (error) {
    console.error("Error creating notification:", error)
    return null
  }
}

export const getUnreadCount = TryCatch(async (req, res) => {
  const userId = req.user._id

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    read: false,
  })

  res.status(200).json({
    unreadCount,
  })
})
