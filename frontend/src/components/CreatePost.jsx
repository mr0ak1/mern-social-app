import React, {useState} from "react"
import {postAPI} from "../services/api"

const CreatePost = ({onPostCreated}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    caption: "",
    file: null,
    type: "post",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({
        ...formData,
        file: e.target.files[0],
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

    if (!formData.file) {
      setError("Please select a file")
      setLoading(false)
      return
    }

    const data = new FormData()
    data.append("caption", formData.caption)
    data.append("file", formData.file)

    try {
      await postAPI.createPost(data, formData.type)
      setFormData({caption: "", file: null, type: "post"})
      setIsOpen(false)
      onPostCreated()
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create post")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({caption: "", file: null, type: "post"})
    setError("")
    setIsOpen(false)
  }

  return (
    <div className="post-card" style={{marginBottom: "2rem"}}>
      {!isOpen ? (
        <div className="post-content">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-primary"
            style={{width: "100%"}}
          >
            Create New Post
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="post-content">
            <h3>Create New Post</h3>

            {error && <div className="error">{error}</div>}

            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="post">Post (Image)</option>
                <option value="reel">Reel (Video)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="caption">Caption</label>
              <textarea
                id="caption"
                name="caption"
                value={formData.caption}
                onChange={handleChange}
                rows="3"
                placeholder="Write a caption..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="file">
                {formData.type === "reel" ? "Video File" : "Image File"}
              </label>
              <input
                type="file"
                id="file"
                name="file"
                accept={formData.type === "reel" ? "video/*" : "image/*"}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{display: "flex", gap: "1rem"}}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreatePost
