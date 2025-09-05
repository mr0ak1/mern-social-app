import React, {createContext, useContext, useState, useEffect} from "react"
import {useAuth} from "./AuthContext"
import {chatAPI} from "../services/api"

const UnreadContext = createContext()

export const useUnread = () => {
  const context = useContext(UnreadContext)
  if (!context) {
    throw new Error("useUnread must be used within an UnreadProvider")
  }
  return context
}

export const UnreadProvider = ({children}) => {
  const {user} = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    if (user) {
      try {
        const data = await chatAPI.getTotalUnreadCount()
        setUnreadCount(data.totalUnreadCount)
      } catch (error) {
        console.error("Failed to fetch unread count:", error)
        setUnreadCount(0)
      }
    } else {
      setUnreadCount(0)
    }
  }

  const refreshUnreadCount = () => {
    fetchUnreadCount()
  }

  useEffect(() => {
    fetchUnreadCount()

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [user])

  const value = {
    unreadCount,
    refreshUnreadCount,
  }

  return (
    <UnreadContext.Provider value={value}>{children}</UnreadContext.Provider>
  )
}
