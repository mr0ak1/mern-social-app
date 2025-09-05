import React, {useState} from "react"
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {postAPI} from "../services/api"

const PostCard = ({post, onUpdate, onDelete}) => {
  const {user} = useAuth()
  const navigate = useNavigate()
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  // Add safety checks
  if (!post || !post.owner || !user) {
    return null
  }

  const isOwner = user?._id === post.owner._id
  const isLiked = post.likes?.includes(user?._id)

  const handleLike = async () => {
    try {
      const response = await postAPI.likePost(post._id)
      onUpdate(response.post)
    } catch (error) {
      console.error("Failed to like post:", error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const response = await postAPI.commentOnPost(post._id, newComment)
      onUpdate(response.post)
      setNewComment("")
    } catch (error) {
      console.error("Failed to comment:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await postAPI.deleteComment(post._id, commentId)
      onUpdate(response.post)
    } catch (error) {
      console.error("Failed to delete comment:", error)
    }
  }

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postAPI.deletePost(post._id)
        onDelete(post._id)
      } catch (error) {
        console.error("Failed to delete post:", error)
      }
    }
  }

  const handleProfileClick = () => {
    navigate(`/profile/${post.owner._id}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div 
          style={{
            display: "flex", 
            alignItems: "center", 
            flex: 1, 
            cursor: "pointer"
          }}
          onClick={handleProfileClick}
        >
          {post.owner.profilePic?.url && (
            <img
              src={post.owner.profilePic.url}
              alt={post.owner.name}
              className="profile-pic"
            />
          )}
          <div style={{flex: 1}}>
            <h4 style={{margin: 0, color: "#007bff"}}>{post.owner.name}</h4>
            <p style={{color: "#666", fontSize: "0.9rem", margin: 0}}>
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={handleDeletePost}
            className="btn btn-danger"
            style={{padding: "0.25rem 0.5rem", fontSize: "0.8rem"}}
          >
            Delete
          </button>
        )}
      </div>

      {post.caption && (
        <div className="post-content">
          <p>{post.caption}</p>
        </div>
      )}

      {post.post?.url && (
        <div>
          {post.type === "reel" ? (
            <video
              src={post.post.url}
              className="post-image"
              controls
              style={{width: "100%", maxHeight: "500px"}}
            />
          ) : (
            <img
              src={post.post.url}
              alt="Post content"
              className="post-image"
            />
          )}
        </div>
      )}

      <div className="post-actions">
        <button
          onClick={handleLike}
          className={`btn ${isLiked ? "btn-primary" : "btn-secondary"}`}
        >
          {isLiked ? "❤️" : "🤍"} {post.likes?.length || 0} Likes
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="btn btn-secondary"
        >
          💬 {post.comments?.length || 0} Comments
        </button>
      </div>

      {showComments && (
        <div style={{padding: "1rem", borderTop: "1px solid #eee"}}>
          <form onSubmit={handleComment} style={{marginBottom: "1rem"}}>
            <div style={{display: "flex", gap: "0.5rem"}}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !newComment.trim()}
              >
                {loading ? "..." : "Post"}
              </button>
            </div>
          </form>

          <div>
            {post.comments?.map((comment) => (
              <div
                key={comment._id}
                style={{
                  marginBottom: "0.5rem",
                  padding: "0.5rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                }}
              >
                <div>
                  <strong 
                    style={{
                      color: "#007bff", 
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/profile/${comment.user}`)
                    }}
                  >
                    {comment.name}
                  </strong>
                  <p style={{margin: "0.25rem 0 0 0"}}>{comment.comment}</p>
                </div>
                {(comment.user === user?._id || isOwner) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#dc3545",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostCard
