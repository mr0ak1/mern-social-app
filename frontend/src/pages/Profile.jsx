import React, {useState, useEffect} from "react"
import {useParams, useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {userAPI} from "../services/api"

const Profile = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  const {user: currentUser, updateUser} = useAuth()
  const [profile, setProfile] = useState(null)
  const [followData, setFollowData] = useState({followers: [], followings: []})
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState("info")

  const isOwnProfile = !id || id === currentUser?._id

  useEffect(() => {
    fetchProfile()
  }, [id, currentUser])

  const fetchProfile = async () => {
    try {
      let response
      if (isOwnProfile) {
        response = await userAPI.getMyProfile()
      } else {
        response = await userAPI.getUserProfile(id)
      }
      setProfile(response.user)

      if (!isOwnProfile && response.user) {
        setIsFollowing(response.user.followers?.includes(currentUser?._id))
      }

      // Always fetch follow data when profile is loaded
      await fetchFollowData()
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFollowData = async () => {
    try {
      const response = await userAPI.getUserFollowData(id || currentUser._id)
      setFollowData(response)
    } catch (error) {
      console.error("Failed to fetch follow data:", error)
    }
  }

  const handleFollow = async () => {
    try {
      const response = await userAPI.followUser(id)
      setIsFollowing(!isFollowing)
      // Update follow counts
      setProfile((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => f !== currentUser._id)
          : [...(prev.followers || []), currentUser._id],
      }))
      // Refresh follow data to update the detailed lists
      await fetchFollowData()
      await updateUser() // Update current user's following count
    } catch (error) {
      console.error("Failed to follow/unfollow user:", error)
    }
  }

  if (loading) {
    return (
      <div className="container" style={{marginTop: "2rem"}}>
        Loading...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container" style={{marginTop: "2rem"}}>
        User not found
      </div>
    )
  }

  return (
    <div className="container" style={{marginTop: "2rem"}}>
      <div className="post-card" style={{marginBottom: "2rem"}}>
        <div className="post-header">
          {profile.profilePic?.url && (
            <img
              src={profile.profilePic.url}
              alt={profile.name}
              className="profile-pic"
              style={{width: "80px", height: "80px"}}
            />
          )}
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.email}</p>
            <p>
              <strong>Gender:</strong> {profile.gender}
            </p>
            <div style={{display: "flex", gap: "2rem", marginTop: "1rem"}}>
              <span>
                <strong>{profile.followers?.length || 0}</strong> Followers
              </span>
              <span>
                <strong>{profile.followings?.length || 0}</strong> Following
              </span>
            </div>

            {!isOwnProfile && (
              <div style={{display: "flex", gap: "1rem", marginTop: "1rem"}}>
                <button
                  onClick={handleFollow}
                  className={`btn ${
                    isFollowing ? "btn-secondary" : "btn-primary"
                  }`}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
                <button
                  onClick={() =>
                    navigate("/chat", {state: {selectedUser: profile}})
                  }
                  className="btn btn-outline"
                  style={{
                    border: "1px solid #007bff",
                    color: "#007bff",
                    backgroundColor: "transparent",
                  }}
                >
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{marginBottom: "2rem"}}>
        <div style={{display: "flex", gap: "1rem", marginBottom: "1rem"}}>
          <button
            className={`btn ${
              activeTab === "info" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Info
          </button>
          <button
            className={`btn ${
              activeTab === "followers" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("followers")}
          >
            Followers ({followData.followers?.length || 0})
          </button>
          <button
            className={`btn ${
              activeTab === "following" ? "btn-primary" : "btn-secondary"
            }`}
            onClick={() => setActiveTab("following")}
          >
            Following ({followData.followings?.length || 0})
          </button>
        </div>
      </div>

      {activeTab === "info" && (
        <div className="post-card">
          <div className="post-content">
            <h3>Profile Information</h3>
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Gender:</strong> {profile.gender}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {activeTab === "followers" && (
        <div className="post-card">
          <div className="post-content">
            <h3>Followers</h3>
            {followData.followers?.length === 0 ? (
              <p>No followers yet</p>
            ) : (
              followData.followers?.map((follower) => (
                <div
                  key={follower._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => navigate(`/profile/${follower._id}`)}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  {follower.profilePic?.url && (
                    <img
                      src={follower.profilePic.url}
                      alt={follower.name}
                      className="profile-pic"
                    />
                  )}
                  <div>
                    <p>
                      <strong style={{color: "#007bff"}}>{follower.name}</strong>
                    </p>
                    <p>{follower.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "following" && (
        <div className="post-card">
          <div className="post-content">
            <h3>Following</h3>
            {followData.followings?.length === 0 ? (
              <p>Not following anyone yet</p>
            ) : (
              followData.followings?.map((following) => (
                <div
                  key={following._id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                    cursor: "pointer",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    transition: "background-color 0.2s",
                  }}
                  onClick={() => navigate(`/profile/${following._id}`)}
                  onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
                  onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
                >
                  {following.profilePic?.url && (
                    <img
                      src={following.profilePic.url}
                      alt={following.name}
                      className="profile-pic"
                    />
                  )}
                  <div>
                    <p>
                      <strong style={{color: "#007bff"}}>{following.name}</strong>
                    </p>
                    <p>{following.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
