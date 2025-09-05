import {User} from "../model/userModel.js"
import getDataUrl from "../utils/urlgenerator.js"
import cloudinary from "cloudinary"
import bcrypt from "bcrypt"
import {createNotification} from "./notificationController.js"

export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      res.status(404).json({
        message: "No user found",
      })
    }

    res.json({
      user,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "server error at my profile",
    })
  }
}

export const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    res.status(200).json({
      user,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in fetching user profile",
    })
  }
}

export const followAndUnfollowUser = async (req, res) => {
  try {
    const loggedInUser = await User.findById(req.user._id)
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({
        message: "No user found",
      })
    }

    if (req.params.id.toString() === loggedInUser._id.toString()) {
      return res.status(403).json({
        message: "You cant follow yourself",
      })
    }

    if (user.followers.includes(loggedInUser._id)) {
      // Unfollow logic
      const indexFollower = user.followers.indexOf(loggedInUser._id)
      user.followers.splice(indexFollower, 1)

      const indexFollowing = loggedInUser.followings.indexOf(user._id)
      loggedInUser.followings.splice(indexFollowing, 1)

      await loggedInUser.save()
      await user.save()

      await createNotification({
        recipient: user._id,
        sender: loggedInUser._id,
        type: "unfollow",
        message: `${loggedInUser.name} unfollowed you`,
      })

      res.status(200).json({
        message: "UNFOLLOWED",
      })
    } else {
      loggedInUser.followings.push(user._id)
      user.followers.push(loggedInUser._id)

      await loggedInUser.save()
      await user.save()

      await createNotification({
        recipient: user._id,
        sender: loggedInUser._id,
        type: "follow",
        message: `${loggedInUser.name} started following you`,
      })

      res.status(200).json({
        message: "FOLLOWED",
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Server error in follow and unfollow",
    })
  }
}

export const userFollowAndFollowings = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers", "-password")
      .populate("followings", "-password")

    const followers = user.followers
    const followings = user.followings

    res.json({
      followers,
      followings,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in fetching user profile",
    })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    const {name} = req.body
    if (name) {
      user.name = name
    }

    const file = req.file

    if (file) {
      const fileUrl = getDataUrl(file)

      await cloudinary.v2.uploader.destroy(user.profilePic.id)

      const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content)

      user.profilePic.id = myCloud.public_id
      user.profilePic.url = myCloud.secure_url
    }

    await user.save()

    res.status(200).json({
      message: "Profile updated",
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in update",
    })
  }
}

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    const {oldPassword, newPassword} = req.body

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Please provide new and old password",
      })
    }

    const comparePassword = await bcrypt.compare(oldPassword, user.password)

    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect old password",
      })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.status(200).json({
      message: "Password updated successfully",
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in update password",
    })
  }
}

export const searchUsers = async (req, res) => {
  try {
    const {query} = req.query

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
      })
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            {name: {$regex: query, $options: "i"}},
            {email: {$regex: query, $options: "i"}},
          ],
        },
        {_id: {$ne: req.user._id}},
      ],
    })
      .select("-password")
      .limit(20)

    res.status(200).json({
      message: "Users found",
      users,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in searching users",
    })
  }
}
