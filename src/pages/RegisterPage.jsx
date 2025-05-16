"use client"

import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./RegisterPage.css"

function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { register, user } = useAuth()
  const navigate = useNavigate()

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin/dashboard" : "/dashboard")
    }
  }, [user, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      await register(name, email, password)
      setSuccess("Registration successful! You can now login.")

      // Reset form
      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (error) {
      setError(error.toString())
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-content">
          <h1 className="register-title">Team Feedback System</h1>
          <p className="register-subtitle">Create an account to get started with anonymous team feedback.</p>

          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Register</h2>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
              <label htmlFor="confirm-password" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn register-btn" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Register"}
            </button>

            <p className="register-login-link">
              Already have an account? <Link to="/">Login</Link>
            </p>
          </form>
        </div>

        <div className="register-image">
          <img src="/images/team-feedback.jpg" alt="Team Feedback" />
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
