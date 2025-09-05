import axios from "axios"

const API_BASE_URL = "https://mern-social-app-mlcm.onrender.com/"

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Auth API calls
export const authAPI = {
  register: async (formData) => {
    const response = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials)
    return response.data
  },

  logout: async () => {
    const response = await api.get("/auth/logout")
    return response.data
  },
}

// User API calls
export const userAPI = {
  getMyProfile: async () => {
    const response = await api.get("/user/me")
    return response.data
  },

  getUserProfile: async (userId) => {
    const response = await api.get(`/user/${userId}`)
    return response.data
  },

  followUser: async (userId) => {
    const response = await api.post(`/user/follow/${userId}`)
    return response.data
  },

  getUserFollowData: async (userId) => {
    const response = await api.get(`/user/followdata/${userId}`)
    return response.data
  },

  updateProfile: async (formData) => {
    const response = await api.put(
      `/user/${formData.get("userId")}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    return response.data
  },

  updatePassword: async (userId, passwordData) => {
    const response = await api.post(`/user/${userId}`, passwordData)
    return response.data
  },

  searchUsers: async (query) => {
    const response = await api.get(
      `/user/search?query=${encodeURIComponent(query)}`
    )
    return response.data
  },
}

// Post API calls
export const postAPI = {
  createPost: async (formData, type = "post") => {
    const response = await api.post(`/post/new?type=${type}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  getAllPosts: async () => {
    const response = await api.get("/post/all")
    return response.data
  },

  deletePost: async (postId) => {
    const response = await api.delete(`/post/${postId}`)
    return response.data
  },

  updatePost: async (postId, data) => {
    const response = await api.put(`/post/${postId}`, data)
    return response.data
  },

  likePost: async (postId) => {
    const response = await api.post(`/post/like/${postId}`)
    return response.data
  },

  commentOnPost: async (postId, comment) => {
    const response = await api.post(`/post/comment/${postId}`, {comment})
    return response.data
  },

  deleteComment: async (postId, commentId) => {
    const response = await api.delete(`/post/comment/${postId}`, {
      data: {commentId},
    })
    return response.data
  },
}

// Chat API calls
export const chatAPI = {
  sendMessage: async (receiverId, message) => {
    const response = await api.post(`/message/send/${receiverId}`, {message})
    return response.data
  },

  getMessages: async (userId) => {
    const response = await api.get(`/message/get/${userId}`)
    return response.data
  },

  getAllChats: async () => {
    const response = await api.get("/message/chats")
    return response.data
  },

  markMessagesAsSeen: async (userId) => {
    const response = await api.put(`/message/seen/${userId}`)
    return response.data
  },

  getTotalUnreadCount: async () => {
    const response = await api.get("/message/unread-count")
    return response.data
  },
}

// Notification API calls
export const notificationAPI = {
  getNotifications: async (page = 1, limit = 20) => {
    const response = await api.get(`/notifications?page=${page}&limit=${limit}`)
    return response.data
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count")
    return response.data
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  markAllAsRead: async () => {
    const response = await api.put("/notifications/mark-all-read")
    return response.data
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  },
}

export default api
