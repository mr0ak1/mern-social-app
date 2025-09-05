import React, {useState} from "react"
import {Link} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const {login} = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(formData)

    if (!result.success) {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{textAlign: "center", marginBottom: "2rem", color: "#333"}}>
          Login
        </h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{width: "100%", marginBottom: "1rem"}}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={{textAlign: "center"}}>
          Don't have an account?{" "}
          <Link to="/register" style={{color: "#007bff"}}>
            Register here
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
