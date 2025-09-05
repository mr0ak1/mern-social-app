import React, {useState, useRef, useEffect} from "react"
import {userAPI} from "../services/api"
import UserCard from "./UserCard"

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === "") {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await userAPI.searchUsers(searchQuery)
      setResults(response.users || [])
      setShowResults(true)
    } catch (error) {
      console.error("Search failed:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    // Debounce search
    clearTimeout(handleInputChange.timeout)
    handleInputChange.timeout = setTimeout(() => {
      handleSearch(value)
    }, 300)
  }

  const handleResultClick = () => {
    setShowResults(false)
    setQuery("")
    setResults([])
  }

  return (
    <div
      ref={searchRef}
      className="search-bar-container"
      style={{position: "relative", width: "100%", maxWidth: "400px"}}
    >
      <div style={{position: "relative"}}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search users..."
          className="mobile-search-input"
          style={{
            width: "100%",
            padding: "0.5rem 1rem",
            border: "1px solid #ddd",
            borderRadius: "25px",
            fontSize: "1rem",
            outline: "none",
          }}
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true)
            }
          }}
        />
        {isLoading && (
          <div
            className="search-loading"
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "0.8rem",
              color: "#666",
            }}
          >
            Searching...
          </div>
        )}
      </div>

      {showResults && (
        <div
          className="search-results"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "10px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxHeight: "400px",
            overflowY: "auto",
            marginTop: "0.5rem",
          }}
        >
          {results.length === 0 ? (
            <div
              className="no-results"
              style={{padding: "1rem", textAlign: "center", color: "#666"}}
            >
              {query ? "No users found" : "Start typing to search users..."}
            </div>
          ) : (
            results.map((user) => (
              <div key={user._id} onClick={handleResultClick}>
                <UserCard user={user} />
              </div>
            ))
          )}
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .search-bar-container {
            width: 100% !important;
            max-width: none !important;
          }

          .mobile-search-input {
            padding: 0.75rem 1rem !important;
            font-size: 16px !important; /* Prevent zoom on iOS */
            border-radius: 20px !important;
            border: 2px solid #ddd !important;
          }

          .mobile-search-input:focus {
            border-color: #007bff !important;
          }

          .search-results {
            left: -10px !important;
            right: -10px !important;
            max-height: 300px !important;
            border-radius: 12px !important;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15) !important;
          }

          .no-results {
            padding: 1.5rem 1rem !important;
            font-size: 0.9rem !important;
          }

          .search-loading {
            right: 1rem !important;
            font-size: 0.75rem !important;
          }
        }

        @media (max-width: 480px) {
          .search-results {
            left: -15px !important;
            right: -15px !important;
            max-height: 250px !important;
          }
        }
      `}</style>
    </div>
  )
}

export default SearchBar
