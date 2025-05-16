"use client"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Header.css"

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="header">
      <div className="container header-container">
        <div className="header-logo">
          <h1>Team Feedback</h1>
        </div>

        {user && (
          <div className="header-user">
            <span className="user-name">{user.name}</span>
            <span className="user-role">{user.role === "admin" ? "Admin" : "Employee"}</span>
            <button className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
