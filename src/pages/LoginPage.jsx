"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./LoginPage.css"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("employee")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login, user } = useAuth()
  const navigate = useNavigate()

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard")
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const user = await login(email, password, role)
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard")
    } catch (error) {
      setError(error.toString())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">Team Feedback System</h1>
          <p className="login-subtitle">
            A platform for anonymous team feedback. Improve collaboration and communication within your team.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    value="employee"
                    checked={role === "employee"}
                    onChange={() => setRole("employee")}
                  />
                  Employee
                </label>
                <label className="radio-label">
                  <input type="radio" value="admin" checked={role === "admin"} onChange={() => setRole("admin")} />
                  Admin
                </label>
              </div>
            </div>

            <button type="submit" className="btn login-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="login-register-link">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>

        <div className="login-image">
          <img src="/images/team-feedback.jpg" alt="Team Feedback" />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
