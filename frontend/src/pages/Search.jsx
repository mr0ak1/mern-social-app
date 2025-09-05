import React, {useState} from "react"
import {userAPI} from "../services/api"
import UserCard from "../components/UserCard"

const Search = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!query || query.trim() === "") {
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await userAPI.searchUsers(query)
      setResults(response.users || [])
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container" style={{marginTop: "2rem"}}>
      <div style={{maxWidth: "600px", margin: "0 auto"}}>
        <h2 style={{textAlign: "center", marginBottom: "2rem"}}>Find Users</h2>

        <form onSubmit={handleSearch} style={{marginBottom: "2rem"}}>
          <div style={{display: "flex", gap: "1rem"}}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users by name or email..."
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                border: "1px solid #ddd",
                borderRadius: "5px",
                fontSize: "1rem",
                outline: "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#007bff")}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !query.trim()}
              style={{padding: "0.75rem 1.5rem"}}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {isLoading && (
          <div style={{textAlign: "center", padding: "2rem", color: "#666"}}>
            <div>🔍 Searching for users...</div>
          </div>
        )}

        {!isLoading && hasSearched && (
          <div>
            {results.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem 2rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "10px",
                  color: "#666",
                }}
              >
                <div style={{fontSize: "3rem", marginBottom: "1rem"}}>😔</div>
                <h3>No users found</h3>
                <p>Try searching with different keywords</p>
              </div>
            ) : (
              <div>
                <h3 style={{marginBottom: "1rem", color: "#333"}}>
                  Found {results.length} user{results.length !== 1 ? "s" : ""}
                </h3>
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                  }}
                >
                  {results.map((user, index) => (
                    <div key={user._id}>
                      <UserCard user={user} />
                      {index < results.length - 1 && (
                        <div style={{height: "1px", backgroundColor: "#eee"}} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 2rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "10px",
              color: "#666",
            }}
          >
            <div style={{fontSize: "3rem", marginBottom: "1rem"}}>🔍</div>
            <h3>Discover People</h3>
            <p>Search for users by their name or email address</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
