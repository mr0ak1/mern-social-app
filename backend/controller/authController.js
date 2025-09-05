import mongoose from "mongoose"
import {User} from "../model/userModel.js"
import bcrypt, {compare} from "bcrypt"
import getDataUrl from "../utils/urlgenerator.js"
import cloudinary from "cloudinary"
import generateToken from "../utils/generateToken.js"

export const registerUser = async (req, res) => {
  try {
    const {name, email, gender, password} = req.body
    const file = req.file

    if (!name || !email || !password || !gender || !file) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    let user = await User.findOne({email})

    if (user) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const fileUrl = getDataUrl(file)

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content)

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      gender,
      profilePic: {
        url: myCloud.secure_url,
        id: myCloud.public_id,
      },
    })
    generateToken(user._id, res)

    res.status(201).json({
      message: "User Created",
      user,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({message: "Server error"})
  }
}

export const loginUser = async (req, res) => {
  try {
    const {email, password} = req.body
    const user = await User.findOne({email})

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const comparePassword = await bcrypt.compare(password, user.password)

    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect password",
      })
    }

    generateToken(user._id, res)

    res.status(201).json({
      message: "Logged in succesfully",
      user,
    })

    ////
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Server Error",
    })
  }
}

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    res.status(200).json({
      message: "Logout Succesfully",
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Server Error",
    })
  }
}
