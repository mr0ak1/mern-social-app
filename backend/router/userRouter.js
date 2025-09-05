import express from "express"
import {isAuth} from "../midlleware/isAuth.js"
import {
  followAndUnfollowUser,
  myProfile,
  updatePassword,
  updateProfile,
  userFollowAndFollowings,
  userProfile,
  searchUsers,
} from "../controller/userController.js"

const router = express.Router()

router.get("/me", isAuth, myProfile)
router.get("/search", isAuth, searchUsers)
router.get("/:id", isAuth, userProfile)
router.post("/:id", isAuth, updatePassword)
router.post("/follow/:id", isAuth, followAndUnfollowUser)
router.get("/followdata/:id", isAuth, userFollowAndFollowings)
router.put("/:id", isAuth, updateProfile)

export default router
