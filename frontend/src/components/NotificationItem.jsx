import React from "react"
import {useNavigate} from "react-router-dom"
import {notificationAPI} from "../services/api"

const NotificationItem = ({notification, onUpdate}) => {
  const navigate = useNavigate()
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const handleMarkAsRead = async () => {
    if (!notification.read) {
      try {
        await notificationAPI.markAsRead(notification._id)
        onUpdate()
      } catch (error) {
        console.error("Failed to mark notification as read:", error)
      }
    }
  }

  const handleNotificationClick = async () => {
    await handleMarkAsRead()

    if (notification.type === "message") {
      navigate("/chat", {
        state: {
          selectedUser: notification.sender,
        },
      })
    } else if (
      notification.type === "follow" ||
      notification.type === "unfollow"
    ) {
      navigate(`/profile/${notification.sender._id}`)
    } else if (
      notification.type === "like" ||
      notification.type === "comment"
    ) {
      navigate("/")
    }
  }

  const handleDelete = async () => {
    try {
      await notificationAPI.deleteNotification(notification._id)
      onUpdate()
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "follow":
        return "👥"
      case "unfollow":
        return "👋"
      case "like":
        return "❤️"
      case "comment":
        return "💬"
      case "message":
        return "📨"
      default:
        return "🔔"
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case "follow":
        return "#28a745"
      case "unfollow":
        return "#ffc107"
      case "like":
        return "#dc3545"
      case "comment":
        return "#007bff"
      case "message":
        return "#17a2b8"
      default:
        return "#6c757d"
    }
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: "1rem",
        borderBottom: "1px solid #f0f0f0",
        backgroundColor: notification.read ? "white" : "#f8f9fa",
        cursor: "pointer",
        position: "relative",
      }}
      onClick={handleNotificationClick}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div
          style={{
            position: "absolute",
            left: "0.5rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: "#007bff",
          }}
        />
      )}

      {/* Notification icon */}
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: getNotificationColor(notification.type),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: "1rem",
          fontSize: "1.2rem",
        }}
      >
        {getNotificationIcon(notification.type)}
      </div>

      {/* Sender profile picture */}
      {notification.sender?.profilePic?.url && (
        <img
          src={notification.sender.profilePic.url}
          alt={notification.sender.name}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: "1rem",
          }}
        />
      )}

      {/* Notification content */}
      <div style={{flex: 1, minWidth: 0}}>
        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: "#333",
            fontWeight: notification.read ? "normal" : "500",
          }}
        >
          {notification.message}
        </p>
        <p
          style={{
            margin: "0.25rem 0 0 0",
            fontSize: "0.75rem",
            color: "#666",
          }}
        >
          {formatTime(notification.createdAt)}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleDelete()
        }}
        style={{
          background: "none",
          border: "none",
          color: "#666",
          cursor: "pointer",
          fontSize: "1rem",
          padding: "0.25rem",
          borderRadius: "4px",
          opacity: 0.7,
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#f0f0f0"
          e.target.style.opacity = 1
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "transparent"
          e.target.style.opacity = 0.7
        }}
        title="Delete notification"
      >
        ×
      </button>
    </div>
  )
}

export default NotificationItem
