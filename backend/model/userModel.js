import mongoose from "mongoose"

const userSchema = mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    gender: {type: String, enum: ["male", "female"], required: true},
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    followings: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    profilePic: {id: String, url: String},
  },
  {timestamps: true}
)

export const User = mongoose.model("User", userSchema)
