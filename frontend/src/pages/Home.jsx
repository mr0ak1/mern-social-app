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
    <div className="container mobile-home">
      <div className="feed">
        <div className="posts-container">
          <CreatePost onPostCreated={handlePostCreated} />

          <div className="tab-container" style={{marginBottom: "2rem"}}>
            <div
              className="tab-buttons"
              style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}
            >
              <button
                className={`btn mobile-tab-btn ${
                  activeTab === "posts" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setActiveTab("posts")}
              >
                Posts ({posts.length})
              </button>
              <button
                className={`btn mobile-tab-btn ${
                  activeTab === "reels" ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => setActiveTab("reels")}
              >
                Reels ({reels.length})
              </button>
            </div>
          </div>

          {activeTab === "posts" && (
            <div className="posts-grid">
              {posts.length === 0 ? (
                <div
                  className="empty-state"
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
            <div className="reels-grid">
              {reels.length === 0 ? (
                <div
                  className="empty-state"
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

        <div className="sidebar mobile-sidebar">
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

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-home {
            padding: 1rem 0.5rem !important;
          }

          .feed {
            gap: 1rem !important;
          }

          .mobile-sidebar {
            order: -1 !important;
            position: static !important;
            margin-bottom: 1rem !important;
            padding: 1rem !important;
          }

          .tab-container {
            margin-bottom: 1rem !important;
          }

          .tab-buttons {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }

          .mobile-tab-btn {
            width: 100% !important;
            padding: 0.75rem !important;
          }

          .empty-state {
            padding: 1.5rem !important;
            margin: 0.5rem !important;
            background: white !important;
            border-radius: 8px !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-home {
            padding: 0.5rem 0.25rem !important;
          }

          .mobile-sidebar {
            padding: 0.8rem !important;
          }

          .mobile-tab-btn {
            padding: 0.6rem !important;
            font-size: 0.9rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Home
