import React, {createContext, useContext, useState, useEffect} from "react"
import {authAPI, userAPI} from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await userAPI.getMyProfile()
      setUser(response.user)
    } catch (error) {
      console.log("Not authenticated")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials)
      setUser(response.user)
      return {success: true, message: response.message}
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (formData) => {
    try {
      const response = await authAPI.register(formData)
      setUser(response.user)
      return {success: true, message: response.message}
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      setUser(null) // Still logout on client side
    }
  }

  const updateUser = async () => {
    try {
      const response = await userAPI.getMyProfile()
      setUser(response.user)
    } catch (error) {
      console.error("Failed to update user:", error)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
