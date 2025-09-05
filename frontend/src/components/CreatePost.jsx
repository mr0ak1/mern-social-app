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
    <div
      className="post-card mobile-create-post"
      style={{marginBottom: "2rem"}}
    >
      {!isOpen ? (
        <div className="post-content">
          <button
            onClick={() => setIsOpen(true)}
            className="btn btn-primary mobile-create-btn"
            style={{width: "100%"}}
          >
            Create New Post
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mobile-form">
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
                className="mobile-select"
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
                className="mobile-textarea"
                placeholder="Write a caption..."
                style={{fontSize: "16px"}} // Prevent zoom on iOS
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
                className="mobile-file-input"
                required
              />
            </div>

            <div
              className="mobile-button-group"
              style={{display: "flex", gap: "1rem"}}
            >
              <button
                type="submit"
                className="btn btn-primary mobile-submit-btn"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Post"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn btn-secondary mobile-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-create-post {
            margin: 0.5rem 0.5rem 1rem 0.5rem !important;
            border-radius: 8px !important;
          }

          .post-content {
            padding: 1rem !important;
          }

          .mobile-create-btn {
            padding: 1rem !important;
            font-size: 1.1rem !important;
            font-weight: 600 !important;
          }

          .mobile-form h3 {
            margin-bottom: 1rem !important;
            text-align: center !important;
          }

          .form-group {
            margin-bottom: 1rem !important;
          }

          .form-group label {
            font-weight: 600 !important;
            margin-bottom: 0.5rem !important;
            display: block !important;
          }

          .mobile-select,
          .mobile-textarea,
          .mobile-file-input {
            width: 100% !important;
            padding: 0.75rem !important;
            border: 2px solid #ddd !important;
            border-radius: 8px !important;
            font-size: 16px !important;
          }

          .mobile-textarea {
            resize: vertical !important;
            min-height: 80px !important;
          }

          .mobile-button-group {
            flex-direction: column !important;
            gap: 0.5rem !important;
            margin-top: 1.5rem !important;
          }

          .mobile-submit-btn,
          .mobile-cancel-btn {
            width: 100% !important;
            padding: 0.75rem !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
          }
        }

        @media (max-width: 480px) {
          .mobile-create-post {
            margin: 0.25rem 0.25rem 1rem 0.25rem !important;
          }

          .post-content {
            padding: 0.8rem !important;
          }

          .mobile-create-btn {
            padding: 0.8rem !important;
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  )
}

export default CreatePost
