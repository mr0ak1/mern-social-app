import React, {useState, useEffect} from "react"
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
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest(".navbar")) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container">
        <div className="nav-content">
          <div className="nav-header">
            <Link to="/" className="logo" onClick={closeMobileMenu}>
              <span className="logo-icon">📱</span>
              <span className="logo-text">SocialApp</span>
            </Link>

            <div className="desktop-nav">
              <div className="search-container">
                <SearchBar />
              </div>

              <div className="nav-links">
                <Link to="/" className="nav-link">
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Home</span>
                </Link>
                <Link to="/search" className="nav-link">
                  <span className="nav-icon">🔍</span>
                  <span className="nav-text">Search</span>
                </Link>
                <Link to="/chat" className="nav-link message-link">
                  <span className="nav-icon">💬</span>
                  <span className="nav-text">Messages</span>
                  {unreadCount > 0 && (
                    <span className="unread-badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="nav-link">
                  <span className="nav-icon">👤</span>
                  <span className="nav-text">Profile</span>
                </Link>
              </div>

              <div className="user-section">
                <NotificationBell />
                {user?.profilePic?.url && (
                  <img
                    src={user.profilePic.url}
                    alt={user.name}
                    className="profile-pic"
                  />
                )}
                <span className="user-greeting">Hi, {user?.name}</span>
                <button onClick={handleLogout} className="btn btn-logout">
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-btn"
              aria-label="Toggle mobile menu"
            >
              <span className={`hamburger ${isMobileMenuOpen ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="mobile-overlay" onClick={closeMobileMenu}></div>
          )}

          {/* Mobile Menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? "active" : ""}`}>
            <div className="mobile-menu-content">
              {/* Mobile Search */}
              <div className="mobile-search-section">
                <SearchBar />
              </div>

              {/* Mobile Navigation Links */}
              <div className="mobile-nav-links">
                <Link
                  to="/"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">🏠</span>
                  <span className="nav-text">Home</span>
                </Link>
                <Link
                  to="/search"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">🔍</span>
                  <span className="nav-text">Search</span>
                </Link>
                <Link
                  to="/chat"
                  className="mobile-nav-link message-link"
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">💬</span>
                  <span className="nav-text">Messages</span>
                  {unreadCount > 0 && (
                    <span className="unread-badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="mobile-nav-link"
                  onClick={closeMobileMenu}
                >
                  <span className="nav-icon">👤</span>
                  <span className="nav-text">Profile</span>
                </Link>
              </div>

              {/* Mobile User Section */}
              <div className="mobile-user-section">
                <div className="user-info">
                  <NotificationBell />
                  {user?.profilePic?.url && (
                    <img
                      src={user.profilePic.url}
                      alt={user.name}
                      className="profile-pic"
                    />
                  )}
                  <span className="user-name">Hi, {user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-logout mobile"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .navbar.scrolled {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .nav-content {
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .nav-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: #007bff;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .logo:hover {
          color: #0056b3;
        }

        .logo-icon {
          font-size: 1.8rem;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
          justify-content: space-between;
          margin-left: 2rem;
        }

        .search-container {
          flex: 1;
          max-width: 500px;
          margin: 0 1rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          text-decoration: none;
          color: #333;
          transition: all 0.3s ease;
          position: relative;
          font-weight: 500;
        }

        .nav-link:hover {
          background-color: #f8f9fa;
          color: #007bff;
          transform: translateY(-1px);
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .message-link {
          position: relative;
        }

        .unread-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: linear-gradient(135deg, #ff4757, #ff3742);
          color: white;
          border-radius: 50%;
          padding: 2px 6px;
          font-size: 0.7rem;
          font-weight: bold;
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          animation: pulse 2s infinite;
          box-shadow: 0 2px 4px rgba(255, 71, 87, 0.4);
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .profile-pic {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e9ecef;
          transition: border-color 0.3s ease;
        }

        .profile-pic:hover {
          border-color: #007bff;
        }

        .user-greeting {
          font-weight: 500;
          color: #333;
        }

        .btn-logout {
          background: linear-gradient(135deg, #6c757d, #5a6268);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .btn-logout:hover {
          background: linear-gradient(135deg, #5a6268, #495057);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background-color 0.3s ease;
          position: relative;
          z-index: 1001;
        }

        .mobile-menu-btn:hover {
          background-color: #f8f9fa;
        }

        .hamburger {
          width: 24px;
          height: 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hamburger span {
          display: block;
          height: 2px;
          width: 100%;
          background-color: #333;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translate(7px, -6px);
        }

        .mobile-overlay {
          display: none;
        }

        .mobile-menu {
          display: none;
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }

          .mobile-menu-btn {
            display: block !important;
          }

          .nav-header {
            padding: 0.75rem 0;
          }

          .logo {
            font-size: 1.3rem;
          }

          .logo-text {
            display: none;
          }

          .mobile-overlay {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }

          .mobile-menu {
            display: block;
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: white;
            z-index: 1000;
            transition: right 0.3s ease;
            box-shadow: -4px 0 12px rgba(0, 0, 0, 0.15);
          }

          .mobile-menu.active {
            right: 0;
          }

          .mobile-menu.active ~ .mobile-overlay {
            opacity: 1;
            visibility: visible;
          }

          .mobile-menu-content {
            padding: 5rem 0 2rem 0;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .mobile-search-section {
            padding: 0 1.5rem;
            margin-bottom: 2rem;
          }

          .mobile-nav-links {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            padding: 0 1rem;
          }

          .mobile-nav-link {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1rem;
            border-radius: 12px;
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: all 0.3s ease;
            margin: 0 0.5rem;
            position: relative;
            min-height: 44px;
          }

          .mobile-nav-link:hover,
          .mobile-nav-link:active {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            color: #007bff;
            transform: translateX(4px);
          }

          .mobile-nav-link .nav-icon {
            font-size: 1.3rem;
            width: 24px;
            text-align: center;
          }

          .mobile-nav-link .nav-text {
            font-size: 1rem;
          }

          .mobile-user-section {
            padding: 1.5rem;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
            margin-top: auto;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            margin-bottom: 1rem;
          }

          .user-info .profile-pic {
            width: 36px;
            height: 36px;
          }

          .user-name {
            font-weight: 500;
            color: #333;
            font-size: 0.95rem;
          }

          .btn-logout.mobile {
            width: 100%;
            padding: 0.75rem;
            font-size: 1rem;
            min-height: 44px;
            border-radius: 12px;
          }
        }

        @media (max-width: 480px) {
          .mobile-menu {
            width: 100vw;
            right: -100vw;
          }

          .container {
            padding: 0 1rem;
          }

          .nav-header {
            padding: 0.5rem 0;
          }

          .logo {
            font-size: 1.2rem;
          }

          .mobile-menu-content {
            padding-top: 4rem;
          }
        }

        @media (max-width: 1024px) and (min-width: 769px) {
          .search-container {
            max-width: 400px;
          }

          .nav-links {
            gap: 1rem;
          }

          .nav-link {
            padding: 0.6rem 0.8rem;
          }

          .nav-text {
            font-size: 0.9rem;
          }

          .user-greeting {
            display: none;
          }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
