import React, {useState} from "react"
import {Link} from "react-router-dom"
import {useAuth} from "../context/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    profilePic: null,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const {register} = useAuth()

  const handleChange = (e) => {
    if (e.target.name === "profilePic") {
      setFormData({
        ...formData,
        profilePic: e.target.files[0],
      })
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Create FormData for file upload
    const data = new FormData()
    data.append("name", formData.name)
    data.append("email", formData.email)
    data.append("password", formData.password)
    data.append("gender", formData.gender)
    if (formData.profilePic) {
      data.append("file", formData.profilePic)
    }

    const result = await register(data)

    if (!result.success) {
      setError(result.message)
    }

    setLoading(false)
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{textAlign: "center", marginBottom: "2rem", color: "#333"}}>
          Register
        </h2>

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="profilePic">Profile Picture</label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
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
          {loading ? "Registering..." : "Register"}
        </button>

        <p style={{textAlign: "center"}}>
          Already have an account?{" "}
          <Link to="/login" style={{color: "#007bff"}}>
            Login here
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register
