import React, {useState, useEffect} from "react"
import {useAuth} from "../context/AuthContext"
import {postAPI} from "../services/api"
import PostCard from "../components/PostCard"
import CreatePost from "../components/CreatePost"

const Home = () => {
  const {user} = useAuth()
  const [posts, setPosts] = useState([])
  const [reels, setReels] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts()
      setPosts(response.post || [])
      setReels(response.reel || [])
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePostCreated = () => {
    fetchPosts()
  }

  const handlePostUpdate = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    )
    setReels(
      reels.map((reel) => (reel._id === updatedPost._id ? updatedPost : reel))
    )
  }

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId))
    setReels(reels.filter((reel) => reel._id !== postId))
  }

  if (loading) {
    return (
      <div className="container" style={{marginTop: "2rem"}}>
        Loading...
      </div>
    )
  }

  return (
    <div className="container">
      <div className="feed">
        <div className="posts-container">
          <CreatePost onPostCreated={handlePostCreated} />

          <div style={{marginBottom: "2rem"}}>
            <div style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}>
              <button
                className={`btn ${
                  activeTab === "posts" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts ({posts.length})
              </button>
              <button
                className={`btn ${
                  activeTab === "reels" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setActiveTab("reels")}
              >
                Reels ({reels.length})
              </button>
            </div>
          </div>

          {activeTab === "posts" && (
            <div>
              {posts.length === 0 ? (
                <div
                  style={{textAlign: "center", padding: "2rem", color: "#666"}}
                >
                  No posts yet. Create your first post!
                </div>
              ) : (
                posts.map((post) => {
                  // Ensure post has required properties before rendering
                  if (!post || !post._id || !post.owner) {
                    return null
                  }
                  return (
                    <PostCard
                      key={post._id}
                      post={post}
                      onUpdate={handlePostUpdate}
                      onDelete={handlePostDelete}
                    />
                  )
                })
              )}
            </div>
          )}

          {activeTab === "reels" && (
            <div>
              {reels.length === 0 ? (
                <div
                  style={{textAlign: "center", padding: "2rem", color: "#666"}}
                >
                  No reels yet. Create your first reel!
                </div>
              ) : (
                reels.map((reel) => {
                  // Ensure reel has required properties before rendering
                  if (!reel || !reel._id || !reel.owner) {
                    return null
                  }
                  return (
                    <PostCard
                      key={reel._id}
                      post={reel}
                      onUpdate={handlePostUpdate}
                      onDelete={handlePostDelete}
                    />
                  )
                })
              )}
            </div>
          )}
        </div>

        <div className="sidebar">
          <h3>Welcome, {user?.name}!</h3>
          <div style={{marginTop: "1rem"}}>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Gender:</strong> {user?.gender}
            </p>
            <p>
              <strong>Followers:</strong> {user?.followers?.length || 0}
            </p>
            <p>
              <strong>Following:</strong> {user?.followings?.length || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
