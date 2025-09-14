import React, {useState, useEffect, useRef} from "react"
import {notificationAPI} from "../services/api"
import NotificationItem from "./NotificationItem"

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchUnreadCount()

    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount()
      setUnreadCount(response.unreadCount)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }

  const fetchNotifications = async () => {
    if (loading) return

    setLoading(true)
    try {
      const response = await notificationAPI.getNotifications(1, 10)
      setNotifications(response.notifications)
      setUnreadCount(response.unreadCount)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBellClick = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      fetchNotifications()
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setNotifications((prev) => prev.map((notif) => ({...notif, read: true})))
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const handleNotificationUpdate = () => {
    fetchNotifications()
  }

  return (
    <div style={{position: "relative"}} ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={handleBellClick}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          padding: "0.5rem",
          borderRadius: "50%",
          color: "#333",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#f0f0f0")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
        title="Notifications"
      >
        🔔
        {/* Unread count badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0.25rem",
              right: "0.25rem",
              backgroundColor: "#dc3545",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "0.7rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            width: "350px",
            maxHeight: "500px",
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "1rem",
              borderBottom: "1px solid #f0f0f0",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px 8px 0 0",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{margin: 0, fontSize: "1.1rem"}}>Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    textDecoration: "underline",
                  }}
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div style={{maxHeight: "400px", overflowY: "auto"}}>
            {loading ? (
              <div
                style={{padding: "2rem", textAlign: "center", color: "#666"}}
              >
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div
                style={{padding: "2rem", textAlign: "center", color: "#666"}}
              >
                <div style={{fontSize: "2rem", marginBottom: "1rem"}}>🔔</div>
                <p>No notifications yet</p>
                <p style={{fontSize: "0.9rem"}}>
                  You'll see notifications here when someone follows you, likes
                  your posts, comments on your posts, or sends you a message!
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onUpdate={handleNotificationUpdate}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: "0.75rem",
                borderTop: "1px solid #f0f0f0",
                backgroundColor: "#f8f9fa",
                textAlign: "center",
                borderRadius: "0 0 8px 8px",
              }}
            >
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  textDecoration: "underline",
                }}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
