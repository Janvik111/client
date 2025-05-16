"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../components/Header"
import FeedbackList from "../components/FeedbackList"
import FeedbackChart from "../components/FeedbackChart"
import "./AdminDashboard.css"

function AdminDashboard() {
  const [feedback, setFeedback] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [activeTab, setActiveTab] = useState("all-feedback")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Fetch all feedback and team members
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const [feedbackResponse, usersResponse] = await Promise.all([
          axios.get("/api/feedback"),
          axios.get("/api/users"),
        ])

        setFeedback(feedbackResponse.data.feedback)
        setTeamMembers([{ id: "all", name: "All Team Members" }, ...usersResponse.data.users])
      } catch (error) {
        setError("Failed to load data. Please try again later.")
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter feedback based on selected employee
  const filteredFeedback =
    selectedEmployee === "all" ? feedback : feedback.filter((item) => item.recipientId === selectedEmployee)

  // Calculate category statistics
  const categoryStats = feedback.reduce((acc, item) => {
    if (item.categories) {
      item.categories.forEach((category) => {
        if (!acc[category]) {
          acc[category] = 0
        }
        acc[category]++
      })
    }
    return acc
  }, {})

  // Sort categories by frequency
  const sortedCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }))

  // Get unique recipients count
  const uniqueRecipients = new Set(feedback.map((item) => item.recipientId)).size

  // Get most common category
  const mostCommonCategory = sortedCategories.length > 0 ? sortedCategories[0].category : "N/A"

  return (
    <div className="admin-dashboard">
      <Header />

      <main className="dashboard-main">
        <div className="container">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p className="dashboard-description">
              View and manage team feedback. All feedback is anonymous to protect employee privacy.
            </p>
          </div>

          <div className="dashboard-overview">
            <div className="overview-charts">
              <div className="chart-container">
                <h2>Feedback Categories</h2>
                <FeedbackChart data={sortedCategories} />
              </div>
            </div>

            <div className="overview-stats">
              <div className="stats-card">
                <h3>Total Feedback</h3>
                {isLoading ? <div className="stats-loading"></div> : <p className="stats-value">{feedback.length}</p>}
              </div>

              <div className="stats-card">
                <h3>Team Members with Feedback</h3>
                {isLoading ? <div className="stats-loading"></div> : <p className="stats-value">{uniqueRecipients}</p>}
              </div>

              <div className="stats-card">
                <h3>Most Common Category</h3>
                {isLoading ? (
                  <div className="stats-loading"></div>
                ) : (
                  <p className="stats-value">{mostCommonCategory}</p>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-tabs">
            <div className="tabs-header">
              <button
                className={`tab-btn ${activeTab === "all-feedback" ? "active" : ""}`}
                onClick={() => setActiveTab("all-feedback")}
              >
                All Feedback
              </button>
              <button
                className={`tab-btn ${activeTab === "by-employee" ? "active" : ""}`}
                onClick={() => setActiveTab("by-employee")}
              >
                By Employee
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "all-feedback" && (
                <FeedbackList
                  feedback={feedback}
                  isLoading={isLoading}
                  error={error}
                  emptyMessage="There is no feedback in the system yet."
                  showRecipient={true}
                />
              )}

              {activeTab === "by-employee" && (
                <div className="by-employee-content">
                  <div className="employee-filter">
                    <label htmlFor="employee-filter" className="form-label">
                      Filter by Employee
                    </label>
                    <select
                      id="employee-filter"
                      className="form-select"
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                    >
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FeedbackList
                    feedback={filteredFeedback}
                    isLoading={isLoading}
                    error={error}
                    emptyMessage={
                      selectedEmployee === "all"
                        ? "There is no feedback in the system yet."
                        : `${teamMembers.find((m) => m.id === selectedEmployee)?.name} hasn't received any feedback yet.`
                    }
                    showRecipient={selectedEmployee === "all"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
