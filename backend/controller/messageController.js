import {Chat} from "../model/chatModel.js"
import {Messages} from "../model/messagesModel.js"
import TryCatch from "../utils/tryCatch.js"
import {createNotification} from "./notificationController.js"

export const sendMessage = TryCatch(async (req, res) => {
  const recieverId = req.params.id
  const {message} = req.body

  const senderId = req.user._id

  if (!recieverId) {
    return res.status(400).json({
      message: "Please give reciver id",
    })
  }

  if (!message || message.trim() === "") {
    return res.status(400).json({
      message: "Message text is required",
    })
  }

  let chat = await Chat.findOne({
    users: {$all: [senderId, recieverId]},
  })

  if (!chat) {
    chat = new Chat({
      users: [senderId, recieverId],
      latestMessage: {
        text: message,
        sender: senderId,
      },
    })
    await chat.save()
  }

  const newMessage = new Messages({
    chatId: chat._id,
    sender: senderId,
    text: message,
  })

  await newMessage.save()

  await chat.updateOne({
    latestMessage: {
      text: message,
      sender: senderId,
    },
  })

  await createNotification({
    recipient: recieverId,
    sender: senderId,
    type: "message",
    message: `${req.user.name} sent you a message`,
    chatId: chat._id,
    messageId: newMessage._id,
  })

  res.status(201).json(newMessage)
})

export const getAllMessages = TryCatch(async (req, res) => {
  const {id} = req.params
  const userId = req.user._id

  const chat = await Chat.findOne({
    users: {$all: [userId, id]},
  })

  if (!chat) {
    return res.status(404).json({
      message: "No chat with this user",
    })
  }

  const messages = await Messages.find({
    chatId: chat._id,
  })
    .populate("sender", "name profilePic")
    .sort({createdAt: 1})

  res.json(messages)
})

export const getAllChats = TryCatch(async (req, res) => {
  const userId = req.user._id

  const chats = await Chat.find({
    users: userId,
  })
    .populate("users", "name profilePic email")
    .populate({
      path: "latestMessage.sender",
      select: "name",
    })
    .sort({updatedAt: -1})

  // Add unread message count for each chat
  const chatsWithUnreadCount = await Promise.all(
    chats.map(async (chat) => {
      const otherUser = chat.users.find(
        (user) => user._id.toString() !== userId.toString()
      )

      const unreadCount = await Messages.countDocuments({
        chatId: chat._id,
        sender: otherUser._id,
        seen: false,
      })

      return {
        ...chat.toObject(),
        unreadCount,
      }
    })
  )

  res.json(chatsWithUnreadCount)
})

export const markMessagesAsSeen = TryCatch(async (req, res) => {
  const {id} = req.params // other user's id
  const userId = req.user._id

  const chat = await Chat.findOne({
    users: {$all: [userId, id]},
  })

  if (!chat) {
    return res.status(404).json({
      message: "No chat found with this user",
    })
  }

  const result = await Messages.updateMany(
    {
      chatId: chat._id,
      sender: id,
      seen: false,
    },
    {
      seen: true,
      seenAt: new Date(),
    }
  )

  res.status(200).json({
    message: "Messages marked as seen",
    modifiedCount: result.modifiedCount,
  })
})

export const getTotalUnreadCount = TryCatch(async (req, res) => {
  const userId = req.user._id

  const chats = await Chat.find({
    users: userId,
  })

  let totalUnreadCount = 0

  for (const chat of chats) {
    const otherUser = chat.users.find(
      (user) => user.toString() !== userId.toString()
    )

    const unreadCount = await Messages.countDocuments({
      chatId: chat._id,
      sender: otherUser,
      seen: false,
    })

    totalUnreadCount += unreadCount
  }

  res.status(200).json({
    totalUnreadCount,
  })
})
