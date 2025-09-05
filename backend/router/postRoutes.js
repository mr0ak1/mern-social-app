import express from "express"
import {isAuth} from "../midlleware/isAuth.js"
import {
  commentOnPost,
  deleteComment,
  deletePost,
  getAllPost,
  likeUnlikePost,
  newPost,
  updatePost,
} from "../controller/postController.js"
import uploadFile from "../midlleware/multer.js"

const router = express.Router()

router.post("/new", isAuth, uploadFile, newPost)
router.delete("/:id", isAuth, deletePost)
router.put("/:id", isAuth, updatePost)
router.get("/all", isAuth, getAllPost)

router.post("/like/:id", isAuth, likeUnlikePost)
router.post("/comment/:id", isAuth, commentOnPost)
router.delete("/comment/:id", isAuth, deleteComment)

export default router
