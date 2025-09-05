import React from "react"
import {Link, useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {useUnread} from "../context/UnreadContext.jsx"
import SearchBar from "./SearchBar"
import NotificationBell from "./NotificationBell"

const Navbar = () => {
  const {user, logout} = useAuth()
  const {unreadCount} = useUnread()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            SocialApp
          </Link>

          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              maxWidth: "500px",
              margin: "0 2rem",
            }}
          >
            <SearchBar />
          </div>

          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/chat" style={{position: "relative"}}>
              Messages
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    backgroundColor: "#ff4757",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    minWidth: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                  }}
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
            <Link to="/profile">Profile</Link>

            <div style={{display: "flex", alignItems: "center", gap: "1rem"}}>
              <NotificationBell />
              {user?.profilePic?.url && (
                <img
                  src={user.profilePic.url}
                  alt={user.name}
                  className="profile-pic"
                  style={{width: "32px", height: "32px"}}
                />
              )}
              <span>Hi, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{padding: "0.5rem 1rem"}}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
