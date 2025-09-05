import {Post} from "../model/postModel.js"
import getDataUrl from "../utils/urlgenerator.js"
import cloudinary from "cloudinary"
import {createNotification} from "./notificationController.js"

export const newPost = async (req, res) => {
  try {
    const {caption} = req.body

    const ownerId = req.user._id

    const file = req.file

    const fileUrl = getDataUrl(file)

    let option

    const type = req.query.type

    if (type === "reel") {
      option = {
        resource_type: "video",
      }
    } else {
      option = {}
    }

    const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option)

    const post = await Post.create({
      caption,
      post: {
        id: myCloud.public_id,
        url: myCloud.secure_url,
      },
      owner: ownerId,
      type,
    })

    res.status(201).json({
      message: "Post created ",
      post,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in creating post",
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      res.status(400).json({
        message: "No post found",
      })
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      res.status(403).json({
        message: "Unauthorized",
      })
    }

    await cloudinary.v2.uploader.destroy(post.post.id)

    await post.deleteOne()

    res.status(200).json({
      message: "Post deleted",
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in deleting post",
    })
  }
}

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        message: "No post found",
      })
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({message: "Unathorized"})
    }

    let {caption} = req.body

    if (caption) {
      post.caption = caption
    }

    await post.save()

    res.status(200).json({
      message: "Updated",
      post,
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({
      message: "Error in updating",
    })
  }
}

export const getAllPost = async (req, res) => {
  try {
    const post = await Post.find({type: "post"})
      .sort({createdAt: -1})
      .populate("owner", "-password")
    const reel = await Post.find({type: "reel"})
      .sort({createdAt: -1})
      .populate("owner", "-password")

    res.status(200).json({
      message: "fETCHED",
      post,
      reel,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in getting posts",
    })
  }
}

export const likeUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("owner", "name")
    console.log(post)

    if (!post) {
      return res.status(400).json({
        message: "No post found",
      })
    }

    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id)
      console.log(index)

      post.likes.splice(index, 1)

      await post.save()

      res.status(200).json({
        message: "UnLiked",
        post,
      })
    } else {
      post.likes.push(req.user._id)

      await post.save()
      if (post.owner._id.toString() !== req.user._id.toString()) {
        await createNotification({
          recipient: post.owner._id,
          sender: req.user._id,
          type: "like",
          message: `${req.user.name} liked your post`,
          postId: post._id,
        })
      }

      res.status(200).json({
        message: "Liked",
        post,
      })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: "Error in liking",
    })
  }
}

export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("owner", "name")

    if (!post) {
      return res.status(400).json({
        message: "No post found",
      })
    }

    const {comment} = req.body

    if (!comment) {
      return res.status(400).json({
        message: "Please enter comment",
      })
    }

    post.comments.push({
      user: req.user._id,
      name: req.user.name,
      comment: req.body.comment,
    })

    await post.save()

    if (post.owner._id.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: post.owner._id,
        sender: req.user._id,
        type: "comment",
        message: `${req.user.name} commented on your post`,
        postId: post._id,
      })
    }

    res.status(200).json({
      message: "COMMENTED",
      post,
    })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: " Error in comment",
    })
  }
}

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) {
      return res.status(400).json({
        message: "No post found",
      })
    }

    if (!req.body.commentId) {
      return res.status(400).json({
        message: "Pls give commentId",
      })
    }

    const commentIndex = post.comments.findIndex(
      (item) => item._id.toString() === req.body.commentId.toString()
    )

    if (commentIndex === -1) {
      return res.status(400).json({
        message: "comment not found",
      })
    }

    const comment = post.comments[commentIndex]

    if (
      post.owner.toString() === req.user._id.toString() ||
      comment.user.toString() === comment.user._id.toString()
    ) {
      post.comments.splice(commentIndex, 1)

      await post.save()

      return res.status(200).json({
        message: "Comment deleted ",
        post,
      })
    } else {
      return res.status(400).json({
        message: "You are not allowed to delete the comment",
      })
    }
  } catch (error) {
    console.log(error.message)

    res.status(500).json({
      message: "Error on delete comment",
    })
  }
}
