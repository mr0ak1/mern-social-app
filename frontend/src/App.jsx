import React from "react"
import {Routes, Route, Navigate} from "react-router-dom"
import {useAuth} from "./context/AuthContext"
import {UnreadProvider} from "./context/UnreadContext.jsx"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Search from "./pages/Search"
import Chat from "./pages/Chat"
import "./App.css"

function App() {
  const {user, loading} = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <UnreadProvider>
      <div className="App">
        {user && <Navbar />}
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={user ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/search"
            element={user ? <Search /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:id"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={user ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat"
            element={user ? <Chat /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </UnreadProvider>
  )
}

export default App
