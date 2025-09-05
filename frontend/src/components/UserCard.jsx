import React, {useState, useEffect} from "react"
import {Link} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {userAPI} from "../services/api"

const UserCard = ({user}) => {
  const {user: currentUser, updateUser} = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Update following status when currentUser data changes
  useEffect(() => {
    if (currentUser?.followings) {
      setIsFollowing(currentUser.followings.includes(user._id))
    }
  }, [currentUser, user._id])

  const handleFollow = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setLoading(true)
    try {
      await userAPI.followUser(user._id)
      setIsFollowing(!isFollowing)
      // Update the current user's following count
      await updateUser()
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #eee",
        transition: "background-color 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
      onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
    >
      <Link
        to={`/profile/${user._id}`}
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          color: "inherit",
          flex: 1,
        }}
      >
        {user.profilePic?.url && (
          <img
            src={user.profilePic.url}
            alt={user.name}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "1rem",
            }}
          />
        )}
        <div style={{flex: 1}}>
          <h4 style={{margin: "0 0 0.25rem 0", fontSize: "1rem"}}>
            {user.name}
          </h4>
          <p style={{margin: 0, color: "#666", fontSize: "0.9rem"}}>
            {user.email}
          </p>
          <div style={{display: "flex", gap: "1rem", marginTop: "0.25rem"}}>
            <span style={{fontSize: "0.8rem", color: "#888"}}>
              {user.followers?.length || 0} followers
            </span>
            <span style={{fontSize: "0.8rem", color: "#888"}}>
              {user.followings?.length || 0} following
            </span>
          </div>
        </div>
      </Link>

      <button
        onClick={handleFollow}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "20px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "0.9rem",
          fontWeight: "500",
          transition: "all 0.2s",
          backgroundColor: isFollowing ? "#6c757d" : "#007bff",
          color: "white",
          opacity: loading ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.opacity = "0.8"
          }
        }}
        onMouseLeave={(e) => {
          if (!loading) {
            e.target.style.opacity = "1"
          }
        }}
      >
        {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
      </button>
    </div>
  )
}

export default UserCard
