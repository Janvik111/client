"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("token")

        if (token) {
          // Set default auth header for all requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Verify token and get user data
          const response = await axios.get("/api/auth/me")
          setUser(response.data.user)
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email, password, role) => {
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
        role,
      })

      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem("token", token)

      // Set default auth header for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(user)
      return user
    } catch (error) {
      throw error.response?.data?.error || "Login failed"
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      })

      return response.data.user
    } catch (error) {
      throw error.response?.data?.error || "Registration failed"
    }
  }

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token")

    // Remove auth header
    delete axios.defaults.headers.common["Authorization"]

    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
