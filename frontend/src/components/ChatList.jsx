import React, {useState, useEffect} from "react"
import {useAuth} from "../context/AuthContext"
import {chatAPI} from "../services/api"

const ChatList = ({onChatSelect, selectedChatId, refreshTrigger}) => {
  const {user} = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchChats()
  }, [refreshTrigger])

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getAllChats()
      setChats(response)
    } catch (error) {
      console.error("Failed to fetch chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const getOtherUser = (chatUsers) => {
    return chatUsers.find((chatUser) => chatUser._id !== user._id)
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "now"
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
      <div style={{padding: "2rem", textAlign: "center"}}>Loading chats...</div>
    )
  }

  return (
    <div
      style={{
        height: "100%",
        backgroundColor: "white",
        borderRight: "1px solid #eee",
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid #eee",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h3 style={{margin: 0}}>Messages</h3>
      </div>

      <div style={{height: "calc(100% - 80px)", overflowY: "auto"}}>
        {chats.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#666",
            }}
          >
            <div style={{fontSize: "2rem", marginBottom: "1rem"}}>💬</div>
            <p>No conversations yet</p>
            <p style={{fontSize: "0.9rem"}}>
              Start chatting by visiting someone's profile!
            </p>
          </div>
        ) : (
          chats.map((chat) => {
            const otherUser = getOtherUser(chat.users)
            const isSelected = selectedChatId === otherUser?._id

            return (
              <div
                key={chat._id}
                onClick={() => onChatSelect(otherUser)}
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #f0f0f0",
                  cursor: "pointer",
                  backgroundColor: isSelected
                    ? "#e3f2fd"
                    : chat.unreadCount > 0
                    ? "#f8f9ff"
                    : "transparent",
                  transition: "background-color 0.2s",
                  borderLeft:
                    chat.unreadCount > 0
                      ? "3px solid #007bff"
                      : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor =
                      chat.unreadCount > 0 ? "#f0f4ff" : "#f8f9fa"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.target.style.backgroundColor =
                      chat.unreadCount > 0 ? "#f8f9ff" : "transparent"
                  }
                }}
              >
                <div style={{display: "flex", alignItems: "center"}}>
                  {otherUser?.profilePic?.url && (
                    <img
                      src={otherUser.profilePic.url}
                      alt={otherUser.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "1rem",
                      }}
                    />
                  )}
                  <div style={{flex: 1, minWidth: 0}}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "1rem",
                          fontWeight: chat.unreadCount > 0 ? "600" : "500",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: chat.unreadCount > 0 ? "#000" : "inherit",
                        }}
                      >
                        {otherUser?.name}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "0.75rem",
                            color: "#666",
                          }}
                        >
                          {formatTime(chat.updatedAt)}
                        </span>
                        {chat.unreadCount > 0 && (
                          <span
                            style={{
                              backgroundColor: "#007bff",
                              color: "white",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              fontSize: "0.7rem",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: "bold",
                              minWidth: "20px",
                            }}
                          >
                            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    {chat.latestMessage && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.9rem",
                          color: chat.unreadCount > 0 ? "#333" : "#666",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: chat.unreadCount > 0 ? "500" : "normal",
                        }}
                      >
                        {chat.latestMessage.sender === user._id ? "You: " : ""}
                        {chat.latestMessage.text}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChatList
