import React, {useState, useEffect} from "react"
import {useLocation} from "react-router-dom"
import ChatList from "../components/ChatList"
import ChatWindow from "../components/ChatWindow"

const Chat = () => {
  const location = useLocation()
  const [selectedUser, setSelectedUser] = useState(null)
  const [showChatWindow, setShowChatWindow] = useState(false)
  const [refreshChatList, setRefreshChatList] = useState(0)

  // Check if a user was passed from profile page
  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedUser(location.state.selectedUser)
      setShowChatWindow(true)
    }
  }, [location.state])

  const handleChatSelect = (user) => {
    setSelectedUser(user)
    setShowChatWindow(true)
    // Refresh chat list to update unread counts
    setRefreshChatList((prev) => prev + 1)
  }

  const handleBack = () => {
    setShowChatWindow(false)
    setSelectedUser(null)
    // Refresh chat list when going back
    setRefreshChatList((prev) => prev + 1)
  }

  const handleMessagesMarkedAsSeen = () => {
    // Callback to refresh chat list when messages are marked as seen
    setRefreshChatList((prev) => prev + 1)
  }

  return (
    <div className="container" style={{padding: "2rem 0"}}>
      <div
        style={{
          height: "80vh",
          border: "1px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
          display: "flex",
          backgroundColor: "white",
        }}
      >
        {/* Mobile Layout */}
        <div
          className="mobile-layout"
          style={{
            display: "none",
            width: "100%",
            height: "100%",
          }}
        >
          {!showChatWindow ? (
            <ChatList
              onChatSelect={handleChatSelect}
              selectedChatId={selectedUser?._id}
              refreshTrigger={refreshChatList}
            />
          ) : (
            <ChatWindow
              selectedUser={selectedUser}
              onBack={handleBack}
              onMessagesMarkedAsSeen={handleMessagesMarkedAsSeen}
            />
          )}
        </div>

        {/* Desktop Layout */}
        <div
          className="desktop-layout"
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{width: "350px", flexShrink: 0}}>
            <ChatList
              onChatSelect={handleChatSelect}
              selectedChatId={selectedUser?._id}
              refreshTrigger={refreshChatList}
            />
          </div>
          <div style={{flex: 1}}>
            <ChatWindow
              selectedUser={selectedUser}
              onBack={handleBack}
              onMessagesMarkedAsSeen={handleMessagesMarkedAsSeen}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-layout {
            display: none !important;
          }
          .mobile-layout {
            display: block !important;
          }
          .mobile-back-btn {
            display: block !important;
          }
        }
      `}</style>
    </div>
  )
}

export default Chat
