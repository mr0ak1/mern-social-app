import React from "react"
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

const MessageBubble = ({message}) => {
  const {user} = useAuth()
  const navigate = useNavigate()
  const isOwnMessage = message.sender._id === user._id

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleNameClick = () => {
    if (!isOwnMessage) {
      navigate(`/profile/${message.sender._id}`)
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        marginBottom: "0.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          padding: "0.75rem 1rem",
          borderRadius: "18px",
          backgroundColor: isOwnMessage ? "#007bff" : "#f1f1f1",
          color: isOwnMessage ? "white" : "#333",
          position: "relative",
        }}
      >
        {!isOwnMessage && (
          <div
            style={{
              fontSize: "0.75rem",
              fontWeight: "500",
              marginBottom: "0.25rem",
              color: "#007bff",
              cursor: "pointer",
            }}
            onClick={handleNameClick}
          >
            {message.sender.name}
          </div>
        )}
        <div style={{marginBottom: "0.25rem"}}>{message.text}</div>
        <div
          style={{
            fontSize: "0.7rem",
            opacity: 0.7,
            textAlign: "right",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.25rem",
          }}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwnMessage && (
            <span
              style={{
                fontSize: "0.8rem",
                color: message.seen ? "#4CAF50" : "#ccc",
              }}
              title={message.seen ? "Seen" : "Delivered"}
            >
              {message.seen ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
