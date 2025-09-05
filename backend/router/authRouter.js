import express from "express"
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controller/authController.js"
import uploadFile from "../midlleware/multer.js"

const router = express.Router()

router.post("/register", uploadFile, registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)

export default router
