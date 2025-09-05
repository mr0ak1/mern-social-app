import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    chatId: {type: mongoose.Schema.Types.ObjectId, ref: "Chat"},
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    text: String,
    seen: {
      type: Boolean,
      default: false,
    },
    seenAt: {
      type: Date,
      default: null,
    },
  },
  {timestamps: true}
)

export const Messages = mongoose.model("Messages", messageSchema)
