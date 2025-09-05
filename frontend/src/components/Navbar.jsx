import React, {useState} from "react"
import {Link, useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {useUnread} from "../context/UnreadContext.jsx"
import SearchBar from "./SearchBar"
import NotificationBell from "./NotificationBell"

const Navbar = () => {
  const {user, logout} = useAuth()
  const {unreadCount} = useUnread()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          {/* Mobile Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Link to="/" className="logo">
              SocialApp
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              style={{
                display: "none",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
                padding: "0.5rem",
              }}
              className="mobile-menu-btn"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>

            {/* Desktop Navigation */}
            <div
              className="desktop-nav"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flex: 1,
              }}
            >
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

                <div
                  style={{display: "flex", alignItems: "center", gap: "1rem"}}
                >
                  <NotificationBell />
                  {user?.profilePic?.url && (
                    <img
                      src={user.profilePic.url}
                      alt={user.name}
                      className="profile-pic"
                      style={{width: "32px", height: "32px"}}
                    />
                  )}
                  <span className="desktop-only">Hi, {user?.name}</span>
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

          {/* Mobile Menu */}
          <div
            className="mobile-menu"
            style={{
              display: isMobileMenuOpen ? "flex" : "none",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              width: "100%",
            }}
          >
            <SearchBar />

            <div
              style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}
            >
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/search" onClick={() => setIsMobileMenuOpen(false)}>
                Search
              </Link>
              <Link
                to="/chat"
                style={{position: "relative"}}
                onClick={() => setIsMobileMenuOpen(false)}
              >
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
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                Profile
              </Link>
            </div>

            <div
              className="mobile-user-section"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "1rem",
                padding: "1rem",
                backgroundColor: "white",
                borderRadius: "8px",
              }}
            >
              <div
                style={{display: "flex", alignItems: "center", gap: "0.5rem"}}
              >
                <NotificationBell />
                {user?.profilePic?.url && (
                  <img
                    src={user.profilePic.url}
                    alt={user.name}
                    className="profile-pic"
                    style={{width: "32px", height: "32px"}}
                  />
                )}
                <span style={{fontSize: "0.9rem"}}>Hi, {user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{padding: "0.4rem 0.8rem", fontSize: "0.9rem"}}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
          .nav-content {
            flex-direction: column;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
