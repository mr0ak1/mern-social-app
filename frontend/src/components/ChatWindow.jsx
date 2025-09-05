import React, {useState, useEffect, useRef} from "react"
import {useNavigate} from "react-router-dom"
import {useAuth} from "../context/AuthContext"
import {useUnread} from "../context/UnreadContext.jsx"
import {chatAPI} from "../services/api"
import MessageBubble from "./MessageBubble"

const ChatWindow = ({selectedUser, onBack, onMessagesMarkedAsSeen}) => {
  const {user} = useAuth()
  const navigate = useNavigate()
  const {refreshUnreadCount} = useUnread()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (selectedUser) {
      fetchMessages()
      markMessagesAsSeen()
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mark messages as seen when user scrolls to bottom or interacts with chat
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedUser) {
        markMessagesAsSeen()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("focus", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("focus", handleVisibilityChange)
    }
  }, [selectedUser])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }

  const fetchMessages = async () => {
    if (!selectedUser) return

    setLoading(true)
    try {
      const response = await chatAPI.getMessages(selectedUser._id)
      setMessages(response)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const markMessagesAsSeen = async () => {
    if (!selectedUser) return

    try {
      await chatAPI.markMessagesAsSeen(selectedUser._id)
      // Refresh messages to update seen status
      fetchMessages()
      // Refresh unread count in navbar
      refreshUnreadCount()
      // Notify parent component to refresh chat list
      if (onMessagesMarkedAsSeen) {
        onMessagesMarkedAsSeen()
      }
    } catch (error) {
      console.error("Failed to mark messages as seen:", error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const response = await chatAPI.sendMessage(
        selectedUser._id,
        newMessage.trim()
      )

      // Add the new message to the list with sender info
      const messageWithSender = {
        ...response,
        sender: {
          _id: user._id,
          name: user.name,
          profilePic: user.profilePic,
        },
      }

      setMessages((prev) => [...prev, messageWithSender])
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    } finally {
      setSending(false)
    }
  }

  const handleProfileClick = () => {
    navigate(`/profile/${selectedUser._id}`)
  }

  if (!selectedUser) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f9fa",
          color: "#666",
          textAlign: "center",
        }}
      >
        <div>
          <div style={{fontSize: "3rem", marginBottom: "1rem"}}>💬</div>
          <h3>Select a conversation</h3>
          <p>Choose from your existing conversations or start a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #eee",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            marginRight: "1rem",
            padding: "0.5rem",
            borderRadius: "50%",
            display: "none",
            color: "#007bff",
          }}
          className="mobile-back-btn"
        >
          ←
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            cursor: "pointer",
          }}
          onClick={handleProfileClick}
        >
          {selectedUser.profilePic?.url && (
            <img
              src={selectedUser.profilePic.url}
              alt={selectedUser.name}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: "1rem",
              }}
            />
          )}
          <div>
            <h3 style={{margin: 0, fontSize: "1.1rem", color: "#007bff"}}>
              {selectedUser.name}
            </h3>
            <p style={{margin: 0, fontSize: "0.9rem", color: "#666"}}>
              {selectedUser.email}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="chat-messages"
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          backgroundColor: "#f8f9fa",
        }}
      >
        {loading ? (
          <div style={{textAlign: "center", color: "#666"}}>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#666",
              padding: "2rem",
            }}
          >
            <div style={{fontSize: "2rem", marginBottom: "1rem"}}>👋</div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={handleSendMessage}
        className="message-input-form"
        style={{
          padding: "1rem",
          borderTop: "1px solid #eee",
          backgroundColor: "white",
        }}
      >
        <div style={{display: "flex", gap: "0.5rem"}}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending}
            className="message-input"
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              border: "1px solid #ddd",
              borderRadius: "25px",
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            style={{
              padding: "0.75rem 1.5rem",
              border: "none",
              borderRadius: "25px",
              backgroundColor:
                newMessage.trim() && !sending ? "#007bff" : "#ccc",
              color: "white",
              cursor: newMessage.trim() && !sending ? "pointer" : "not-allowed",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
      </form>
      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-back-btn {
            display: block !important;
          }

          .post-header {
            padding: 0.8rem !important;
          }

          .post-content {
            padding: 0.8rem !important;
          }

          .post-actions {
            padding: 0.8rem !important;
            flex-wrap: wrap !important;
          }

          .chat-messages {
            padding: 0.8rem !important;
          }

          .message-input-form {
            padding: 0.8rem !important;
          }

          .message-input {
            font-size: 16px !important; /* Prevent zoom on iOS */
          }
        }
      `}</style>
    </div>
  )
}

export default ChatWindow
